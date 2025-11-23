import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useBoundStore } from "~/hooks/useBoundStore";
import { LeftBar } from "~/components/LeftBar";
import RightBar from "~/components/RightBar";

// Shop items data (should match the shop page)
const shopItems = [
  {
    id: "advanced-math",
    name: "Advanced Mathematics",
    description: "Unlock advanced math concepts including calculus, algebra, and geometry",
    price: 25,
    type: "module" as const,
    category: "Mathematics",
  },
  {
    id: "science-lab",
    name: "Virtual Science Lab",
    description: "Interactive experiments and simulations for physics and chemistry",
    price: 750,
    type: "module" as const,
    category: "Science",
  },
  {
    id: "coding-basics",
    name: "Programming Fundamentals",
    description: "Learn basic programming concepts with interactive coding exercises",
    price: 600,
    type: "module" as const,
    category: "Technology",
  },
  {
    id: "language-master",
    name: "Language Mastery",
    description: "Advanced language learning with pronunciation and grammar tools",
    price: 400,
    type: "module" as const,
    category: "Languages",
  },
  {
    id: "math-handbook",
    name: "Complete Mathematics Handbook",
    description: "Comprehensive reference for all mathematical concepts and formulas",
    price: 200,
    type: "book" as const,
    category: "Mathematics",
  },
  {
    id: "science-encyclopedia",
    name: "Science Encyclopedia",
    description: "Detailed explanations of scientific principles and discoveries",
    price: 300,
    type: "book" as const,
    category: "Science",
  },
  {
    id: "history-atlas",
    name: "Interactive History Atlas",
    description: "Visual timeline and maps of world history events",
    price: 250,
    type: "book" as const,
    category: "History",
  },
  {
    id: "grammar-guide",
    name: "Grammar & Writing Guide",
    description: "Complete guide to grammar rules and writing techniques",
    price: 150,
    type: "book" as const,
    category: "Languages",
  },
];

const ModuleIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function PurchasedCourses() {
  const router = useRouter();
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");
  
  // Get purchased items from store
  const purchasedItems = useBoundStore((x) => x.getPurchasedItems());
  
  // Filter shop items to show only purchased ones
  const purchasedCourses = shopItems.filter(item => purchasedItems.includes(item.id));
  
  // Separate modules and books
  const purchasedModules = purchasedCourses.filter(item => item.type === "module");
  const purchasedBooks = purchasedCourses.filter(item => item.type === "book");
  
  // Translation helper
  const t = (en: string, hi: string, te: string) => {
    if (isHindi) return hi;
    if (isTelugu) return te;
    return en;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftBar selectedTab={null} />
      
      <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#654321] mb-2">
              {t("My Purchased Courses", "मेरे खरीदे गए कोर्स", "నా కొనుగోలు చేసిన కోర్సులు")}
            </h1>
            <p className="text-gray-600 mb-4">
              {t(
                "Access your purchased educational modules and reference books",
                "अपने खरीदे गए शैक्षिक मॉड्यूल और संदर्भ पुस्तकों तक पहुंचें",
                "మీ కొనుగోలు చేసిన విద్యా మాడ్యూల్స్ మరియు రిఫరెన్స్ పుస్తకాలను యాక్సెస్ చేయండి"
              )}
            </p>
          </div>

          {/* No purchased items message */}
          {purchasedCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-8xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {t("No courses purchased yet", "अभी तक कोई कोर्स नहीं खरीदा", "ఇంకా ఎలాంటి కోర్సులు కొనుగోలు చేయలేదు")}
              </h3>
              <p className="text-gray-500 mb-6">
                {t(
                  "Visit the shop to purchase educational modules and books using your XP",
                  "अपने XP का उपयोग करके शैक्षिक मॉड्यूल और पुस्तकें खरीदने के लिए दुकान पर जाएं",
                  "మీ XP ని ఉపయోగించి విద్యా మాడ్యూల్స్ మరియు పుస్తకాలను కొనుగోలు చేయడానికి దుకాణాన్ని సందర్శించండి"
                )}
              </p>
              <Link
                href={isHindi ? "/hindi/shop" : isTelugu ? "/telugu/shop" : "/shop"}
                className="inline-flex items-center px-6 py-3 bg-[#654321] text-white rounded-lg font-medium hover:bg-[#543619] transition-colors"
              >
                {t("Visit Shop", "दुकान पर जाएं", "దుకాణాన్ని సందర్శించండి")}
              </Link>
            </div>
          )}

          {/* Purchased Modules */}
          {purchasedModules.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <ModuleIcon />
                </div>
                {t("Educational Modules", "शैक्षिक मॉड्यूल", "విద్యా మాడ్యూల్స్")} ({purchasedModules.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedModules.map(module => (
                  <div
                    key={module.id}
                    className="bg-white rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                        <ModuleIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{module.name}</h3>
                        <span className="text-sm text-blue-600 font-medium">{module.category}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    
                    <Link
                      href={`/modules/${module.id}`}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block text-center"
                    >
                      {t("Start Learning", "सीखना शुरू करें", "నేర్చుకోవడం ప్రారంభించండి")}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchased Books */}
          {purchasedBooks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <BookIcon />
                </div>
                {t("Reference Books", "संदर्भ पुस्तकें", "రిఫరెన్స్ పుస్తకాలు")} ({purchasedBooks.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedBooks.map(book => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                        <BookIcon />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{book.name}</h3>
                        <span className="text-sm text-purple-600 font-medium">{book.category}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{book.description}</p>
                    
                    <Link
                      href={`/books/${book.id}`}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-block text-center"
                    >
                      {t("Read Book", "पुस्तक पढ़ें", "పుస్తకం చదవండి")}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <RightBar />
    </div>
  );
}
