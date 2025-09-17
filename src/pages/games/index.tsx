"use client";

import React from "react";
import Link from "next/link";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";

const GamesHubPage: React.FC = () => {
  return (
    <>
      <TopBar backgroundColor="bg-[#680B24]" borderColor="border-[#4e071b]" />
      <div className="pt-16 pb-24 px-4 min-h-screen flex flex-col items-center" style={{ background: "#FFFDF9" }}>
        <div className="w-full max-w-3xl flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold" style={{ color: "#6F0E1B" }}>
            Choose a Game
          </h1>
          <Link
            href="/learn"
            className="rounded-xl px-3 py-2 border-2 border-b-4 font-extrabold"
            style={{ background: "#FFF4E6", borderColor: "#FFD1A3", color: "#945200" }}
          >
            Quit
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          <Link
            href="/game"
            className="rounded-3xl p-6 border-4 border-b-8 text-center font-extrabold shadow-sm"
            style={{ background: "#E6FAFB", borderColor: "#8AE1E8", color: "#0D7681" }}
          >
            Materials Sorter
            <div className="text-sm font-semibold mt-1 opacity-80">Metal vs Plastic, Soluble vs Insoluble</div>
          </Link>
          <Link
            href="/games/plants"
            className="rounded-3xl p-6 border-4 border-b-8 text-center font-extrabold shadow-sm"
            style={{ background: "#FDF3FF", borderColor: "#F1C6FF", color: "#7A2E8E" }}
          >
            Getting to Know Plants
            <div className="text-sm font-semibold mt-1 opacity-80">Build the plant + Match functions</div>
          </Link>
        </div>
      </div>
      <BottomBar selectedTab="Learn" />
    </>
  );
};

export default GamesHubPage;
