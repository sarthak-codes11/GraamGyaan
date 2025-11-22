"use client";

import type { NextPage } from "next";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
} from "~/components/Svgs";
import { useBoundStore } from "~/hooks/useBoundStore";

// TYPES ----------------------------------------------------------------------

// Lesson 1: Sorting Materials Into Groups
const lesson1Problems = [
  {
    type: "MCQ",
    question: "Why is sorting materials into groups important?",
    answers: [
      "To make everything look neat",
      "To confuse scientists", 
      "To study materials easily and use them properly",
      "To make them expensive"
    ],
    correctAnswer: 2,
    explanation: "Sorting helps us compare, study, and understand materials better. It allows us to select the right material for a specific purpose."
  },
  {
    type: "MCQ",
    question: "Which of the following is NOT a benefit of sorting materials?",
    answers: [
      "Helps in studying materials",
      "Makes recycling easier",
      "Wastes more time",
      "Helps in choosing the right material"
    ],
    correctAnswer: 2,
    explanation: "Sorting actually saves time and effort by organizing materials efficiently. It does not waste time."
  },
  {
    type: "MCQ",
    question: "A cooking pot is made of metal mainly because:",
    answers: [
      "It looks shiny",
      "It is colourful",
      "It conducts heat well",
      "It is cheap"
    ],
    correctAnswer: 2,
    explanation: "Metals are good conductors of heat, which is why cooking pots are made from them so that food cooks evenly."
  },
  {
    type: "MCQ",
    question: "Grouping materials based on similar properties is known as:",
    answers: [
      "Painting",
      "Sorting",
      "Mixing",
      "Designing"
    ],
    correctAnswer: 1,
    explanation: "Sorting means grouping similar materials together based on common properties like appearance, hardness, solubility, etc."
  }
] as const;

// Odia: Lesson 1
const lesson1ProblemsOr = [
  {
    type: "MCQ",
    question: "ପଦାର୍ଥକୁ ଦଳରେ ବିଭକ୍ତ କରିବା କାହିଁକି ଦରକାର?",
    answers: [
      "ସବୁ କିଛି ଚିକ୍କଣ ଦେଖାଇବାପାଇଁ",
      "ବିଜ୍ଞାନୀମାନଙ୍କୁ ଘୁଚାଇବାପାଇଁ",
      "ପଦାର୍ଥକୁ ସହଜରେ ଅଧ୍ୟୟନ କରି ବଞ୍ଚିତ ସଠିକ୍ ବ୍ୟବହାର ପାଇଁ",
      "ସେଗୁଡ଼ିକୁ ଦାମିଆ କରିବାପାଇଁ",
    ],
    correctAnswer: 2,
    explanation:
      "ବର୍ଗୀକରଣ ଦ୍ୱାରା ପଦାର୍ଥଙ୍କୁ ତୁଲନା, ଅଧ୍ୟୟନ ଏବଂ ବୁଝିବା ସହଜ ହୁଏ। ନିର୍ଦ୍ଦିଷ୍ଟ କାମ ପାଇଁ ସଠିକ୍ ପଦାର୍ଥ ବାଛିବାରେ ଏହା ସାହାଯ୍ୟ କରେ।",
  },
  {
    type: "MCQ",
    question: "ନିମ୍ନଲିଖିତରୁ କୁହିଁଟି ବର୍ଗୀକରଣର ଲାଭ ନୁହେଁ?",
    answers: [
      "ଅଧ୍ୟୟନରେ ସାହାଯ୍ୟ କରେ",
      "ରିସାଇକ୍ଲିଂ ସହଜ କରେ",
      "ଅଧିକ ସମୟ ନଷ୍ଟ କରେ",
      "ଠିକ୍ ପଦାର୍ଥ ବାଛିବାରେ ସାହାଯ୍ୟ କରେ",
    ],
    correctAnswer: 2,
    explanation:
      "ବର୍ଗୀକରଣ ପଦାର୍ଥକୁ ସଠିକ୍ ଭାବେ ଗୋଛାଇ ରଖି ସମୟ ଓ ପରିଶ୍ରମ ବଞ୍ଚାଏ; ଏହା ସମୟ ନଷ୍ଟ କରେ ନାହିଁ।",
  },
  {
    type: "MCQ",
    question: "ରନ୍ଧଣ ହାଣ୍ଡି ସାଧାରଣତଃ ଧାତୁରୁ କାହିଁକି ତିଆରି କରାଯାଏ?",
    answers: ["ଯେହେତୁ ଚମକେ", "ଯେହେତୁ ରଙ୍ଗୀନ", "ଯେହେତୁ ତାପ ଭଲ ଭାବେ ବହନ କରେ", "ଯେହେତୁ ସସ୍ତା"],
    correctAnswer: 2,
    explanation:
      "ଧାତୁ ତାପର ଭଲ ବାହକ; ସେଥିପାଇଁ ଧାତୁର ପାତ୍ରରେ ଖାଦ୍ୟ ସମଭାବରେ ସିଜେ।",
  },
  {
    type: "MCQ",
    question: "ସମାନ ଗୁଣ ଆଧାରରେ ପଦାର୍ଥକୁ ଦଳରେ କରିବାକୁ କ’ଣ କୁହାଯାଏ?",
    answers: ["ପେଣ୍ଟିଂ", "ବର୍ଗୀକରଣ", "ମିଶାଇବା", "ଡିଜାଇନିଂ"],
    correctAnswer: 1,
    explanation:
      "ବର୍ଗୀକରଣ ଅର୍ଥ ହେଲା ଦେଖା, କଠିନତା, ଦ୍ରାବ୍ୟତା ଇତ୍ୟାଦି ଗୁଣ ଆଧାରରେ ପଦାର୍ଥକୁ ଦଳରେ କରିବା।",
  },
] as const;

// Hindi: Lesson 1
const lesson1ProblemsHi = [
  {
    type: "MCQ",
    question: "सामग्री को समूहों में बाँटना क्यों महत्वपूर्ण है?",
    answers: [
      "सब कुछ साफ-सुथरा दिखाने के लिए",
      "वैज्ञानिकों को भ्रमित करने के लिए",
      "सामग्री को आसानी से पढ़ने और सही तरीके से उपयोग करने के लिए",
      "उन्हें महंगा बनाने के लिए",
    ],
    correctAnswer: 2,
    explanation:
      "छंटाई करने से हम सामग्री की तुलना, अध्ययन और समझ बेहतर तरीके से कर पाते हैं। इससे किसी विशेष काम के लिए सही सामग्री चुनना आसान होता है।",
  },
  {
    type: "MCQ",
    question: "निम्न में से कौन-सा सामग्री की छंटाई का लाभ नहीं है?",
    answers: [
      "सामग्री के अध्ययन में मदद करता है",
      "रीसाइक्लिंग को आसान बनाता है",
      "अधिक समय बर्बाद करता है",
      "सही सामग्री चुनने में मदद करता है",
    ],
    correctAnswer: 2,
    explanation:
      "छंटाई वास्तव में सामग्री को व्यवस्थित करके समय और मेहनत बचाती है। यह समय बर्बाद नहीं करती।",
  },
  {
    type: "MCQ",
    question: "खाना पकाने के बर्तन मुख्य रूप से धातु के क्यों बनाए जाते हैं?",
    answers: ["क्योंकि वे चमकदार दिखते हैं", "क्योंकि वे रंगीन होते हैं", "क्योंकि वे गर्मी का अच्छा संचार करते हैं", "क्योंकि वे सस्ते होते हैं"],
    correctAnswer: 2,
    explanation:
      "धातुएँ गर्मी की अच्छी चालक होती हैं, इसलिए उनसे बने बर्तनों में खाना समान रूप से पकता है।",
  },
  {
    type: "MCQ",
    question: "समान गुणों के आधार पर सामग्री को समूहों में बाँटना क्या कहलाता है?",
    answers: ["पेंटिंग", "छंटाई", "मिलाना", "डिज़ाइनिंग"],
    correctAnswer: 1,
    explanation:
      "छंटाई का अर्थ समान गुणों (जैसे दिखावट, कठोरता, घुलनशीलता) के आधार पर सामग्री को समूहों में बाँटना है।",
  },
] as const;

// Telugu: Lesson 1
const lesson1ProblemsTe = [
  {
    type: "MCQ",
    question: "పదార్థాలను సమూహాలుగా వర్గీకరించడం ఎందుకు ముఖ్యం?",
    answers: [
      "అన్నీ బాగుగా కనిపించడానికి",
      "శాస్త్రవేత్తలను గందరగోళానికి గురిచేయడానికి",
      "పదార్థాలను సులభంగా అధ్యయనం చేసి సరిగ్గా ఉపయోగించడానికి",
      "అవి ఖరీదుగా చేయడానికి",
    ],
    correctAnswer: 2,
    explanation:
      "వర్గీకరణ వల్ల పదార్థాలను సరిపోల్చడం, అధ్యయనం చేయడం, అర్థం చేసుకోవడం సులభమవుతుంది. ఒక నిర్దిష్ట అవసరానికి సరైన పదార్థాన్ని ఎంచుకోవడంలో ఇది సహాయపడుతుంది.",
  },
  {
    type: "MCQ",
    question: "కిందివాటిలో వర్గీకరణ వల్ల కలిగే లాభం కానిది ఏది?",
    answers: [
      "పదార్థాల అధ్యయనానికి సహాయం",
      "రీసైక్లింగ్ సులభం అవుతుంది",
      "ఎక్కువ సమయం వృథా అవుతుంది",
      "సరైన పదార్థాన్ని ఎంచుకోవడంలో సహాయం",
    ],
    correctAnswer: 2,
    explanation:
      "వర్గీకరణ వాస్తవానికి పదార్థాలను సక్రమంగా అమర్చడం ద్వారా సమయం, శ్రమలను ఆదా చేస్తుంది. ఇది సమయాన్ని వృథా చేయదు.",
  },
  {
    type: "MCQ",
    question: "వంట పాత్రలు సాధారణంగా లోహంతోనే ఎందుకు తయారు చేస్తారు?",
    answers: ["అవి మెరిసి కనిపిస్తాయి", "అవి రంగులుగా ఉంటాయి", "వేడి బాగా పారవేస్తాయి", "అవి చవకగా ఉంటాయి"],
    correctAnswer: 2,
    explanation:
      "లోహాలు వేడి యొక్క మంచి వాహకాలు. అందువల్ల వాటితో చేసిన పాత్రల్లో ఆహారం సమంగా వండబడుతుంది.",
  },
  {
    type: "MCQ",
    question: "సమాన లక్షణాల ఆధారంగా పదార్థాలను సమూహాలుగా చేయడాన్ని ఏమంటారు?",
    answers: ["పెయింటింగ్", "వర్గీకరణ", "కలపడం", "డిజైనింగ్"],
    correctAnswer: 1,
    explanation:
      "వర్గీకరణ అంటే రూపం, కఠినత్వం, ద్రావణీయత వంటి లక్షణాల ఆధారంగా పదార్థాలను సమూహాలుగా చేయడం.",
  },
] as const;

// Objects and Materials Lesson (Good Morning)
const objectsAndMaterialsProblems = [
  {
    type: "MCQ",
    question: "What is the main difference between an object and a material?",
    answers: [
      "Object is expensive, material is cheap",
      "Object is made of material",
      "Material is always colourful",
      "Object is natural, material is man-made"
    ],
    correctAnswer: 1,
    explanation: "Materials are substances (wood, metal, plastic) while objects are things made from them (chair, table, bottle)."
  },
  {
    type: "MCQ",
    question: "Which material is commonly used to make transparent windows?",
    answers: [
      "Wood",
      "Glass",
      "Metal",
      "Rubber"
    ],
    correctAnswer: 1,
    explanation: "Glass is transparent, allowing light to pass through, which makes it perfect for windows."
  },
  {
    type: "MCQ",
    question: "A pencil is usually made of:",
    answers: [
      "Plastic",
      "Rubber",
      "Wood",
      "Metal"
    ],
    correctAnswer: 2,
    explanation: "The body of a pencil is made of wood because it is easy to sharpen and holds the graphite core well."
  },
  {
    type: "MCQ",
    question: "Which of the following materials can be used to make multiple objects?",
    answers: [
      "Gold",
      "Wood",
      "Oil",
      "Salt"
    ],
    correctAnswer: 1,
    explanation: "Wood is used to make many objects like furniture, pencils, doors, boats, etc."
  }
] as const;

// Properties of Materials Lesson (Greet People)
const propertiesOfMaterialsProblems = [
  {
    type: "MCQ",
    question: "Which of the following is a hard material?",
    answers: [
      "Wool",
      "Iron",
      "Cotton",
      "Rubber"
    ],
    correctAnswer: 1,
    explanation: "Iron is a hard metal, unlike wool or cotton, which are soft."
  },
  {
    type: "MCQ",
    question: "Which material is soluble in water?",
    answers: [
      "Stone",
      "Oil",
      "Sugar",
      "Plastic"
    ],
    correctAnswer: 2,
    explanation: "Sugar dissolves completely in water, unlike sand or oil."
  },
  {
    type: "MCQ",
    question: "What do we call a material that does not allow light to pass through?",
    answers: [
      "Transparent",
      "Translucent",
      "Opaque",
      "Clear"
    ],
    correctAnswer: 2,
    explanation: "Opaque objects block light completely and form a shadow, like wood or metal."
  },
  {
    type: "MCQ",
    question: "Which material is a good conductor of electricity?",
    answers: [
      "Glass",
      "Plastic",
      "Wood",
      "Copper"
    ],
    correctAnswer: 3,
    explanation: "Copper conducts electricity well and is used to make electrical wires."
  },
  {
    type: "MCQ",
    question: "What property makes a material float on water?",
    answers: [
      "Density",
      "Color",
      "Shape",
      "Size"
    ],
    correctAnswer: 0,
    explanation: "Materials with lower density than water will float on water. Density is the mass per unit volume of a material."
  },
  {
    type: "MCQ",
    question: "Which material is most likely to be transparent?",
    answers: [
      "Wood",
      "Metal",
      "Glass",
      "Clay"
    ],
    correctAnswer: 2,
    explanation: "Glass is transparent because it allows light to pass through it clearly, unlike wood, metal, or clay which are opaque."
  },
  {
    type: "MCQ",
    question: "What happens to most metals when heated?",
    answers: [
      "They become softer",
      "They expand",
      "They change color",
      "They become magnetic"
    ],
    correctAnswer: 1,
    explanation: "Most metals expand when heated due to increased molecular motion, which is why metal bridges have expansion joints."
  },
  {
    type: "MCQ",
    question: "Which property makes rubber useful for making tires?",
    answers: [
      "It is transparent",
      "It is flexible and elastic",
      "It is magnetic",
      "It conducts electricity"
    ],
    correctAnswer: 1,
    explanation: "Rubber's flexibility and elasticity make it perfect for tires as it can deform under pressure and return to its original shape."
  }
] as const;

// Grouping Materials Based on Properties Lesson
const groupingMaterialsProblems = [
  {
    type: "MCQ",
    question: "Which material is likely to float on water?",
    answers: [
      "Stone",
      "Iron nail",
      "Plastic ball",
      "Gold coin"
    ],
    correctAnswer: 2,
    explanation: "Plastic is lighter than water, so it floats. Stones and iron sink because they are heavier."
  },
  {
    type: "MCQ",
    question: "What is the property of metal that makes it useful for making mirrors and ornaments?",
    answers: [
      "It is soft",
      "It is shiny",
      "It is colourful",
      "It is dull"
    ],
    correctAnswer: 1,
    explanation: "Metals like silver and gold are lustrous (shiny), which is why they are used for ornaments and mirrors."
  },
  {
    type: "MCQ",
    question: "Which of the following materials is translucent?",
    answers: [
      "Clear glass",
      "Butter paper",
      "Wood",
      "Metal sheet"
    ],
    correctAnswer: 1,
    explanation: "Translucent materials allow partial light to pass through, so objects appear blurred (like butter paper)."
  },
  {
    type: "MCQ",
    question: "Which is an insoluble substance in water?",
    answers: [
      "Salt",
      "Sugar",
      "Lemon juice",
      "Sand"
    ],
    correctAnswer: 3,
    explanation: "Sand does not dissolve in water and settles at the bottom."
  }
] as const;

// Add this type definition after the problem arrays (around line 172)
type LessonData = {
  problems: readonly any[];
  title: string;
  nextUnlock: string | null;
  xpRequired: number;
};

// Update the lessonData declaration (around line 174)
const lessonData: Record<string, LessonData> = {
  "Importance of Sorting Materials": { 
    problems: lesson1Problems, 
    title: "Sorting Materials Into Groups",
    nextUnlock: "Objects and Materials",
    xpRequired: 25
  },
  "Objects and Materials": { 
    problems: objectsAndMaterialsProblems, 
    title: "Objects and Materials",
    nextUnlock: "Properties of Materials",
    xpRequired: 25
  },
  "Properties of Materials": { 
    problems: propertiesOfMaterialsProblems, 
    title: "Properties of Materials",
    nextUnlock: "Grouping Materials Based on Properties",
    xpRequired: 25
  },
  "Grouping Materials Based on Properties": { 
    problems: groupingMaterialsProblems, 
    title: "Grouping Materials Based on Properties",
    nextUnlock: "Unit 1 review",
    xpRequired: 25
  }
};

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60) % 60;
  return [minutes, seconds].map(n => n.toString().padStart(2, "0")).join(":");
};

const TIMER_DURATION_MS = 30000; // 30s per problem
const MAX_LIVES = 3;
const XP_PER_CORRECT_ANSWER = 0; // No per-question XP to keep lesson total consistent
const XP_BONUS_FOR_PERFECT = 0; // No bonus; flat lesson XP is awarded

// COMPONENTS -----------------------------------------------------------------

const ProgressBar = ({ hearts, timer }: { hearts: number; timer: number }) => (
  <header className="flex items-center gap-2">
    {[...Array(MAX_LIVES)].map((_, i) =>
      i < hearts ? (
        <LessonTopBarHeart key={i} width={24} height={24} />
      ) : (
        <LessonTopBarEmptyHeart key={i} width={24} height={24} />
      )
    )}
    <span className="ml-4 font-mono text-gray-800 text-xl font-bold">⏳ {formatTime(timer)}</span>
  </header>
);

const FancyButton = ({
  children,
  onClick,
  disabled,
  variant = "default"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "correct" | "incorrect" | "selected";
}) => {
  const baseClasses = "rounded-xl px-6 py-3 font-semibold shadow-md transform transition-all border";
  
  const variantClasses = {
    default: "bg-gradient-to-br from-white to-beige-200 hover:from-beige-100 hover:to-white border-gray-300 hover:scale-105 hover:shadow-lg",
    selected: "bg-[#A3B18A] border-[#6B7D5B] text-white scale-105",
    correct: "bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800",
    incorrect: "bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

// STYLED END SCREENS ---------------------------------------------------------

const LessonFastForwardEndFail = ({ unitNumber, backHref, backLabel }: { unitNumber: number; backHref: string; backLabel: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndFailSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-red-600">
        Did not unlock the next part.
      </h1>
      <FancyButton>
        <Link href={backHref}>{backLabel}</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonFastForwardEndPass = ({ nextUnlock, backHref, backLabel }: { nextUnlock: string; backHref: string; backLabel: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
    <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
      <LessonFastForwardEndPassSvg width={96} height={96} />
      <h1 className="text-2xl font-bold text-green-600">
        Unlocked "{nextUnlock}"! 
      </h1>
      <p className="text-center text-gray-600">
        You've successfully completed all questions and unlocked the next lesson!
      </p>
      <FancyButton>
        <Link href={backHref}>{backLabel}</Link>
      </FancyButton>
    </div>
  </div>
);

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
  xpGained,
  isPerfect,
  lessonsCompleted,
  totalTimeMs,
  backHref,
  backLabel,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  xpGained: number;
  isPerfect: boolean;
  lessonsCompleted: number;
  totalTimeMs: number;
  backHref: string;
  backLabel: string;
}) => {
  const formatTotalTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">Lesson Complete </h1>
        <div className="text-center space-y-2">
          <p className="text-lg text-green-600 font-semibold">
            Correct answers: {correctAnswerCount}
          </p>
          <p className="text-lg text-red-600 font-semibold">
            Incorrect answers: {incorrectAnswerCount}
          </p>
          <p className="text-lg text-purple-600 font-semibold">
            ⏱️ Total time: {formatTotalTime(totalTimeMs)}
          </p>
          {isPerfect && (
            <p className="text-lg text-yellow-600 font-semibold">
              Perfect Score! ⭐
            </p>
          )}
        </div>
        <FancyButton>
          <Link href={backHref}>{backLabel}</Link>
        </FancyButton>
      </div>
    </div>
  );
};

// PROBLEM UI -----------------------------------------------------------------

const ProblemMCQ = ({
  problem,
  selectedAnswer,
  setSelectedAnswer,
  correctAnswerShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  hearts,
  timer,
  problemIndex,
  totalQuestions,
  labels,
  backHref,
}: any) => {
  const { question, answers, correctAnswer, explanation } = problem;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-beige-100 to-beige-200 animate-gradient">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <ProgressBar hearts={hearts} timer={timer} />
          <FancyButton>
            <Link href={backHref}>{labels.quit}</Link>
          </FancyButton>
        </div>
        <div className="text-center text-sm font-semibold text-gray-600">{labels.question} {problemIndex + 1} {labels.of} {totalQuestions}</div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">{question}</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {answers.map((answer: string, i: number) => {
            let buttonVariant: "default" | "correct" | "incorrect" | "selected" = "default";
            
            if (correctAnswerShown) {
              if (i === correctAnswer) {
                buttonVariant = "correct";
              } else if (i === selectedAnswer && !isAnswerCorrect) {
                buttonVariant = "incorrect";
              }
            } else if (selectedAnswer === i) {
              buttonVariant = "selected";
            }
            
            return (
              <label key={i} className="cursor-pointer">
                <FancyButton
                  onClick={() => setSelectedAnswer(i)}
                  disabled={correctAnswerShown}
                  variant={buttonVariant}
                >
                  <div className="flex items-center gap-3 w-full text-left">
                    <input
                      type="radio"
                      name="answer"
                      value={i}
                      checked={selectedAnswer === i}
                      onChange={() => setSelectedAnswer(i)}
                      disabled={correctAnswerShown}
                      className="w-4 h-4 text-[#6B7D5B] bg-gray-100 border-gray-300 focus:ring-[#6B7D5B]"
                    />
                    <span className="font-bold text-lg">{String.fromCharCode(65 + i)})</span>
                    <span>{answer}</span>
                  </div>
                </FancyButton>
              </label>
            );
          })}
        </div>
        
        {!correctAnswerShown ? (
          <FancyButton onClick={onCheckAnswer} disabled={selectedAnswer === null}>
            {labels.checkAnswer}
          </FancyButton>
        ) : (
          <FancyButton onClick={onFinish}>{labels.continue}</FancyButton>
        )}
        
        {correctAnswerShown && (
          <div className="space-y-4">
            <div
              className={`text-center font-semibold text-lg ${
                isAnswerCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAnswerCorrect ? labels.correct : labels.incorrect}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-lg">💡</span>
                <div>
                  <p className="font-semibold text-blue-800 mb-1">{labels.explanation}</p>
                  <p className="text-blue-700">{explanation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Animated gradient background (fixed, behind everything)
const AnimatedGradientBackground = () => (
  <>
    <style jsx global>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
    <div className="pointer-events-none fixed inset-0 -z-50">
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(270deg, #6B7D5B, #556B2F, #3E4C35, #2B3A2A)",
          backgroundSize: "600% 600%",
          animation: "gradientShift 10s ease infinite",
          filter: "saturate(0.9) brightness(1) opacity(0.6)",
        }}
      />
    </div>
  </>
);

// MAIN LESSON ----------------------------------------------------------------

const Lesson: NextPage = () => {
  const router = useRouter();
  const [problemIdx, setProblemIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timer, setTimer] = useState(TIMER_DURATION_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [totalTimeMs, setTotalTimeMs] = useState(0);

  // Store hooks
  const increaseXp = useBoundStore((state) => state.increaseXp);
  const increaseLessonsCompleted = useBoundStore((state) => state.increaseLessonsCompleted);
  const lessonsCompleted = useBoundStore((state) => state.lessonsCompleted);

  // near the top, after problem arrays
  type LessonKey = "1" | "2" | "3" | "4";
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");
  const isOdia = router.pathname.startsWith("/odia");

  const lessons: Record<LessonKey, { title: string; problems: readonly any[] }> = {
    "1": {
      title: "Importance of Sorting Materials",
      problems: isHindi ? lesson1ProblemsHi : isTelugu ? lesson1ProblemsTe : isOdia ? lesson1ProblemsOr : lesson1Problems,
    },
    "2": { title: "Objects and Materials", problems: objectsAndMaterialsProblems },
    "3": { title: "Properties of Materials", problems: propertiesOfMaterialsProblems },
    "4": { title: "Grouping Materials Based on Properties", problems: groupingMaterialsProblems },
  };

  const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

  const resolveLessonKey = (q?: string): LessonKey => {
    if (!q) return "1";
    // direct numeric
    if (q === "1" || q === "2" || q === "3" || q === "4") return q;
    // known aliases
    if (q === "objects" || q === "good-morning") return "2";
    if (q === "properties" || q === "greet-people") return "3";
    if (q === "grouping" || q === "grouping-materials") return "4";
    // titles or slugs
    const byTitle =
      q === "Importance of Sorting Materials" ? "1" :
      q === "Objects and Materials" ? "2" :
      q === "Properties of Materials" ? "3" :
      q === "Grouping Materials Based on Properties" ? "4" : undefined;
    if (byTitle) return byTitle;
    const bySlug =
      q === slug("Importance of Sorting Materials") ? "1" :
      q === slug("Objects and Materials") ? "2" :
      q === slug("Properties of Materials") ? "3" :
      q === slug("Grouping Materials Based on Properties") ? "4" : undefined;
    return (bySlug as LessonKey) ?? "1";
  };

  // state + effect
  const [currentLesson, setCurrentLesson] = useState<LessonKey>("1");
  useEffect(() => {
    if (!router.isReady) return;
    setCurrentLesson(resolveLessonKey(router.query.lesson as string | undefined));
  }, [router.isReady, router.query.lesson]);

  // select problems; do NOT fall back to lesson1
  const problems = lessons[currentLesson].problems;
  if (!router.isReady) return null; // or a loader
  if (problems.length === 0) {
    return (
      <>
        <AnimatedGradientBackground />
        <div className="min-h-screen flex items-center justify-center">Coming soon</div>
      </>
    );
  }

  const problem = problems[problemIdx];

  // Timer effect
  useEffect(() => {
    if (timer > 0 && !correctAnswerShown) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1000);
      }, 1000);
    } else if (timer === 0 && !correctAnswerShown) {
      // Time's up - treat as wrong answer
      setCorrectAnswerShown(true);
      setIncorrectAnswerCount(c => c + 1);
      setLives(l => Math.max(0, l - 1));
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, correctAnswerShown]);

  // Reset timer for new problems
  useEffect(() => {
    if (!correctAnswerShown) {
      setTimer(TIMER_DURATION_MS);
    }
  }, [problemIdx]);

  // Early exits
  if (lives <= 0) return (
    <>
      <AnimatedGradientBackground />
      <LessonFastForwardEndFail unitNumber={1} backHref={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"} backLabel={isHindi ? "मुख्य पेज पर जाएँ" : isTelugu ? "ముఖ్య పేజీకి వెళ్లండి" : "Back to main"} />
    </>
  );
  if (showSummary) {
    const isPerfect = incorrectAnswerCount === 0;
    return (
      <>
        <AnimatedGradientBackground />
        <LessonComplete
          correctAnswerCount={correctAnswerCount}
          incorrectAnswerCount={incorrectAnswerCount}
          xpGained={xpGained}
          isPerfect={isPerfect}
          lessonsCompleted={lessonsCompleted}
          totalTimeMs={totalTimeMs}
          backHref={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"}
          backLabel={isHindi ? "मुख्य पेज पर जाएँ" : isTelugu ? "ముఖ్య పేజీకి వెళ్లండి" : "Back to main"}
        />
      </>
    );
  }

  if (!problem) return (
    <>
      <AnimatedGradientBackground />
      <div>Unknown problem type</div>
    </>
  );

  const isAnswerCorrect = selectedAnswer === problem.correctAnswer;

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    
    if (isAnswerCorrect) {
      setCorrectAnswerCount(c => c + 1);
    } else {
      setIncorrectAnswerCount(c => c + 1);
      setLives(l => Math.max(0, l - 1));
    }
  };

  const onFinish = () => {
    if (problemIdx + 1 < problems.length) {
      setProblemIdx(problemIdx + 1);
      setSelectedAnswer(null);
      setCorrectAnswerShown(false);
      setTimer(TIMER_DURATION_MS);
    } else {
      // Lesson completed: +25 XP, mark completed
      const endTime = Date.now();
      setTotalTimeMs(endTime - lessonStartTime);
      increaseXp(25);
      increaseLessonsCompleted(1);
      setShowSummary(true);
    }
  };

  // Function to handle chest open event
  const handleChestOpen = () => {
    // Assuming increaseLessonsCompleted updates the milestone count in the store
    increaseLessonsCompleted(1);
  };

  switch (problem.type) {
    case "MCQ":
      const labels = isHindi
        ? {
            quit: "बाहर निकलें",
            question: "प्रश्न",
            of: "में से",
            checkAnswer: "उत्तर जाँचें",
            continue: "आगे बढ़ें",
            correct: "✅ सही!",
            incorrect: "❌ गलत",
            explanation: "व्याख्या:",
          }
        : isTelugu
        ? {
            quit: "వెనక్కి వెళ్ళండి",
            question: "ప్రశ్న",
            of: "లో",
            checkAnswer: "సమాధానం చెక్ చేయండి",
            continue: "తరువాత",
            correct: "✅ సరైంది!",
            incorrect: "❌ తప్పు",
            explanation: "వివరణ:",
          }
        : isOdia
        ? {
            quit: "ବାହାରିବେ",
            question: "ପ୍ରଶ୍ନ",
            of: "ମଧ୍ୟରୁ",
            checkAnswer: "ଉତ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ",
            continue: "ଆଗକୁ ଯାଆନ୍ତୁ",
            correct: "✅ ଠିକ୍!",
            incorrect: "❌ ଭୁଲ୍",
            explanation: "ବ୍ୟାଖ୍ୟା:",
          }
        : {
            quit: "Quit",
            question: "Question",
            of: "of",
            checkAnswer: "Check Answer",
            continue: "Continue",
            correct: "✅ Correct!",
            incorrect: "❌ Incorrect",
            explanation: "Explanation:",
          };
      return (
        <>
          <AnimatedGradientBackground />
          <ProblemMCQ
            problem={problem}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            correctAnswerShown={correctAnswerShown}
            isAnswerCorrect={isAnswerCorrect}
            onCheckAnswer={onCheckAnswer}
            onFinish={onFinish}
            hearts={lives}
            timer={timer}
            problemIndex={problemIdx}
            totalQuestions={problems.length}
            labels={labels}
            backHref={isHindi ? "/hindi" : isTelugu ? "/telugu" : isOdia ? "/odia" : "/learn"}
          />
        </>
      );
    default:
      return (
        <>
          <AnimatedGradientBackground />
          <div>Unknown problem type</div>
        </>
      );
  }
};

export default Lesson;