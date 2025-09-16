import Link from "next/link";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import type { Tab } from "./BottomBar";
import { useBottomBarItems } from "./BottomBar";
import LoginScreen from "./LoginScreen";
import { GlobeIconSvg } from "./Svgs";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useRouter } from "next/router";

const LeftBarMoreMenuSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle
        cx="23"
        cy="23"
        r="19"
        fill="#598556"
        stroke="#71896B"
        strokeWidth="2"
      />
      <circle cx="15" cy="23" r="2" fill="white" />
      <circle cx="23" cy="23" r="2" fill="white" />
      <circle cx="31" cy="23" r="2" fill="white" />
    </svg>
  );
};

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logOut = useBoundStore((x) => x.logOut);
  const router = useRouter();
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");

  const translateTabName = (name: Tab): string => {
    if (isHindi) {
      switch (name) {
        case "Learn":
          return "सीखें";
        case "Lab":
          return "प्रयोगशाला";
        case "Profile":
          return "प्रोफ़ाइल";
        case "Leaderboards":
          return "लीडरबोर्ड";
        default:
          return name;
      }
    }
    if (isTelugu) {
      switch (name) {
        case "Learn":
          return "నేర్చుకోండి";
        case "Lab":
          return "ప్రయోగశాల";
        case "Profile":
          return "ప్రొఫైల్";
        case "Leaderboards":
          return "లీడర్‌బోర్డ్";
        default:
          return name;
      }
    }
    return name;
  };

  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const bottomBarItems = useBottomBarItems();

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-white p-3 md:flex lg:w-64 lg:p-5">
        <Link
          href={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"}
          className="mb-5 ml-5 mt-5 hidden text-3xl font-bold text-[#654321] lg:block"
        >
          GraamGyaan
        </Link>
        <ul className="flex flex-col items-stretch gap-3">
          {bottomBarItems.map((item) => {
            const displayName = translateTabName(item.name);
            const linkHref = (() => {
              if (isHindi) {
                if (item.href === "/learn") return "/hindi";
                if (item.href === "/lab") return "/hindi/lab";
                if (item.href === "/profile") return "/hindi/profile";
                if (item.href === "/leaderboard") return "/hindi/leaderboard";
              }
              if (isTelugu) {
                if (item.href === "/learn") return "/telugu";
                if (item.href === "/lab") return "/telugu/lab";
                if (item.href === "/profile") return "/telugu/profile";
                if (item.href === "/leaderboard") return "/telugu/leaderboard";
              }
              return item.href;
            })();
            return (
              <li key={item.href} className="flex flex-1">
                {item.name === selectedTab ? (
                  <Link
                    href={linkHref}
                    className="flex grow items-center gap-3 rounded-xl border-2 border-[#84d8ff] bg-[#ddf4ff] px-2 py-1 text-sm font-bold uppercase text-blue-400"
                  >
                    {item.icon}{" "}
                    <span className="sr-only lg:not-sr-only">{displayName}</span>
                  </Link>
                ) : (
                  <Link
                    href={linkHref}
                    className="flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase text-gray-400 hover:bg-gray-100"
                  >
                    {item.icon}{" "}
                    <span className="sr-only lg:not-sr-only">{displayName}</span>
                  </Link>
                )}
              </li>
            );
          })}

          {/* More menu */}
          <div
            className="relative flex grow cursor-default items-center gap-3 rounded-xl px-2 py-1 font-bold uppercase text-gray-400 hover:bg-gray-100"
            onClick={() => setMoreMenuShown((x) => !x)}
            onMouseEnter={() => setMoreMenuShown(true)}
            onMouseLeave={() => setMoreMenuShown(false)}
            role="button"
            tabIndex={0}
          >
            <LeftBarMoreMenuSvg />{" "}
            <span className="hidden text-sm lg:inline">{isHindi ? "और" : isTelugu ? "మరిన్ని" : "More"}</span>
            <div
              className={[
                "absolute left-full top-[-10px] min-w-[300px] rounded-2xl border-2 border-gray-300 bg-white text-left text-gray-400",
                moreMenuShown ? "" : "hidden",
              ].join(" ")}
            >
              <div className="flex flex-col py-2">
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/leaderboard?extended=1"
                >
                  <GlobeIconSvg className="h-10 w-10" />
                  {isHindi ? "स्कूल" : isTelugu ? "పాఠశాల" : "School"}
                </Link>
              </div>
              <div className="flex flex-col border-t-2 border-gray-300 py-2">
                {!loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => setShowLogin(true)}
                  >
                    {isHindi ? "प्रोफ़ाइल बनाएँ" : isTelugu ? "ప్రొఫైల్ సృష్టించండి" : "Create a profile"}
                  </button>
                )}
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href={loggedIn ? "/settings/account" : "/settings/sound"}
                >
                  {isHindi ? "सेटिंग्स" : isTelugu ? "సెట్టింగ్స్" : "Settings"}
                </Link>
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/help"
                >
                  {isHindi ? "सहायता" : isTelugu ? "సహాయం" : "Help"}
                </Link>
                {!loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => router.push("/")}
                  >
                    {isHindi ? "साइन आउट" : isTelugu ? "సైన్ అవుట్" : "Sign out"}
                  </button>
                )}
                {loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => {
                      logOut();
                      router.push("/");
                    }}
                  >
                    {isHindi ? "साइन आउट" : isTelugu ? "సైన్ అవుట్" : "Sign out"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </ul>
      </nav>

      {/* Login modal */}
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
    </>
  );
};