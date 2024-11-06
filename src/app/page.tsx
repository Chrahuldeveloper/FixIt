"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import Cookies from "js-cookie";
import AOS from "aos";
import "aos/dist/aos.css";

export default function page() {
  AOS.init();

  const data = [
    {
      title: "Unified Feedback Management",
      para: "Easily gather feedback from multiple websites and your business services in one place. Streamline your workflow by centralizing all user and client insights.",
    },
    {
      title: "AI-Driven Feedback Analysis",
      para: "Our AI goes beyond simple data collection, transforming user and client feedback into actionable insights and prioritized suggestions for improvement.",
    },
    {
      title: "Smart Suggestions for Improvement",
      para: "Let AI guide you with tailored suggestions based on feedback. Quickly identify areas to enhance your business services and online presence.",
    },
    {
      title: "Centralized Data, Maximum Efficiency",
      para: "Save time and resources by collecting and analyzing feedback from all your websites and business services in one dashboard, powered by intelligent automation.",
    },
  ];

  const howItWorks = [
    {
      title: "Integrate Feedback Form",
      para: "Simply add our feedback form to each of your websites and services. Our form is easy to integrate and starts collecting user and client input immediately.",
    },
    {
      title: "Gather User and Client Insights",
      para: "Your users and clients can submit feedback directly through the form on your websites or services. All responses are stored and organized in one place for easy access.",
    },
    {
      title: "AI-Generated Improvement Suggestions",
      para: "Our AI analyzes the feedback and provides actionable, prioritized suggestions, helping you enhance both your services and user experience efficiently.",
    },
  ];

  const faq = [
    {
      qes: "How does your tool work with multiple websites and business services?",
      ans: "Our tool lets you integrate a feedback form on any number of websites or service pages. All collected data is centralized, making it easy to manage and review feedback from one dashboard.",
    },
    {
      qes: "What kind of feedback does AI analyze?",
      ans: "The AI identifies trends and patterns in user and client feedback, offering insights on areas needing improvement, from service enhancements to functionality upgrades.",
    },
    {
      qes: "How do I get started?",
      ans: "Install our feedback form on your websites and services, and our AI will start gathering and analyzing responses, providing actionable suggestions for improvement.",
    },
    {
      qes: "Is my data secure when using your feedback tool?",
      ans: "Yes, we prioritize data security and privacy. All feedback data collected is encrypted and stored securely, ensuring that only authorized personnel can access it.",
    },
  ];

  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    setUserSession(Cookies.get("auth-token"));
    console.log(Cookies.get("auth-token"));
  }, []);

  return (
    <div className="bg-black w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center space-y-8 pt-32 px-4">
        <div
          className="absolute inset-0 overflow-hidden "
          data-aos="fade-up"
          data-aos-duration="1400"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] bg-blue-600 rounded-full opacity-20 blur-[120px]" />
            <div className="absolute top-1/4 left-1/4 w-[60vw] h-[30vh] bg-blue-500 rounded-full opacity-15 blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[70vw] h-[50vh] bg-blue-400 rounded-full opacity-10 blur-[130px]" />
          </div>
        </div>
        <h1 className="text-3xl lg:text-5xl text-center font-semibold text-white leading-8 z-50">
          Centralize Feedback, Empower Your Business
        </h1>
        <p className="text-[#a2a2a2] max-w-lg text-center z-50 text-sm md:text-base">
          Collect and analyze feedback across multiple sites and services in one
          dashboard. Let our AI guide your next improvements.
        </p>
        <Link
          href={`${userSession === undefined ? "/login" : "/dashboard"}`}
          className="z-50"
        >
          <button className="bg-white text-black py-2 px-8 md:px-16 lg:px-20 font-semibold rounded-full">
            {userSession === undefined ? "Login" : "Your Account"}
          </button>
        </Link>

        <img
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
          src="https://firebasestorage.googleapis.com/v0/b/notes-app-e3995.appspot.com/o/TaskFeed-10-24-2024_09_01_PM.png?alt=media&token=48ce631d-3bd7-4df3-a7c1-6147d9503532"
          alt=""
          className="lg:max-w-5xl mx-auto"
        />
      </div>

      <div className="mt-32 md:mt-44 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">
            Simplify Feedback Management
          </h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            Our tool collects user and client feedback across multiple websites
            and business services and consolidates it for easy review and
            action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {data.map((i, idx) => (
              <div
                className="p-5 max-w-lg text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
                key={idx}
              >
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-44 px-4">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-3xl text-white">How does it work?</h1>
          <p className="text-[#a2a2a2] max-w-xl text-center text-sm md:text-base">
            From integration to AI-powered analysis, here’s how our tool
            centralizes feedback from both your websites and services,
            generating improvement suggestions.
          </p>
          <div className="flex flex-col gap-8 md:flex-row">
            {howItWorks.map((i, idx) => (
              <div
                className="p-5 max-w-sm text-center space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
                key={idx}
              >
                <h1 className="bg-[#323334] rounded-full w-8 mx-auto px-3 py-1 text-center text-white">
                  {idx + 1}
                </h1>
                <h1 className="text-white font-semibold text-xl">{i.title}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-32 px-4">
        <div className="space-y-10 flex flex-col justify-center items-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-[#a2a2a2] text-sm max-w-md leading-7 font-semibold text-center">
            Get answers to common questions about managing feedback across
            multiple websites and services with AI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {faq.map((i, idx) => (
              <div
                className="p-5 max-w-lg space-y-3 bg-[#121212] border-[#191d1f] border-[1px] rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
                key={idx}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
              >
                <h1 className="text-white font-semibold text-xl">{i.qes}</h1>
                <p className="text-[#a2a2a2] leading-7">{i.ans}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div >
        <iframe
          className="  w-screen h-screen"
          src="http://localhost:3000/integrate/9vd5wxinC8TnqN4uF1AIegjb4db2/fixit.com"
        ></iframe>
      </div>

      <footer className="bg-[#121212] border-t border-[#191d1f] py-12 px-36 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left space-y-5 mb-8 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            TaskFeed
          </h1>
          <p className="text-[#a2a2a2]">
            Centralize and analyze feedback to continually improve your websites
            and business services.
          </p>
        </div>
        <div className="flex items-center gap-5 text-white text-sm">
          <FaXTwitter className="w-6 h-6 cursor-pointer hover:scale-125 ease-in-out duration-300" />
          <FiInstagram className="w-6 h-6 cursor-pointer hover:scale-125 ease-in-out duration-300" />
          <FaFacebookF className="w-6 h-6 cursor-pointer hover:scale-125 ease-in-out duration-300" />
        </div>
      </footer>
    </div>
  );
}
