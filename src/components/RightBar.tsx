import React, { useState } from "react";
import dayjs from "dayjs";

/**
 * Paste-ready RightBar.tsx
 * - XP counter is now linked to the leaderboard.
 * - User's rank is calculated dynamically.
 * - User's row is highlighted in the leaderboard.
 * - No lucide-react dependency
 * - Soft background gradient behind everything
 * - White cards with shadow + hover lift
 * - Golden animated shiny progress bar
 * - Inline SVG icons (TrophyIcon, GiftIcon)
 */

// --- Helper Components (Icons) ---
function TrophyIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 3v2"
        stroke="#680B24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 3v2"
        stroke="#680B24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 5a4 4 0 004 4 4 4 0 004-4"
        stroke="#680B24"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8v2a5 5 0 005 5h4a5 5 0 005-5V8"
        stroke="#680B24"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 18h6l1 3H8l1-3z"
        fill="#F6C84C"
        stroke="#C58E17"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="6"
        rx="1"
        fill="#FFF"
        stroke="#E5E7EB"
      />
      <path
        d="M12 7v10"
        stroke="#680B24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 7c1.6-1.8 4-3 6-1.5 2 1.4 1.8 4.5-1 5.5"
        stroke="#680B24"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7c-1.6-1.8-4-3-6-1.5C4 7 4 10.1 7 11.2"
        stroke="#680B24"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="13"
        width="16"
        height="6"
        rx="2"
        fill="#FEEBC8"
        stroke="#E6B95D"
      />
    </svg>
  );
}

// --- Main RightBar Component ---
export default function RightBar() {
  // Dummy/store values (replace with your store hooks if you want)
  const loggedIn = true;
  const lingots = 120;
  const streak = 7;
  const language = "Spanish";
  const lessonsCompleted = 12;
  const totalXp = 350; // This is now the single source of truth for the user's XP
  const xpToReward = 150;
  const xpGoal = totalXp + xpToReward;
  const progress = Math.min((totalXp / xpGoal) * 100, 100);

  // --- ⬇️ LEADERBOARD LOGIC UPDATED HERE ⬇️ ---
  const currentUser = { name: "You", xp: totalXp };
  const otherUsers = [
    { name: "Alice", xp: 1200 },
    { name: "Bob", xp: 950 },
    { name: "Charlie", xp: 800 },
  ];

  // Combine, sort, and find the user's rank
  const leaderboardData = [...otherUsers, currentUser].sort(
    (a, b) => b.xp - a.xp
  );
  const userRank =
    leaderboardData.findIndex((user) => user.name === "You") + 1;
  // --- ⬆️ END OF LEADERBOARD LOGIC UPDATE ⬆️ ---

  // Component state
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* background gradient kept far back */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(270deg, #FFF8F2 0%, #F9EEDD 33%, #FDFDFD 66%, #FFFFFF 100%)",
            backgroundSize: "600% 600%",
            animation: "gradientShift 5s ease infinite",
            filter: "saturate(0.9) brightness(1) opacity(0.6)",
          }}
        />
      </div>

      {/* Sidebar wrapper sitting above gradient */}
      <aside className="relative z-20 hidden sm:flex w-96 flex-col gap-6 p-4">
        {/* small top row / language preview */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Current Language:{" "}
            <span className="ml-2 font-bold text-gray-800">{language}</span>
          </div>
        </div>

        {/* Leaderboard (white card, shadow, hover lift) */}
        {loggedIn && lessonsCompleted >= 10 && (
          <article className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 shadow-md transition transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-2 text-xl font-bold text-[#680B24]">
              Leaderboard
            </h2>
            {/* --- ⬇️ RANK IS NOW DYNAMIC ⬇️ --- */}
            <p className="text-sm text-gray-600">
              You’re ranked <strong>#{userRank}</strong> this week. Keep going!
            </p>
            {/* --- ⬇️ LEADERBOARD MAPPING IS NOW DYNAMIC ⬇️ --- */}
            <ul className="mt-4 flex flex-col gap-3">
              {leaderboardData.map((user, i) => (
                <li
                  key={user.name}
                  className={`flex items-center justify-between rounded-lg p-3 shadow-sm ${
                    user.name === "You" ? "bg-amber-100" : "bg-white"
                  }`} // Highlight current user
                >
                  <span className="font-medium text-gray-700">
                    {i + 1}. {user.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    {user.xp} XP
                  </span>
                </li>
              ))}
            </ul>
          </article>
        )}

        {/* Achievements (white card, shadow, hover lift) */}
        {loggedIn && (
          <article className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 shadow-md transition transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-[#680B24]">
              Achievements & Rewards
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 shadow-sm">
                <TrophyIcon />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Total XP earned:{" "}
                  {/* This value is reflected in the leaderboard */}
                  <span className="font-semibold text-gray-800">{totalXp}</span>
                </p>
                <p className="text-sm text-gray-600">
                  XP needed for next reward:{" "}
                  <span className="font-semibold text-gray-800">
                    {xpToReward}
                  </span>
                </p>
              </div>
            </div>
            {/* golden animated progress bar */}
            <div className="mt-4">
              <div className="relative w-full h-4 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full shiny-progress"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #FFD24D 0%, #F6C84C 30%, #FFD24D 60%, #FFE685 100%)",
                  }}
                />
              </div>
              <p className="mt-2 text-right text-sm font-semibold text-gray-600">
                {Math.round(progress)}%
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 shadow-sm">
                <GiftIcon />
              </div>
              <p className="text-sm text-gray-600">
                Keep grinding to unlock new achievements and prizes!
              </p>
            </div>
          </article>
        )}
      </aside>

      {/* small login modal placeholder (kept simple) */}
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
            <div className="rounded-lg bg-white p-6 text-center">
              <h2 className="text-lg font-bold">Login Screen Placeholder</h2>
            </div>
          </div>
        </div>
      )}

      {/* global styles for animations */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        .shiny-progress {
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }
      `}</style>
    </>
  );
}