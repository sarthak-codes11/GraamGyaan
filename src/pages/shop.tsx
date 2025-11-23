import React, { useState } from "react";
import { useRouter } from "next/router";
import { useBoundStore } from "~/hooks/useBoundStore";
import { LeftBar } from "~/components/LeftBar";
import RightBar from "~/components/RightBar";

// Shop item types
interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "module" | "book";
  category: string;
  image?: string;
  isPurchased?: boolean;
}

// Sample shop items
const shopItems: ShopItem[] = [
  // Educational Modules
  {
    id: "advanced-math",
    name: "Advanced Mathematics",
    description: "Unlock advanced math concepts including calculus, algebra, and geometry",
    price: 25,
    type: "module",
    category: "Mathematics",
  },
  {
    id: "science-lab",
    name: "Virtual Science Lab",
    description: "Interactive experiments and simulations for physics and chemistry",
    price: 750,
    type: "module",
    category: "Science",
  },
  {
    id: "coding-basics",
    name: "Programming Fundamentals",
    description: "Learn basic programming concepts with interactive coding exercises",
    price: 600,
    type: "module",
    category: "Technology",
  },
  {
    id: "language-master",
    name: "Language Mastery",
    description: "Advanced language learning with pronunciation and grammar tools",
    price: 400,
    type: "module",
    category: "Languages",
  },
  
  // Reference Books
  {
    id: "math-handbook",
    name: "Complete Mathematics Handbook",
    description: "Comprehensive reference for all mathematical concepts and formulas",
    price: 200,
    type: "book",
    category: "Mathematics",
  },
  {
    id: "science-encyclopedia",
    name: "Science Encyclopedia",
    description: "Detailed explanations of scientific principles and discoveries",
    price: 300,
    type: "book",
    category: "Science",
  },
  {
    id: "history-atlas",
    name: "Interactive History Atlas",
    description: "Visual timeline and maps of world history events",
    price: 250,
    type: "book",
    category: "History",
  },
  {
    id: "grammar-guide",
    name: "Grammar & Writing Guide",
    description: "Complete guide to grammar rules and writing techniques",
    price: 150,
    type: "book",
    category: "Languages",
  },
];

// Shop icons
const ModuleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const XPIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

export default function Shop() {
  const router = useRouter();
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");
  
  // Get XP and shop data from store
  const totalXp = useBoundStore((x) => x.xpAllTime());
  const purchaseItem = useBoundStore((x) => x.purchaseItem);
  const isPurchased = useBoundStore((x) => x.isPurchased);
  
  // Local state for UI
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(shopItems.map(item => item.category)))];
  
  // Filter items by category
  const filteredItems = selectedCategory === "All" 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);
  
  // Handle purchase
  const handlePurchase = (item: ShopItem) => {
    purchaseItem(item.id, item.price);
  };
  
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
              {t("Shop", "दुकान", "దుకాణం")}
            </h1>
            <p className="text-gray-600 mb-4">
              {t(
                "Use your earned XP to unlock new learning modules and reference books",
                "नए शिक्षण मॉड्यूल और संदर्भ पुस्तकों को अनलॉक करने के लिए अपने अर्जित XP का उपयोग करें",
                "కొత్త అభ్యాస మాడ్యూల్స్ మరియు రిఫరెన్స్ పుస్తకాలను అన్‌లాక్ చేయడానికి మీ సంపాదించిన XP ని ఉపయోగించండి"
              )}
            </p>
            
            {/* XP Balance */}
            <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 inline-flex">
              <XPIcon />
              <span className="font-bold text-yellow-800">
                {t("Your XP:", "आपका XP:", "మీ XP:")} {totalXp}
              </span>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-[#654321] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {t(category, category, category)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Shop Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const itemPurchased = isPurchased(item.id);
              const canAfford = totalXp >= item.price;
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                    itemPurchased 
                      ? "border-green-300 bg-green-50" 
                      : canAfford 
                        ? "border-blue-300 hover:border-blue-400" 
                        : "border-gray-200 opacity-75"
                  }`}
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === "module" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                      }`}>
                        {item.type === "module" ? <ModuleIcon /> : <BookIcon />}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                        <span className="text-sm text-gray-500 capitalize">
                          {t(item.type, item.type === "module" ? "मॉड्यूल" : "पुस्तक", item.type === "module" ? "మాడ్యూల్" : "పుస్తకం")}
                        </span>
                      </div>
                    </div>
                    
                    {itemPurchased && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {t("Owned", "स्वामित्व", "స్వంతం")}
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Price and Purchase Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-600 font-bold">
                      <XPIcon />
                      <span>{item.price}</span>
                    </div>
                    
                    {itemPurchased ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium cursor-default"
                        disabled
                      >
                        {t("Purchased", "खरीदा गया", "కొనుగోలు చేయబడింది")}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          canAfford
                            ? "bg-[#654321] text-white hover:bg-[#543619]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {canAfford 
                          ? t("Purchase", "खरीदें", "కొనుగోలు") 
                          : t("Not enough XP", "पर्याप्त XP नहीं", "తగినంత XP లేదు")
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {t("No items found", "कोई आइटम नहीं मिला", "ఎలాంటి వస్తువులు కనుగొనబడలేదు")}
              </h3>
              <p className="text-gray-500">
                {t("Try selecting a different category", "एक अलग श्रेणी का चयन करने का प्रयास करें", "వేరే వర్గాన్ని ఎంచుకోవడానికి ప్రయత్నించండి")}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <RightBar />
    </div>
  );
}
