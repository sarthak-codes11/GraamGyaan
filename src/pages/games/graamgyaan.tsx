"use client";

import React from "react";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";

const GraamGyaanGamePage: React.FC = () => {
  return (
    <>
      <TopBar backgroundColor="bg-[#680B24]" borderColor="border-[#4e071b]" />
      <div className="pt-16 pb-24 px-4 min-h-screen" style={{ background: "#FFFDF9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold" style={{ color: "#6F0E1B" }}>
              GraamGyaan (Packaged Build)
            </h1>
            <a
              href="/games"
              className="rounded-xl px-3 py-2 border-2 border-b-4 font-extrabold"
              style={{ background: "#FFF4E6", borderColor: "#FFD1A3", color: "#945200" }}
            >
              Back to Games
            </a>
          </div>
          <div className="bg-white rounded-xl p-2 shadow-md">
            <div className="w-full" style={{ aspectRatio: '4 / 3' }}>
              <iframe
                src="/games/graamgyaan/index.html"
                className="w-full h-full border-0"
                title="GraamGyaan Game"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
      <BottomBar selectedTab={null} />
    </>
  );
};

export default GraamGyaanGamePage;
