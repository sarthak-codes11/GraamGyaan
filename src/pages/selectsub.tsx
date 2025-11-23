"use client";

import React from "react";
import { useRouter } from "next/navigation";

const subjects = [
    { name: "Science", value: "science" },
    { name: "IT", value: "it" },
    { name: "Mathematics", value: "mathematics" },
    { name: "English", value: "english" },
];

const SelectSub: React.FC = () => {
    const router = useRouter();
    
    const handleSelect = (subject: string) => {
        // push string URL with query
        void router.push(`/learn?subject=${encodeURIComponent(subject)}`);
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
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 px-4 text-center">
              <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#006400] tracking-wide drop-shadow-lg"  
              style={{ fontFamily: "'Oswald' , Oswald"}}>
                Select a Subject
              </h2>
            </div>    

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mx-auto px-4 sm:px-6">
              {subjects.map((sub) => (
                <button 
                  key={sub.value}
                  onClick={() => handleSelect(sub.value)}
                  className={`
                    w-full py-8 sm:py-10 md:py-12 rounded-2xl font-extrabold text-2xl sm:text-3xl md:text-4xl shadow-2xl tracking-wide
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
