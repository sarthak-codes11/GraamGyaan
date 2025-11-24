"use client";

import React from "react";
import { useRouter } from "next/navigation";

const subjects = [
  { name: "ବିଜ୍ଞାନ", value: "science" },
  { name: "ଗଣିତ", value: "mathematics" },
  { name: "ସୂଚନା ପ୍ରଯୁକ୍ତି", value: "it" },
  { name: "ଇଂରାଜୀ", value: "english" },
];

const SelectSub: React.FC = () => {
  const router = useRouter();

  const handleSelect = (subject: string) => {
    try {
      if (typeof window !== 'undefined') {
        const isNew = window.localStorage.getItem('isNewStudent') === 'true';
        const grade = window.localStorage.getItem('selectedGrade') || '';
        if (isNew && grade) {
          const url = `/api/diagnostic/generate?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}`;
          fetch(url)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              if (data && data.questions && Array.isArray(data.questions)) {
                try {
                  window.localStorage.setItem('diagnosticQuiz', JSON.stringify(data));
                  window.localStorage.setItem('isNewStudent', 'false');
                } catch {}
              }
            })
            .catch(() => {});
          // Redirect new Odia students to diagnostic page
          void router.push(`/diagnostic?grade=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}`);
          return;
        }
      }
    } catch {}
    void router.push(`/odia?subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(to right, #fceabb, #BAB86C)",
      }}
    >
      <div className="flex justify-center mb-10">
        <h2
          className="text-7xl font-extrabold text-[#006400] tracking-wide drop-shadow-lg"
          style={{ fontFamily: "'Oswald' , Oswald" }}
        >
          ବିଷୟ ବାଛନ୍ତୁ
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl mx-auto px-6">
        {subjects.map((sub) => (
          <button
            key={sub.value}
            onClick={() => handleSelect(sub.value)}
            className={`
              w-full py-16 rounded-2xl font-extrabold text-5xl shadow-2xl tracking-wide
              transition-all transform hover:scale-110 focus:outline-none
              hover:shadow-[0_0_20px_#FFD700] border-2 border-transparent
              ${
                sub.value === "math"
                  ? "bg-gradient-to-r from-brown-400 to-brown-500 hover:from-blue-300 hover:to-blue-800 text-white"
                  : sub.value === "science"
                  ? "bg-gradient-to-r from-brown-500 to-brown-700 hover:from-brown-600 hover:to-brown-800 text-white"
                  : sub.value === "it"
                  ? "bg-gradient-to-r from-brown-400 to-brown-600 hover:from-darkbrown-500 hover:to-darkbrown-700 text-white"
                  : sub.value === "english"
                  ? "bg-gradient-to-r from-brown-500 to-brown-700 hover:from-brown-600 hover:to-brown-800 text-white"
                  : "bg-gradient-to-r from-brown-400 to-brown-600 hover:from-brown-500 hover:to-brown-700 text-white"
              }
            `}
            style={{ fontFamily: "'Oswald', Oswald", backgroundColor: "#B3A285" }}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectSub;
