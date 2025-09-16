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
        // push string URL with query to Telugu page
        void router.push(`/telugu?subject=${encodeURIComponent(subject)}`);
    };

    return (
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",  // centers vertically
            minHeight: "100vh", 
            width: "100%", 
            background: "linear-gradient(to right, #fceabb, #BAB86C)" 
          }}
        >
            <div className="flex justify-center mb-10">
              <h2 className="text-7xl font-extrabold text-[#006400] tracking-wide drop-shadow-lg"  
              style={{ fontFamily: "'Oswald' , Oswald"}}>
          విషయం ఎంచుకోండి
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
                  style={{ fontFamily: "'Oswald', Oswald", backgroundColor:"#B3A285"}}
                >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectSub;