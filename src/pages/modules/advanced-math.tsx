import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useBoundStore } from "~/hooks/useBoundStore";
import { LeftBar } from "~/components/LeftBar";
import RightBar from "~/components/RightBar";

// Advanced Math module content
const moduleContent = {
  title: "Advanced Mathematics",
  description: "Master advanced mathematical concepts including calculus, algebra, and geometry",
  totalLessons: 12,
  estimatedTime: "8-10 hours",
  difficulty: "Advanced",
  
  chapters: [
    {
      id: 1,
      title: "Differential Calculus",
      lessons: [
        {
          id: 1,
          title: "Introduction to Limits",
          duration: "45 min",
          completed: false,
          content: {
            theory: `
              <h3>Understanding Limits</h3>
              <p>A limit describes the behavior of a function as its input approaches a particular value. It's the foundation of calculus.</p>
              
              <h4>Definition</h4>
              <p>The limit of f(x) as x approaches c is L, written as:</p>
              <div class="math-formula">lim(x→c) f(x) = L</div>
              
              <h4>Properties of Limits</h4>
              <ul>
                <li>Sum Rule: lim[f(x) + g(x)] = lim f(x) + lim g(x)</li>
                <li>Product Rule: lim[f(x) × g(x)] = lim f(x) × lim g(x)</li>
                <li>Quotient Rule: lim[f(x) / g(x)] = lim f(x) / lim g(x) (if lim g(x) ≠ 0)</li>
              </ul>
            `,
            examples: [
              {
                problem: "Find lim(x→2) (x² + 3x - 1)",
                solution: "Substitute x = 2: (2)² + 3(2) - 1 = 4 + 6 - 1 = 9"
              },
              {
                problem: "Find lim(x→0) (sin x / x)",
                solution: "This is a standard limit equal to 1"
              }
            ]
          }
        },
        {
          id: 2,
          title: "Derivatives and Differentiation",
          duration: "60 min",
          completed: false,
          content: {
            theory: `
              <h3>Introduction to Derivatives</h3>
              <p>The derivative represents the rate of change of a function at any given point.</p>
              
              <h4>Definition</h4>
              <p>The derivative of f(x) is:</p>
              <div class="math-formula">f'(x) = lim(h→0) [f(x+h) - f(x)] / h</div>
              
              <h4>Basic Derivative Rules</h4>
              <ul>
                <li>Power Rule: d/dx(xⁿ) = nx^(n-1)</li>
                <li>Sum Rule: d/dx[f(x) + g(x)] = f'(x) + g'(x)</li>
                <li>Product Rule: d/dx[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)</li>
                <li>Chain Rule: d/dx[f(g(x))] = f'(g(x)) × g'(x)</li>
              </ul>
            `,
            examples: [
              {
                problem: "Find the derivative of f(x) = 3x² + 2x - 5",
                solution: "f'(x) = 6x + 2"
              },
              {
                problem: "Find the derivative of f(x) = (x² + 1)(x - 2)",
                solution: "Using product rule: f'(x) = (2x)(x-2) + (x²+1)(1) = 2x² - 4x + x² + 1 = 3x² - 4x + 1"
              }
            ]
          }
        },
        {
          id: 3,
          title: "Applications of Derivatives",
          duration: "50 min",
          completed: false,
          content: {
            theory: `
              <h3>Real-world Applications</h3>
              <p>Derivatives have numerous practical applications in physics, economics, and engineering.</p>
              
              <h4>Key Applications</h4>
              <ul>
                <li><strong>Velocity and Acceleration:</strong> If s(t) is position, then v(t) = s'(t) is velocity and a(t) = v'(t) is acceleration</li>
                <li><strong>Optimization:</strong> Finding maximum and minimum values of functions</li>
                <li><strong>Related Rates:</strong> How one quantity changes with respect to another</li>
                <li><strong>Curve Sketching:</strong> Understanding the shape and behavior of functions</li>
              </ul>
            `,
            examples: [
              {
                problem: "A ball is thrown upward with initial velocity 64 ft/s. Find when it reaches maximum height.",
                solution: "s(t) = -16t² + 64t. v(t) = s'(t) = -32t + 64. Set v(t) = 0: t = 2 seconds"
              }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      title: "Integral Calculus",
      lessons: [
        {
          id: 4,
          title: "Introduction to Integration",
          duration: "55 min",
          completed: false,
          content: {
            theory: `
              <h3>Understanding Integration</h3>
              <p>Integration is the reverse process of differentiation. It finds the area under curves and accumulates quantities.</p>
              
              <h4>Indefinite Integral</h4>
              <p>∫ f(x) dx = F(x) + C, where F'(x) = f(x)</p>
              
              <h4>Basic Integration Rules</h4>
              <ul>
                <li>Power Rule: ∫ xⁿ dx = x^(n+1)/(n+1) + C (n ≠ -1)</li>
                <li>Sum Rule: ∫ [f(x) + g(x)] dx = ∫ f(x) dx + ∫ g(x) dx</li>
                <li>Constant Multiple: ∫ k·f(x) dx = k·∫ f(x) dx</li>
              </ul>
            `,
            examples: [
              {
                problem: "Find ∫ (3x² + 2x - 1) dx",
                solution: "∫ (3x² + 2x - 1) dx = x³ + x² - x + C"
              }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Algebra",
      lessons: [
        {
          id: 5,
          title: "Complex Numbers",
          duration: "40 min",
          completed: false,
          content: {
            theory: `
              <h3>Introduction to Complex Numbers</h3>
              <p>Complex numbers extend the real number system to include solutions to equations like x² + 1 = 0.</p>
              
              <h4>Standard Form</h4>
              <p>A complex number is written as: z = a + bi</p>
              <p>where a is the real part, b is the imaginary part, and i = √(-1)</p>
              
              <h4>Operations</h4>
              <ul>
                <li>Addition: (a + bi) + (c + di) = (a + c) + (b + d)i</li>
                <li>Multiplication: (a + bi)(c + di) = (ac - bd) + (ad + bc)i</li>
                <li>Conjugate: The conjugate of a + bi is a - bi</li>
              </ul>
            `,
            examples: [
              {
                problem: "Multiply (3 + 2i)(1 - 4i)",
                solution: "(3 + 2i)(1 - 4i) = 3 - 12i + 2i - 8i² = 3 - 10i + 8 = 11 - 10i"
              }
            ]
          }
        }
      ]
    }
  ]
};

export default function AdvancedMathModule() {
  const router = useRouter();
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");
  
  // Check if user has purchased this module
  const isPurchased = useBoundStore((x) => x.isPurchased("advanced-math"));
  const increaseXp = useBoundStore((x) => x.increaseXp);
  
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  
  // Translation helper
  const t = (en: string, hi: string, te: string) => {
    if (isHindi) return hi;
    if (isTelugu) return te;
    return en;
  };

  // If not purchased, redirect to shop
  if (!isPurchased) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LeftBar selectedTab={null} />
        
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {t("Module Not Purchased", "मॉड्यूल नहीं खरीदा गया", "మాడ్యూల్ కొనుగోలు చేయలేదు")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t(
                "You need to purchase the Advanced Mathematics module to access this content.",
                "इस सामग्री तक पहुंचने के लिए आपको उन्नत गणित मॉड्यूल खरीदना होगा।",
                "ఈ కంటెంట్‌ను యాక్సెస్ చేయడానికి మీరు అడ్వాన్స్‌డ్ మ్యాథమెటిక్స్ మాడ్యూల్‌ను కొనుగోలు చేయాలి."
              )}
            </p>
            <Link
              href={isHindi ? "/hindi/shop" : isTelugu ? "/telugu/shop" : "/shop"}
              className="inline-flex items-center px-6 py-3 bg-[#654321] text-white rounded-lg font-medium hover:bg-[#543619] transition-colors"
            >
              {t("Go to Shop", "दुकान पर जाएं", "దుకాణానికి వెళ్ళండి")}
            </Link>
          </div>
        </main>
        
        <RightBar />
      </div>
    );
  }

  const handleCompleteLesson = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      increaseXp(20); // Award 20 XP for completing a lesson
    }
  };

  const selectedLessonContent = selectedLesson 
    ? moduleContent.chapters
        .flatMap(chapter => chapter.lessons)
        .find(lesson => lesson.id === selectedLesson)
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftBar selectedTab={null} />
      
      <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/purchased-courses"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t("Back to Courses", "कोर्स पर वापस जाएं", "కోర్సులకు తిరిగి వెళ్ళండి")}
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h1 className="text-4xl font-bold text-[#654321] mb-2">{moduleContent.title}</h1>
              <p className="text-gray-600 mb-4">{moduleContent.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {moduleContent.totalLessons} {t("Lessons", "पाठ", "పాఠాలు")}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {moduleContent.estimatedTime}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {moduleContent.difficulty}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {completedLessons.length}/{moduleContent.totalLessons} {t("Completed", "पूर्ण", "పూర్తయింది")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lesson List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {t("Course Content", "कोर्स सामग्री", "కోర్స్ కంటెంట్")}
                </h2>
                
                <div className="space-y-4">
                  {moduleContent.chapters.map(chapter => (
                    <div key={chapter.id}>
                      <h3 className="font-semibold text-gray-700 mb-2">{chapter.title}</h3>
                      <div className="space-y-2 ml-4">
                        {chapter.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedLesson === lesson.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{lesson.title}</div>
                                <div className="text-xs text-gray-500">{lesson.duration}</div>
                              </div>
                              {completedLessons.includes(lesson.id) && (
                                <div className="text-green-500">✓</div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="lg:col-span-2">
              {selectedLessonContent ? (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedLessonContent.title}</h2>
                      <p className="text-gray-600">{selectedLessonContent.duration}</p>
                    </div>
                    {!completedLessons.includes(selectedLesson!) && (
                      <button
                        onClick={() => handleCompleteLesson(selectedLesson!)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        {t("Mark Complete (+20 XP)", "पूर्ण चिह्नित करें (+20 XP)", "పూర్తి చేసినట్లు గుర్తించండి (+20 XP)")}
                      </button>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedLessonContent.content.theory }}
                      className="mb-6"
                    />
                    
                    {selectedLessonContent.content.examples && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {t("Examples", "उदाहरण", "ఉదాహరణలు")}
                        </h3>
                        <div className="space-y-4">
                          {selectedLessonContent.content.examples.map((example, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="font-medium text-gray-800 mb-2">
                                {t("Problem", "समस्या", "సమస్య")}: {example.problem}
                              </div>
                              <div className="text-gray-600">
                                <strong>{t("Solution", "समाधान", "పరిష్కారం")}:</strong> {example.solution}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                  <div className="text-gray-400 text-6xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {t("Select a Lesson", "एक पाठ चुनें", "ఒక పాఠాన్ని ఎంచుకోండి")}
                  </h3>
                  <p className="text-gray-500">
                    {t(
                      "Choose a lesson from the left sidebar to start learning",
                      "सीखना शुरू करने के लिए बाएं साइडबार से एक पाठ चुनें",
                      "నేర్చుకోవడం ప్రారంభించడానికి ఎడమ సైడ్‌బార్ నుండి ఒక పాఠాన్ని ఎంచుకోండి"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <RightBar />
      
      <style jsx>{`
        .math-formula {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 8px 12px;
          margin: 8px 0;
          font-family: 'Courier New', monospace;
          text-align: center;
        }
        
        .prose h3 {
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .prose h4 {
          color: #374151;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .prose li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
}
