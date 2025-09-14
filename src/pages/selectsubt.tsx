"use client";

import React from "react";
import { useRouter } from "next/navigation";

const subjects = [
  { name: "విజ్ఞానం", value: "science" },
  { name: "గణితం", value: "mathematics" },
  { name: "సమాచార సాంకేతికత", value: "it" },
  { name: "ఇంగ్లీష్", value: "english" },
];

const SelectSub: React.FC = () => {
  const router = useRouter();

  const handleSelect = (subject: string) => {
    // open telugu page with selected subject as query param
    void router.push(`/telugu?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 60 }}>
      <div className="flex justify-center">
        <h2 className="text-3xl font-extrabold text-[#7a1c1c] tracking-wide">
          విషయం ఎంచుకోండి
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 w-full max-w-7xl mx-auto px-6">
        {subjects.map((sub) => (
          <button
            key={sub.value}
            onClick={() => handleSelect(sub.value)}
            className={`
              w-full py-16 rounded-2xl font-extrabold text-5xl shadow-2xl tracking-wide
              transition-all transform hover:scale-110 focus:outline-none
              ${
                sub.value === "math"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                  : sub.value === "science"
                  ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white"
                  : sub.value === "history"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                  : sub.value === "english"
                  ? "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                  : "bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-black"
              }
            `}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectSub;