"use client";

import React from "react";

export const ScoreTimer: React.FC<{
  score: number;
  secondsLeft: number;
  totalSeconds: number;
}> = ({ score, secondsLeft, totalSeconds }) => {
  const pct = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-bold mb-1" style={{ color: "#6F0E1B" }}>
          Time Left: {secondsLeft}s
        </div>
        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#FFB6C1,#FFD1A3)" }}
          />
        </div>
      </div>
      <div
        className="shrink-0 rounded-2xl px-4 py-2 font-extrabold border-2"
        style={{ background: "#E9FCD4", borderColor: "#B3F17B", color: "#275D00" }}
      >
        Score: {score}
      </div>
    </div>
  );
};

export default ScoreTimer;
