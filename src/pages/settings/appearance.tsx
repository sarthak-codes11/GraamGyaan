import type { NextPage } from "next";
import React from "react";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import { TopBar } from "~/components/TopBar";
import { SettingsRightNav } from "~/components/SettingsRightNav";

const Appearance: NextPage = () => {
  return (
    <div>
      <TopBar />
      <LeftBar selectedTab={null} />
      <BottomBar selectedTab={null} />
      <div className="mx-auto flex flex-col gap-5 px-4 py-20 sm:py-10 md:pl-28 lg:pl-72">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between lg:max-w-4xl">
          <h1 className="text-lg font-bold text-gray-800 sm:text-2xl">Appearance</h1>
        </div>
        <div className="flex justify-center gap-12">
          <div className="flex w-full max-w-xl flex-col gap-8">
            <div className="sm:pl-10">
              <p className="text-base text-gray-700">
                The application currently uses a light theme. Dark mode has been disabled.
              </p>
            </div>
          </div>
          <SettingsRightNav selectedTab="Appearance" />
        </div>
      </div>
    </div>
  );
};

export default Appearance;
