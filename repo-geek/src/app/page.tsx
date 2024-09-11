"use client";
import * as React from "react"
import BlurIn from "@/components/magicui/blur-in";
import Particles from "@/components/magicui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import SparklesText from "@/components/magicui/sparkles-text";
import CircleProp from "@/customComponents/CircleProp";
import LoginCard from "@/customComponents/LoginCard";
import Globe from "@/components/magicui/globe";
import { ConfettiButton } from "@/components/magicui/confetti";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 md:p-24">
      <div>
        <BlurIn word={"Elevate Your Code with AI-Powered Insights"} className="text-base md:text-3xl mt-2 font-semibold text-zinc-400"></BlurIn>
        <SparklesText sparklesCount={30} text="Welcome to Repo Geek" className="text-center my-2 text-5xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-8xl md:leading-[5rem]" colors={{ first: "#9E7AFF", second: "#FE8BBB" }} />
        <CircleProp />

        <p className="leading-3 md:leading-7 w-full text-center text-xs md:text-lg md:font-medium md:w-[60%] mx-auto text-zinc-400">Unlock the potential of your repositories with <span className="font-extrabold">Repo Geek.</span> Whether you're a seasoned developer or just starting out, our tool offers an in-depth analysis of your GitHub or any public repo, identifying issues, optimizing code quality, and providing actionable insights—all powered by the cutting-edge <span className="font-extrabold">Llama3.1</span> AI model.</p>

        <div className="relative mx-auto w-full max-w-[24rem] items-center justify-center overflow-hidden rounded-lg bg-background px-5 pt-4 md:pb-80 md:shadow-xl">
          <Globe className="top-20 z-10" />
        </div>
        <div className="my-20 w-full flex justify-center items-center z-10">
          {isLoggedIn && <ConfettiButton className="z-10"><span className="md:text-base text-xs">Get Started</span></ConfettiButton>}
        </div>
        {!isLoggedIn && <LoginCard />}
        <h4 className="md:mt-24 mt-16 text-lg text-center font-semibold tracking-tight">
          Built with ❤️ by developers, for developers.
        </h4>
        <Particles
          className="absolute inset-0 z-0 w-full"
          quantity={250}
          ease={80}
          color={color}
          refresh
        />
      </div>
    </main>
  );
}
