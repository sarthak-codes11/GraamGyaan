import React, { useState } from "react";
import { useRouter } from "next/router";
import { GlobeSvg } from "~/components/Svgs";
import LoginScreen from "~/components/LoginScreen";
import LoginScreenh from "~/components/LoginScreenh";
import LoginScreent from "~/components/LoginScreent";
import Link from "next/link";

// Text dictionary
const translations: Record<string, any> = {
  en: {
    welcome: "Welcome to GraamGyaan!",
    signin: "Let's Get You Signed In",
    changeLang: "🌐 Change Language",
  },
  hi: {
    welcome: "ग्रामज्ञान में आपका स्वागत है!",
    signin: "चलिए, आपको साइन इन कराते हैं",
    changeLang: "🌐 भाषा बदलें",
  },
  te: {
    welcome: "గ్రామజ్�న్ కి స్వాగతం!",
    signin: "మిమ్మల్ని సైన్ ఇన్ చేద్దాం",
    changeLang: "🌐 భాష మార్చు",
  },
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const { lang } = router.query;
  const [showLogin, setShowLogin] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showChoices, setShowChoices] = useState(false); // toggle for student/teacher

  // Default language English
  const currentLang = typeof lang === "string" ? lang : "en";
  const t = translations[currentLang] || translations["en"];

  const ActiveLogin =
    currentLang === "hi"
      ? LoginScreenh
      : currentLang === "te"
      ? LoginScreent
      : LoginScreen;

  return (
    <main
      className="flex min-h-screen-safe flex-col items-center justify-center bg-[#235390] text-white px-4 md:px-8 lg:px-12 py-8 safe-area-inset-top safe-area-inset-bottom"
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(270deg, #f5f5dc, #fdfaf3, #e6d9b5,rgb(255, 232, 185))",
        backgroundSize: "600% 600%",
        animation: "gradientShift 5s ease infinite",
      }}
    >
      <div
        className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36"
        style={{ color: "#0B3D0B" }}
      >
        {/* Logo */}
        <div className="w-full md:w-auto flex justify-center items-center md:justify-start md:pl-16 lg:pl-24">
          <GlobeSvg
            className="block h-fit w-10/12 xs:w-9/12 sm:w-8/12 md:w-[350px] mx-auto relative left-1 md:left-0"
            style={{ stroke: "none" }}
          />
        </div>

        {/* Text + Buttons */}
        <div className="flex flex-col items-center max-w-full">
          <p className="mb-6 max-w-[600px] text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide md:mb-12 bg-gradient-to-r from-[#7B3F00] via-[#A0522D] to-[#D2B48C] bg-clip-text text-transparent drop-shadow-md px-2">
            {t.welcome}
          </p>

          {/* Continue as selector */}
          <div className="mb-6 flex flex-col items-center gap-3 md:gap-4">
            {/* Removed the external "Continue as" text */}

            {/* Show "Continue as" button first */}
            {!showChoices && (
              <button
                onClick={() => setShowChoices(true)}
                className="rounded-3xl border-2 border-b-4 border-[#7B3F00] bg-gradient-to-br from-[#A0522D] to-[#7B3F00] px-6 py-3 xs:px-7 xs:py-3.5 md:px-8 md:py-4 text-white font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg hover:brightness-110 hover:scale-[1.03] hover:border-[#5C4033] transition-transform duration-200 btn-mobile"
              >
                <span className="text-sm xs:text-base md:text-lg">Continue as</span>
              </button>
            )}

            {/* Student + Teacher buttons (appear after clicking Continue as) */}
            {showChoices && (
              <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 md:gap-6 mt-4 w-full max-w-sm">
                <button
                  className="w-full xs:w-auto rounded-3xl border-2 border-b-4 border-[#7B3F00] bg-gradient-to-br from-[#A0522D] to-[#7B3F00] px-6 py-3 xs:px-7 xs:py-3.5 md:px-8 md:py-4 text-white font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg hover:brightness-110 hover:scale-[1.03] hover:border-[#5C4033] transition-transform duration-200 btn-mobile"
                  onClick={() => {
                    try {
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem("loginRedirect", "/select-grade");
                      }
                    } catch {}
                    setShowLogin(true);
                  }}
                >
                  <span className="text-sm md:text-base">Student</span>
                </button>

                <button
                  className="w-full xs:w-auto rounded-3xl border-2 border-b-4 border-[#7B3F00] bg-white px-6 py-3 xs:px-7 xs:py-3.5 md:px-8 md:py-4 text-[#7B3F00] font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg hover:bg-[#F5E6D3] hover:scale-[1.03] transition-transform duration-200 btn-mobile"
                  onClick={() => {
                    try {
                      if (typeof window !== "undefined") {
                        window.localStorage.setItem("loginRedirect", "/teacher");
                      }
                    } catch {}
                    setShowLogin(true);
                  }}
                >
                  <span className="text-sm md:text-base">Teacher</span>
                </button>
              </div>
            )}
          </div>

          {/* Language dropdown */}
          <div className="relative mt-6">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              aria-expanded={showLanguages}
              aria-haspopup="true"
              className="rounded-xl border-2 border-[#7B3F00] px-6 py-2 bg-[#A0522D] text-white font-semibold hover:bg-[#5C4033] transition"
            >
              {t.changeLang}
            </button>

            {showLanguages && (
              <div className="absolute left-0 mt-2 w-40 rounded-lg bg-white shadow-lg z-10">
                <Link
                  href={{ pathname: "/", query: { lang: "en" } }}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
                >
                  English
                </Link>
                <Link
                  href={{ pathname: "/", query: { lang: "hi" } }}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
                >
                  हिंदी
                </Link>
                <Link
                  href={{ pathname: "/", query: { lang: "te" } }}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200"
                >
                  తెలుగు
                </Link>
              </div>
            )}
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
            <ActiveLogin />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
