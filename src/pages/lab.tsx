import type { NextPage } from "next";
import React, { useState } from "react";

import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import RightBar from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";

type Video = { id: number; title: string; watched: boolean };

const units = [
  {
    id: 1,
    title: "Unit 1",
    videos: [{ id: 1, title: "Germination of Seeds", watched: true }],
    quizzesAttempted: 0,
    assignmentsDone: 0,
  },
  { id: 2, title: "Unit 2", videos: [], comingSoon: true, quizzesAttempted: 0, assignmentsDone: 0 },
  { id: 3, title: "Unit 3", videos: [], comingSoon: true, quizzesAttempted: 0, assignmentsDone: 0 },
];

const seasonalQuests = [
  {
    id: 1,
    title: "Spring Quest 🌱",
    description: "Grow a seed in a pot and upload a photo with 2–3 lines about your observation.",
    reward: "50 XP + Green Thumb Badge",
  },
  {
    id: 2,
    title: "Monsoon Quest ☔",
    description: "Record a 30s video explaining why plants grow faster in monsoon.",
    reward: "50 XP + Rain Lover Badge",
  },
  {
    id: 3,
    title: "Winter Quest ❄️",
    description: "Answer 5 MCQs about crops in winter.",
    reward: "Double XP if all correct",
  },
];

// ✅ Seasonal Quest Card Component
const SeasonalQuestCard: React.FC<{ quest: { id: number; title: string; description: string; reward: string } }> = ({ quest }) => {
  const [input, setInput] = useState("");
  const [submittedText, setSubmittedText] = useState<string | null>(null);

  const handleUpload = () => {
    if (input.trim()) {
      setSubmittedText(input);
      setInput("");
    }
  };

  return (
    <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow-sm">
      <h3 className="text-md font-semibold">{quest.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
      <p className="text-xs text-gray-500 mt-1">🏆 {quest.reward}</p>

      {/* Writing bar + Upload button */}
      <div className="mt-3 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your answer here..."
          className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-400"
          rows={2}
        />
        <button
          onClick={handleUpload}
          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          Upload
        </button>
      </div>

      {/* Show uploaded text below */}
      {submittedText && (
        <p className="mt-3 text-sm text-gray-700 italic">
          ✅ Your submission: "{submittedText}"
        </p>
      )}
    </div>
  );
};

const percent = (watched: number, total: number) =>
  total === 0 ? 0 : Math.round((watched / total) * 100);

const LabDashboard: NextPage = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  const totalVideos = units.reduce((acc, u) => acc + u.videos.length, 0);
  const watchedVideos = units.reduce((acc, u) => acc + u.videos.filter(v => v.watched).length, 0);
  const totalQuizzes = units.reduce((acc, u) => acc + (u.quizzesAttempted || 0), 0);
  const totalAssignments = units.reduce((acc, u) => acc + (u.assignmentsDone || 0), 0);

  return (
    <div>
      <TopBar />
      <LeftBar selectedTab="Lab" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="px-4 pb-20 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-800">
                {/* Lab Icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 2a1 1 0 00-1 1v5.1a3 3 0 001.1 2.34L10 13v6a1 1 0 001 1h2a1 1 0 001-1v-6l2.9-2.56A3 3 0 0018 8.1V3a1 1 0 00-1-1H7z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Lab</h1>
                <p className="text-sm text-gray-500">Hands-on units and videos</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Next: Coming Soon</div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/90 shadow-sm">
              <div className="text-xs text-gray-500">Videos watched</div>
              <div className="text-2xl font-bold">{watchedVideos} / {totalVideos}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 shadow-sm">
              <div className="text-xs text-gray-500">Quizzes attempted</div>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 shadow-sm">
              <div className="text-xs text-gray-500">Assignments done</div>
              <div className="text-2xl font-bold">{totalAssignments}</div>
            </div>
          </div>

          {/* Units */}
          <div className="space-y-6">
            {units.map((u) => {
              const watched = u.videos.filter(v => v.watched).length;
              const total = u.videos.length;
              const pct = percent(watched, total);

              return (
                <div key={u.id} className="p-5 rounded-2xl bg-white/95 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">{u.title}</h2>
                      <div className="text-xs text-gray-500">
                        {u.comingSoon ? "Coming Soon" : `${total} videos • ${u.quizzesAttempted ?? 0} quizzes`}
                      </div>
                    </div>

                    {!u.comingSoon && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowQuests(!showQuests)}
                          className="px-3 py-1 rounded-xl bg-green-600 text-white text-sm font-medium"
                        >
                          Seasonal Quest
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quests show/hide */}
                  {showQuests && u.id === 1 && (
                    <div className="mt-4 space-y-4">
                      {seasonalQuests.map((quest) => (
                        <SeasonalQuestCard key={quest.id} quest={quest} />
                      ))}
                    </div>
                  )}

                  {/* progress + breakdown */}
                  {!u.comingSoon && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-4">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                        <div>{watched} watched • {total - watched} remaining</div>
                        <div className="font-semibold">{pct}%</div>
                      </div>

                      {/* video list */}
                      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {u.videos.map(v => (
                          <li key={v.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                            <div className={`w-3 h-3 rounded-full ${v.watched ? "bg-green-500" : "bg-gray-300"}`} />
                            <div className="text-sm">{v.title}</div>
                            <div className="ml-auto text-xs text-gray-400">{v.watched ? "Watched" : "Not watched"}</div>
                          </li>
                        ))}
                        {u.id === 1 && (
                          <li className="flex flex-col items-start p-2 rounded-lg bg-gray-50 w-full">
                            {!showVideo ? (
                              <button
                                onClick={() => setShowVideo(true)}
                                className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                Play
                              </button>
                            ) : (
                              <video controls autoPlay className="w-full rounded-lg">
                                <source src="/Germination of seed.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <RightBar />
      </div>
    </div>
  );
};

export default LabDashboard;
