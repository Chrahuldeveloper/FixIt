import { db } from "../Firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import cache from "../../cache/cache";

interface User {
  uid: string;
  email: string;
}

interface Website {
  name: string;
  url: string;
  type: string;
  image: string;
  feedback?: Feedback[];
}

interface Feedback {
  email: string;
  emotion: string;
  feedback: string;
}

export default class dbService {
  async genrateId(length: number): Promise<string> {
    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i <= length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      id += letters[randomIndex];
    }
    return id;
  }

  async ContactUs(data: object): Promise<void> {
    try {
      const Id = await this.genrateId(5);
      const userDocRef = doc(db, "CONTACT-US", Id);
      await setDoc(userDocRef, { data });
    } catch (error) {
      console.log(error);
    }
  }

  async checkifSubscribed(
    userId: string,
    websiteName: string
  ): Promise<boolean> {
    try {
      const userDocRef = doc(db, "USERS", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const subscriptionPlan = docSnap.data()?.subscription;
        if (subscriptionPlan === "Basic") {
          const userWebsites = docSnap.data()?.websites || [];
          const filteredWebsite = userWebsites.filter(
            (website: Website) => website.name === websiteName
          );
          const websiteFeedbacks = filteredWebsite?.[0]?.feedback?.length;

          if (!websiteFeedbacks) {
            return true;
          }

          if (websiteFeedbacks <= 3 && userWebsites.length < 3) {
            return true;
          }
        }

        if (subscriptionPlan === "Pro") {
          return true;
        }

        return false;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteWebsite(userId: string, websiteName: string): Promise<void> {
    try {
      const userDocRef = doc(db, "USERS", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const updatedWebsites = websites.filter(
          (website: Website) => website.name !== websiteName
        );

        await updateDoc(userDocRef, { websites: updatedWebsites });
        console.log("Website deleted successfully");
        cache.set(userId, updatedWebsites);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  }

  async saveWebsite(user: User, data: Website): Promise<string | void> {
    try {
      const userDocRef = doc(db, "USERS", user.uid);
      const docSnap = await getDoc(userDocRef);
      let updatedWebsites: Website[] = [];

      if (docSnap.exists()) {
        const subscription = docSnap.data().subscription;
        const userWebsites = docSnap.data().websites || [];

        if (subscription === "Basic") {
          if (userWebsites.length < 3) {
            await updateDoc(userDocRef, { websites: arrayUnion(data) });
            updatedWebsites = [...userWebsites, data];
            console.log("Website data saved successfully for Basic plan");
          } else {
            console.log(
              "Cannot save more than 3 websites for Basic subscription"
            );
            updatedWebsites = userWebsites;
            return "WebsiteFull";
          }
        } else if (subscription === "Pro") {
          await updateDoc(userDocRef, { websites: arrayUnion(data) });
          updatedWebsites = [...userWebsites, data];
          console.log("Website data saved successfully for Pro plan");
        }
      } else {
        await setDoc(userDocRef, { websites: [data] });
        updatedWebsites = [data];
        console.log("Website data saved successfully for new user");
      }

      cache.set(user.uid, updatedWebsites);
    } catch (error) {
      console.error("Error saving website:", error);
    }
  }

  async fetchWebsites(user: User): Promise<Website[]> {
    try {
      const cachedWebsites = cache.get(user.uid);

      if (cachedWebsites) {
        console.log("Fetched websites from cache");
        return cachedWebsites;
      }

      const userDocRef = doc(db, "USERS", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userWebsites = docSnap.data()?.websites || [];
        cache.set(user.uid, userWebsites);
        return userWebsites;
      } else {
        console.error("User does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
      return [];
    }
  }

  async fetchDashboardDetails(
    user: string
  ): Promise<{ totalWebsites: number; totalFeedback: number } | null> {
    try {
      const cachedDashboard = cache.get(`${user}-dashboard`);

      if (cachedDashboard) {
        console.log("Fetched dashboard details from cache");
        return cachedDashboard;
      }

      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const totalFeedback = websites.reduce(
          (total: number, site: Website) =>
            total + (site.feedback?.length || 0),
          0
        );
        const totalWebsites = websites.length;

        const dashboardDetails = { totalWebsites, totalFeedback };
        cache.set(`${user}-dashboard`, dashboardDetails);
        return dashboardDetails;
      } else {
        console.error("User does not exist");
        return null;
      }
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
      return null;
    }
  }

  async fetchFeedbacks(user: string) {
    try {
      const cachedFeedbacks = cache.get(`${user}-feedbacks`);

      if (cachedFeedbacks) {
        console.log("Fetched feedbacks from cache");
        return cachedFeedbacks;
      }

      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];
        const allFeedbacks = websites.flatMap(
          (website: Website) => website.feedback || []
        );
        cache.set(`${user}-feedbacks`, allFeedbacks);
        return allFeedbacks;
      } else {
        console.error("User does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      return [];
    }
  }

  async saveFeedback(
    userID: string,
    websiteName: string,
    data: Feedback
  ): Promise<void> {
    try {
      // decodeURIComponent(websiteName.toString())
      console.log(data, decodeURIComponent(websiteName.toString()), userID);
      const userDocRef = doc(db, "USERS", userID);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const websites = docSnap.data()?.websites || [];

        const websiteIndex = websites.findIndex(
          (website: Website) => website.name === decodeURIComponent(websiteName.toString())
        );

        if (websiteIndex !== -1) {
          const currentFeedback = websites[websiteIndex].feedback || [];

          const newFeedback = { ...data };
          const updatedFeedback = [...currentFeedback, newFeedback];

          websites[websiteIndex] = {
            ...websites[websiteIndex],
            feedback: updatedFeedback,
          };

          await updateDoc(userDocRef, { websites });

          console.log("Feedback saved successfully");
          cache.set(userID, websites);

          const subscription = docSnap.data()?.subscription;

          if (subscription === "Pro") {
            const headersList = {
              Accept: "*/*",
              "Content-Type": "application/json",
            };

            const bodyContent = JSON.stringify({ message: data.feedback });

            const response = await fetch(
              " https://user-conversation-worker.chrahulofficial.workers.dev",
              {
                method: "POST",
                body: bodyContent,
                headers: headersList,
              }
            );

            const responseData = await response.text();
            const plainObject = JSON.parse(responseData);

            console.log("Parsed response:", plainObject);

            updatedFeedback[updatedFeedback.length - 1] = {
              ...newFeedback,
              parsedFeedback: plainObject,
            };

            websites[websiteIndex].feedback = updatedFeedback;
            await updateDoc(userDocRef, { websites });

            console.log(
              "Parsed feedback added to specific feedback entry in Firestore."
            );
          }
        } else {
          console.error("Website not found with the specified name");
        }
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  }

  async subscribe(user: string, plan: string, date: string): Promise<void> {
    try {
      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          subscription: plan,
          subscriptionDate: date,
        });
      } else {
        console.log("User does not exist");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  }

  async isSubscribed(user: string) {
    try {
      const userDocRef = doc(db, "USERS", user);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data()?.subscription || false;
      } else {
        console.error("User does not exist");
        return false;
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  }

  async isSubscribtionExpired(userId: string) {
    try {
      const userDocRef = doc(db, "USERS", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const purchasedDateStr = docSnap.data()?.date;

        if (!purchasedDateStr) {
          console.error("Purchased date not found for user");
          return false;
        }

        const [day, month, year] = purchasedDateStr.split("/").map(Number);
        const purchasedDate = new Date(2000 + year, month - 1, day);

        const currentDate = new Date();

        return currentDate > purchasedDate;
      } else {
        console.error("User does not exist");
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
