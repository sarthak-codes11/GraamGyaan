import { type NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { GlobeSvg } from "~/components/Svgs";
import { LanguageHeader } from "~/components/LanguageHeader";
import LoginScreen from "~/components/LoginScreen";
import _bgSnow from "../../public/bg-snow.svg";
import type { StaticImageData } from "next/image";
import { LanguageCarousel } from "~/components/LanguageCarousel";

const bgSnow = _bgSnow as StaticImageData;

const Home: NextPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#235390] text-white"

      style={{
  width: "100%",
  height: "100%",
  background: "linear-gradient(270deg, #f5f5dc, #fdfaf3, #e6d9b5, #fffaf0)",
  backgroundSize: "600% 600%",
  animation: "gradientShift 5s ease infinite",
}}

    >
 
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36" style={{ color: "#0B3D0B" }}>
        <GlobeSvg className="h-fit w-7/12 md:w-[350px]" style={{ stroke: "none" }} />
        <div>
          <p className="mb-6 max-w-[600px] text-center text-4xl md:text-5xl font-extrabold tracking-wide md:mb-12 bg-gradient-to-r from-[#7B3F00] via-[#A0522D] to-[#D2B48C] bg-clip-text text-transparent drop-shadow-md">
  Welcome to GraamGyaan !
</p>

          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            

            {/* Login button */}
            <button
  className="w-full rounded-2xl border-2 border-b-4 border-[#7B3F00] 
             bg-[#7B3F00] px-8 py-3 font-bold uppercase 
             text-white transition-all duration-300 ease-in-out
             hover:bg-[#5C4033] hover:border-[#5C4033] hover:scale-105 
             md:min-w-[320px]"
  onClick={() => setShowLogin(true)}
>
  Let's get you signed in
</button>

          </div>
        </div>
      </div>
   

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative w-full max-w-md px-4">
            <button
              className="absolute right-2 top-2 text-white text-xl"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <LoginScreen />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
