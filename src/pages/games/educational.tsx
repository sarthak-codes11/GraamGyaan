"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";

// Dynamically import the game component with no SSR
const EduGame = dynamic(() => import('~/components/game/EduGame'), {
  ssr: false, // Disable server-side rendering for the game
  loading: () => <div className="flex items-center justify-center h-96">Loading game...</div>,
});

const EducationalGamePage: React.FC = () => {
  return (
    <>
      <TopBar backgroundColor="bg-[#680B24]" borderColor="border-[#4e071b]" />
      <div className="pt-16 pb-24 px-4 min-h-screen" style={{ background: "#FFFDF9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold" style={{ color: "#6F0E1B" }}>
              Educational Game
            </h1>
            <a
              href="/games"
              className="rounded-xl px-3 py-2 border-2 border-b-4 font-extrabold"
              style={{ background: "#FFF4E6", borderColor: "#FFD1A3", color: "#945200" }}
            >
              Back to Games
            </a>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <EduGame />
          </div>
        </div>
      </div>
      <BottomBar selectedTab={null} />
    </>
  );
};

export default EducationalGamePage;
