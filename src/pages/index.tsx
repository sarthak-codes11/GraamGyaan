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
    welcome: "గ్రామజ్ఞాన్ కి స్వాగతం!",
    signin: "మిమ్మల్ని సైన్ ఇన్ చేద్దాం",
    changeLang: "🌐 భాష మార్చు",
  },
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const { lang } = router.query;
  const [showLogin, setShowLogin] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  // role-based redirect intent is handled via localStorage to avoid URL coupling

  // Default language English
  const currentLang = typeof lang === "string" ? lang : "en";
  const t = translations[currentLang] || translations["en"];
  // no URL-coupled modal opening; rely on local state

  const ActiveLogin =
    currentLang === "hi"
      ? LoginScreenh
      : currentLang === "te"
      ? LoginScreent
      : LoginScreen;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#235390] text-white"
      style={{
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(270deg, #f5f5dc, #fdfaf3, #e6d9b5, #fffaf0)",
        backgroundSize: "600% 600%",
        animation: "gradientShift 5s ease infinite",
      }}
    >
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36" style={{ color: "#0B3D0B" }}>
        {/* Logo */}
        <GlobeSvg
          className="h-fit w-7/12 md:w-[350px]"
          style={{ stroke: "none" }}
        />

        {/* Text + Buttons */}
        <div className="flex flex-col items-center">
          <p className="mb-6 max-w-[600px] text-center text-4xl md:text-5xl font-extrabold tracking-wide md:mb-12 bg-gradient-to-r from-[#7B3F00] via-[#A0522D] to-[#D2B48C] bg-clip-text text-transparent drop-shadow-md">
            {t.welcome}
          </p>

          {/* Continue as selector */}
          <div className="mb-6 flex flex-col items-center gap-3 md:gap-4">
            <span className="text-base md:text-lg font-extrabold text-[#5C4033] uppercase tracking-wider">
              Continue as
            </span>
            <div className="flex items-center gap-4 md:gap-6">
              <button
                className="rounded-3xl border-2 border-b-4 border-[#7B3F00] bg-gradient-to-br from-[#A0522D] to-[#7B3F00] px-6 py-3 md:px-7 md:py-3.5 text-white font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg hover:brightness-110 hover:scale-[1.03] hover:border-[#5C4033] transition-transform duration-200"
                onClick={() => {
                  try {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("loginRedirect", "/learn");
                    }
                  } catch {}
                  setShowLogin(true);
                }}
              >
                <span className="text-sm md:text-base">Student</span>
              </button>
              <button
                className="rounded-3xl border-2 border-b-4 border-[#7B3F00] bg-white px-6 py-3 md:px-7 md:py-3.5 text-[#7B3F00] font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg hover:bg-[#F5E6D3] hover:scale-[1.03] transition-transform duration-200"
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
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-200">
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