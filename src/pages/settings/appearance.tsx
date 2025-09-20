import type { NextPage } from "next";
import React, { useState } from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { TopBar } from "~/components/TopBar";
import { SettingsRightNav } from "~/components/SettingsRightNav";
import { useBoundStore } from "~/hooks/useBoundStore";

const Appearance: NextPage = () => {
  const darkMode = useBoundStore((x) => x.darkMode);
  const setDarkMode = useBoundStore((x) => x.setDarkMode);
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);

  return (
    <div>
      <TopBar />
      <LeftBar selectedTab={null} />
      <BottomBar selectedTab={null} />
      <div className="mx-auto flex flex-col gap-5 px-4 py-20 sm:py-10 md:pl-28 lg:pl-72">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between lg:max-w-4xl">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 sm:text-2xl">Appearance</h1>
          <button
            className="rounded-2xl border-b-4 border-green-600 bg-green-500 px-5 py-3 font-bold uppercase text-white transition hover:brightness-110 disabled:border-b-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:brightness-100"
            onClick={() => {
              setDarkMode(localDarkMode);
            }}
            disabled={localDarkMode === darkMode}
          >
            Save changes
          </button>
        </div>
        <div className="flex justify-center gap-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <div className="flex justify-between sm:justify-center sm:gap-10 sm:pl-10">
              <div className="font-bold sm:w-1/2">Dark mode</div>
              <label className="pr-5 sm:w-1/2 sm:pr-0">
                <div
                  className={[
                    "relative h-6 w-12 cursor-pointer rounded-full transition-all duration-300",
                    localDarkMode ? "bg-blue-400" : "bg-gray-200",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "absolute h-10 w-10 rounded-xl border-2 border-b-4 bg-white transition-all duration-300",
                      localDarkMode ? "border-blue-400" : "border-gray-200",
                    ].join(" ")}
                    style={{ top: "calc(50% - 20px)", left: localDarkMode ? "calc(100% - 20px)" : "-20px" }}
                  />
                </div>
                <input
                  className="hidden"
                  type="checkbox"
                  checked={localDarkMode}
                  onChange={() => setLocalDarkMode((x) => !x)}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 pl-10">
              Switches the app to a dark background with high-contrast text and controls.
            </p>
          </div>
          <SettingsRightNav selectedTab="Appearance" />
        </div>
      </div>
    </div>
  );
};

export default Appearance;
