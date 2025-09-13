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

      style={{backgroundColor:"#FEEBED"}}
    >
 
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36" style={{ color: "#6F0E1B" }}>
        <GlobeSvg className="h-fit w-7/12 md:w-[350px]" style={{ stroke: "none" }} />
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            Welcome to GraamGyaan
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            

            {/* Login button */}
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#6F0E1B] bg-[#6F0E1B] px-8 py-3 font-bold uppercase transition hover:bg-[#F47D45] md:min-w-[320px]"
              onClick={() => setShowLogin(true)}
              style={{ color: "#ffffff" }}
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
