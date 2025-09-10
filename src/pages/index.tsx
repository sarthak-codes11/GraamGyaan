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
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <LanguageHeader />
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36">
        <GlobeSvg className="h-fit w-7/12 md:w-[360px]" />
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            The free, fun, and effective way to learn a language!
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            {/* Register button */}
            <Link
              href="/register"
              className="w-full rounded-2xl border-b-4 border-green-700 bg-green-600 px-10 py-3 text-center font-bold uppercase transition hover:border-green-600 hover:bg-green-500 md:min-w-[320px]"
            >
              Get started
            </Link>

            {/* Login button */}
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#042c60] bg-[#235390] px-8 py-3 font-bold uppercase transition hover:bg-[#204b82] md:min-w-[320px]"
              onClick={() => setShowLogin(true)}
            >
              I already have an account
            </button>
          </div>
        </div>
      </div>
      <LanguageCarousel />

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
