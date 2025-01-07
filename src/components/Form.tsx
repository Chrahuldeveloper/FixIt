"use client";
import dbService from "@/firebase/utils/db";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoHappyOutline, IoSadOutline } from "react-icons/io5";
import { TbMoodSadDizzy } from "react-icons/tb";
import LottiePlayer from "react-lottie-player";
import FeedbackLoader from "../app/lottie-asserts/FeedbackLoader.json";
import { IoIosStarOutline, IoMdStar } from "react-icons/io";

interface Feedback {
  emotion: string;
  feedback: string;
}

interface Emotion {
  title: string;
  emoji: JSX.Element;
}

const Form = () => {
  const { userID, websiteID } = useParams();

  const [feedback, setFeedback] = useState<Feedback>({
    emotion: "",
    feedback: "",
  });

  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string>("");

  const db = new dbService();

  const saveFeedBack = async () => {
    setLoading(true);
    setFeedbackStatus("Saving feedback...");
    try {
      const isSubscribed = await db.checkifSubscribed(
        userID.toString(),
        decodeURIComponent(websiteID.toString())
      );
      if (isSubscribed) {
        const savefeedback = {
          emotion: feedback.emotion,
          feedback: feedback.feedback,
        };
        await db.saveFeedback(
          userID.toString(),
          websiteID.toString(),
          savefeedback
        );
        setFeedbackStatus("Feedback saved successfully!");
        setFeedback({ emotion: "", feedback: "" });
        setSelectedEmotion(null);
        setSelectedRating(0);
      } else {
        alert("You are not subscribed to this website.");
        setFeedbackStatus("");
      }
    } catch (error) {
      console.log(error);
      setFeedbackStatus("Failed to save feedback.");
    } finally {
      setLoading(false);
    }
  };

  const emotions: Emotion[] = [
    { title: "Happy", emoji: <IoHappyOutline size={32} color="#c1d0d5" /> },
    { title: "Neutral", emoji: <IoSadOutline size={32} color="#c1d0d5" /> },
    { title: "Sad", emoji: <TbMoodSadDizzy size={32} color="#c1d0d5" /> },
  ];

  return (
    <div className="flex justify-center p-5 pt-5">
      <div className="rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl border-[1px] bg-[#121212] border-[#282e32]">
        <div className="bg-[#1E1E1E] p-6 rounded-t-lg border-b-[1px] border-stone-800 space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Your Opinion Matters
          </h1>
          <p className="text-white text-xs font-semibold">
            Take a moment to share your feedback
          </p>
        </div>

        {loading ? (
          <>
            <div className="max-w-xs mx-auto -mt-10">
              <LottiePlayer loop animationData={FeedbackLoader} play />
            </div>
            <p className="text-white  text-center -mt-28">{feedbackStatus}</p>
          </>
        ) : (
          <div className="p-5">
            <div className="space-y-2.5 mt-4">
              <div>
                <h1 className="text-white font-sem">Rate Us</h1>
              </div>
              <div className="flex items-center gap-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedRating(i)}
                    className="cursor-pointer"
                  >
                    {i <= selectedRating ? (
                      <IoMdStar size={24} color="gold" />
                    ) : (
                      <IoIosStarOutline size={24} color="white" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 mt-6">
              <textarea
                value={feedback.feedback}
                placeholder="Feedback"
                onChange={(e) =>
                  setFeedback({ ...feedback, feedback: e.target.value })
                }
                cols={20}
                rows={5}
                className="bg-[#1E1E1E] border-[1px] border-[#282e32] pl-3 pr-4 py-2 w-full rounded-lg text-white "
              />
            </div>

            <div className="mt-6 space-y-2.5">
              <h1 className="font-semibold text-white">
                How was your experience*
              </h1>
              <div className="flex items-center space-x-5 mt-4">
                {emotions.map((emotion, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedEmotion(idx);
                      setFeedback({ ...feedback, emotion: emotion.title });
                    }}
                    className={`cursor-pointer p-2 rounded-full ${
                      selectedEmotion === idx
                        ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                        : ""
                    }`}
                  >
                    {emotion.emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={saveFeedBack}
                className="text-black font-semibold px-4 py-2 rounded-lg w-full bg-slate-50"
              >
                Share Insights
              </button>
            </div>
          </div>
        )}
        <p className="text-stone-600 text-center my-4">
          Powered By{" "}
          <span>
            <Link href={"#"}>FeedSense.ai</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Form;
