"use client";

import React from "react";

export const EndScreen: React.FC<{
  correctCount: number;
  total: number;
  onReplay: () => void;
}> = ({ correctCount, total, onReplay }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-3xl p-6 text-center shadow-2xl border-4"
           style={{ background: "#FFFFFF", borderColor: "#FFD1A3" }}>
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#6F0E1B" }}>
          Time's Up!
        </h2>
        <p className="text-lg mb-6" style={{ color: "#6F0E1B" }}>
          You sorted {correctCount} items correctly out of {total}!
        </p>
        <button
          onClick={onReplay}
          className="rounded-2xl px-4 py-3 font-extrabold border-b-4"
          style={{ background: "#E9FCD4", borderColor: "#B3F17B", color: "#275D00" }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
