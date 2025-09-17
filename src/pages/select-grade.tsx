"use client";

import React from "react";
import { useRouter } from "next/navigation";

const grades = [
    { name: "Grade 6", value: "6" },
    { name: "Grade 7", value: "7" },
    { name: "Grade 8", value: "8" },
    { name: "Grade 9", value: "9" },
    { name: "Grade 10", value: "10" },
    { name: "Grade 11", value: "11" },
    { name: "Grade 12", value: "12" },
];

const SelectGrade: React.FC = () => {
    const router = useRouter();
    
    const handleSelect = (grade: string) => {
        // For now, only Grade 6 leads to subject selection
        if (grade === "6") {
            void router.push("/selectsub");
        } else {
            // For other grades, you can add specific logic or show a message
            alert(`Grade ${grade} content coming soon!`);
        }
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
            background: "linear-gradient(to right, #fceabb, #BAB86C)" 
          }}
        >
            <div className="flex justify-center mb-10">
              <h2 className="text-7xl font-extrabold text-[#006400] tracking-wide drop-shadow-lg"  
              style={{ fontFamily: "'Oswald', Oswald"}}>
                Select Your Grade
              </h2>
            </div>    

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-6">
              {grades.map((grade) => (
                <button 
                  key={grade.value}
                  onClick={() => handleSelect(grade.value)}
                  className={`
                    w-full py-12 rounded-2xl font-extrabold text-4xl shadow-2xl tracking-wide
                    transition-all transform hover:scale-110 focus:outline-none
                    hover:shadow-[0_0_20px_#FFD700] border-2 border-transparent
                    ${
                      grade.value === "6"
                        ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-green-300"
                        : "bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white"
                    }
                  `}
                  style={{ 
                    fontFamily: "'Oswald', Oswald", 
                    backgroundColor: grade.value === "6" ? "#22C55E" : "#B3A285"
                  }}
                >
                  {grade.name}
                  {grade.value === "6" && (
                    <div className="text-sm font-normal mt-2 opacity-90">
                      Available Now!
                    </div>
                  )}
                  {grade.value !== "6" && (
                    <div className="text-sm font-normal mt-2 opacity-70">
                      Coming Soon
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Back button */}
            <div className="mt-8">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-white text-[#006400] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-[#006400]"
                style={{ fontFamily: "'Oswald', Oswald" }}
              >
                ← Back
              </button>
            </div>
        </div>
    );
};

export default SelectGrade;
