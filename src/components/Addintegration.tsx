import React, { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import MobileSideBar from "./MobileSideBar";
import { FaRegCircleStop } from "react-icons/fa6";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import "highlight.js/styles/github.css";
import dbService from "../firebase/utils/db";
import useAuth from "@/hooks/CurrentUser";
import cache from "../cache/cache";
import Loader from "../components/Loader";

interface Website {
  id: string;
  name: string;
  url?: string;
  type?: string;
}

interface WebsiteDataInput {
  name: string;
  url: string;
  type: string;
}

const AddIntegration: React.FC = () => {
  const [toggle, setToggle] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [websitedata, setWebsiteData] = useState<Website[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const { user, loading: userLoading } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [websiteDataInput, setWebsiteDataInput] = useState<WebsiteDataInput>({
    name: "",
    url: "",
    type: "",
  });
  const [highlightedCode, setHighlightedCode] = useState("");
  const [lastWebsiteId, setLastWebsiteId] = useState<string | null>(null);
  const db = new dbService();

  useEffect(() => {
    const fetchWebsites = async () => {
      if (!userLoading && user) {
        setFetchingData(true);
        const cachedData = cache.get(user.uid);
        if (cachedData) {
          setWebsiteData(cachedData.value);
        } else {
          const data = await db.fetchWebsites(user);
          setWebsiteData(Array.isArray(data) ? data : []);
        }
        setFetchingData(false);
      }
    };
    fetchWebsites();
  }, [userLoading, user]);

  hljs.registerLanguage("html", html);

  const generateCodeToCopy = (websiteId: string) => {
    const code = `<!-- Add this snippet to your website's HTML -->\n<iframe src="http://${window.location.hostname}:3000/integrate/${websiteId}"></iframe>`;
    const highlighted = hljs.highlight(code, { language: "html" }).value;
    setHighlightedCode(highlighted);
    setShowCode(true);
  };

  const handleDeleteWebsite = async (websiteName: string) => {
    try {
      setDeleting(true);

      await db.deleteWebsite(user!.uid, websiteName);

      setWebsiteData((prev) =>
        prev.filter((site) => site.name !== websiteName)
      );

      cache.set(
        user!.uid,
        websitedata.filter((site) => site.name !== websiteName)
      );
    } catch (error) {
      console.log("Error deleting website:", error);
    } finally {
      setDeleting(false);
    }
  };

  const saveData = async () => {
    try {
      if (Object.values(websiteDataInput).every((i) => i !== "")) {
        if (!userLoading && user) {
          setSavingData(true);
          const data = { uid: user.uid, email: user.email };
          await db.saveWebsite(data, websiteDataInput);
          setLastWebsiteId(websiteDataInput.url);
          setCurrentStep(3);
          generateCodeToCopy(websiteDataInput.url);
          setWebsiteDataInput({ name: "", url: "", type: "" });
          const updatedWebsites = await db.fetchWebsites(user);
          setWebsiteData(updatedWebsites);
        } else {
          console.log("User is loading or not authenticated");
        }
      } else {
        alert("Fill in all the details.");
      }
    } catch (error) {
      console.log("Error saving website:", error);
    } finally {
      setSavingData(false);
    }
  };

  const copyCode = async () => {
    try {
      if (lastWebsiteId) {
        await navigator.clipboard.writeText(
          `<iframe src="http://${window.location.hostname}:3000/integrate/${lastWebsiteId}"></iframe>`
        );
        alert("Code copied to clipboard!");
      } else {
        alert("No website ID available to copy.");
      }
    } catch (error) {
      console.log("Error copying code:", error);
    }
  };

  return (
    <>
      {(fetchingData || savingData || deleting) && <Loader />}
      <div className="md:ml-80">
        <nav className="md:hidden bg-[#18181b] p-7 w-screen border-b-[1px] border-[#272b2f] flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-300">TaskFeed</h1>
          <CiMenuFries
            size={26}
            color="white"
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
        </nav>
        {toggle && <MobileSideBar setToggle={setToggle} />}

        <div className="text-slate-300 flex flex-col md:flex-row items-center gap-8 md:gap-12 md:mt-16 justify-center">
          <div className="md:ml-52">
            <div className="bg-[#17161c] w-[45vw] mx-auto h-[80vh] rounded-xl overflow-y-scroll">
              <div className="space-y-3 border-b-[1px] border-stone-800 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 p-5 rounded-t-xl">
                <h1 className="text-2xl font-bold">Welcome to Integration</h1>
                <p className="font-semibold">Connect your website</p>
              </div>

              <div className="p-8">
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-semibold">
                        Connected Websites
                      </h1>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white  py-2 px-4 rounded-full"
                      >
                        Add Website
                      </button>
                    </div>
                    {websitedata?.length === 0 ? (
                      <div className="space-y-4 text-center pt-20">
                        <FaRegCircleStop
                          size={23}
                          color="white"
                          className="mx-auto"
                        />
                        <p className="text-xl font-semibold">
                          No websites connected yet
                        </p>
                        <p className="text-sm">
                          Add your first website to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 mt-5">
                        {websitedata?.map((i) => (
                          <div
                            key={i.id}
                            className="flex items-center gap-x-5 justify-between"
                          >
                            <h1 className="text-sm font-semibold">{i?.name}</h1>
                            <button
                              onClick={() => handleDeleteWebsite(i?.name)}
                              className="text-sm hover:text-red-500 ease-in-out duration-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="w-[85vw] md:w-[33vw] p-6 space-y-6 mt-0.5 mx-auto bg-[#171819] rounded-lg">
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website Name*</h1>
                      <input
                        type="text"
                        value={websiteDataInput.name}
                        onChange={(e) =>
                          setWebsiteDataInput({
                            ...websiteDataInput,
                            name: e.target.value,
                          })
                        }
                        className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website URL*</h1>
                      <input
                        type="text"
                        value={websiteDataInput.url}
                        onChange={(e) =>
                          setWebsiteDataInput({
                            ...websiteDataInput,
                            url: e.target.value,
                          })
                        }
                        className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <h1 className="font-semibold text-sm">Website Type*</h1>
                      <select
                        value={websiteDataInput.type}
                        onChange={(e) =>
                          setWebsiteDataInput({
                            ...websiteDataInput,
                            type: e.target.value,
                          })
                        }
                        className="bg-[#272c2e] px-2 py-2 outline-none md:w-[30vw] w-[75vw] rounded-lg cursor-pointer"
                      >
                        <option value="">Choose</option>
                        <option value="ecommerce">Ecommerce</option>
                        <option value="blog">Blog</option>
                      </select>
                    </div>

                    <button
                      onClick={saveData}
                      className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[75vw] md:w-[30vw] py-2 px-4 rounded-full"
                    >
                      Save Website
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h1 className="text-2xl font-semibold">
                      Integration Steps
                    </h1>
                    <div className="space-y-3 mt-5">
                      <h1 className="font-semibold text-sm">
                        Step 1: Copy Code
                      </h1>
                      <button
                        onClick={copyCode}
                        className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-full"
                      >
                        Copy Code
                      </button>
                    </div>
                    {showCode && (
                      <pre
                        className="bg-gray-800 text-white rounded-md p-4 mt-4"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                      ></pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddIntegration;
