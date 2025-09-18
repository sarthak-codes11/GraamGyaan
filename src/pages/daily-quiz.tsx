import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useBoundStore } from "~/hooks/useBoundStore";
import { LeftBar } from "~/components/LeftBar";
import RightBar from "~/components/RightBar";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  unitNumber: number;
  questions: QuizQuestion[];
  createdAt: string;
  isActive: boolean;
}

export default function DailyQuiz() {
  const router = useRouter();
  const isHindi = router.pathname.startsWith("/hindi");
  const isTelugu = router.pathname.startsWith("/telugu");
  
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | undefined)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const increaseXp = useBoundStore((x) => x.increaseXp);
  
  // Translation helper
  const t = (en: string, hi: string, te: string) => {
    if (isHindi) return hi;
    if (isTelugu) return te;
    return en;
  };

  // Fetch available quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        console.log('Fetching quizzes from /api/quizzes...'); // Debug log
        const res = await fetch('/api/quizzes');
        console.log('Response status:', res.status); // Debug log
        const data = await res.json();
        console.log('Raw API response:', data); // Debug log
        
        if (data?.quizzes) {
          console.log('Total quizzes found:', data.quizzes.length); // Debug log
          console.log('All quizzes:', data.quizzes); // Debug log
          
          // Filter only active quizzes
          const activeQuizzes = data.quizzes.filter((quiz: Quiz) => {
            console.log(`Quiz "${quiz.title}" - isActive: ${quiz.isActive}`); // Debug log
            return quiz.isActive;
          });
          console.log('Active quizzes count:', activeQuizzes.length); // Debug log
          console.log('Active quizzes:', activeQuizzes); // Debug log
          setAvailableQuizzes(activeQuizzes);
        } else {
          console.log('No quizzes property in response or data is null'); // Debug log
          setAvailableQuizzes([]);
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        setAvailableQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers(new Array(selectedQuiz.questions.length).fill(-1));
      setShowResults(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return; // Early return if no quiz selected
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      setShowResults(true);
      
      // Calculate score and award XP
      const correctAnswers = selectedAnswers.filter((answer, index) => 
        selectedQuiz.questions[index] && answer === selectedQuiz.questions[index].correctAnswer
      ).length;
      
      const xpReward = correctAnswers * 10; // 10 XP per correct answer
      if (xpReward > 0) {
        increaseXp(xpReward);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LeftBar selectedTab={null} />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("Loading Quiz...", "क्विज़ लोड हो रहा है...", "క్విజ్ లోడ్ అవుతోంది...")}
            </h1>
          </div>
        </main>
        <RightBar />
      </div>
    );
  }

  if (availableQuizzes.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LeftBar selectedTab={null} />
        <main className="flex-1 p-6 md:ml-64">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="text-8xl mb-6">📝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {t("No Quiz Available", "कोई क्विज़ उपलब्ध नहीं", "ఎలాంటి క్విజ్ అందుబాటులో లేదు")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t(
                "Your teacher hasn't created any quizzes yet. Check back later!",
                "आपके शिक्षक ने अभी तक कोई क्विज़ नहीं बनाया है। बाद में वापस आएं!",
                "మీ టీచర్ ఇంకా ఎలాంటి క్విజ్ సృష్టించలేదు. తర్వాత తిరిగి చూడండి!"
              )}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🔄 {t("Refresh", "रीफ्रेश करें", "రిఫ్రెష్ చేయండి")}
              </button>
              <Link
                href={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"}
                className="inline-flex items-center px-6 py-3 bg-[#654321] text-white rounded-lg font-medium hover:bg-[#543619] transition-colors"
              >
                {t("Back to Learning", "सीखने पर वापस जाएं", "నేర్చుకోవడానికి తిరిగి వెళ్ళండి")}
              </Link>
            </div>
            
            {/* Debug info for development */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Loading: {loading.toString()}</p>
              <p>Available Quizzes: {availableQuizzes.length}</p>
              <p>Check browser console for detailed logs</p>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/quizzes');
                    const data = await res.json();
                    alert(`API Response: ${JSON.stringify(data, null, 2)}`);
                  } catch (error) {
                    alert(`API Error: ${error}`);
                  }
                }}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Test API Directly
              </button>
            </div>
          </div>
        </main>
        <RightBar />
      </div>
    );
  }

  return (
    <>
      {/* Animated Background */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background: linear-gradient(270deg, #654321, #8B5A2B, #A0522D, #CD853F);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 -z-50 animate-gradient opacity-20" />
      
      <div className="flex min-h-screen bg-gradient-to-br from-white via-orange-50 to-amber-50">
        <LeftBar selectedTab={null} />
        
        <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← {t("Back to Learning", "सीखने पर वापस जाएं", "నేర్చుకోవడానికి తిరిగి వెళ్ళండి")}
              </Link>
            </div>
            
            <h1 className="text-4xl font-bold text-[#654321] mb-2">
              {t("Daily Quiz", "दैनिक क्विज़", "దైనందిన క్విజ్")} 🧠
            </h1>
            <p className="text-gray-600">
              {t(
                "Test your knowledge and earn XP by answering questions correctly!",
                "सही उत्तर देकर अपने ज्ञान का परीक्षण करें और XP अर्जित करें!",
                "సరైన సమాధానాలు ఇవ్వడం ద్వారా మీ జ్ఞానాన్ని పరీక్షించుకోండి మరియు XP సంపాదించండి!"
              )}
            </p>
          </div>

          {/* Quiz Selection Screen */}
          {!selectedQuiz && availableQuizzes.length > 0 && (
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("Choose a Quiz", "एक क्विज़ चुनें", "ఒక క్విజ్ ఎంచుకోండి")}
                </h2>
                <p className="text-gray-600">
                  {t(
                    "Select any quiz created by your teacher to start learning!",
                    "सीखना शुरू करने के लिए अपने शिक्षक द्वारा बनाया गया कोई भी क्विज़ चुनें!",
                    "నేర్చుకోవడం ప్రారంభించడానికి మీ టీచర్ సృష్టించిన ఏదైనా క్విజ్ ఎంచుకోండి!"
                  )}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    onClick={() => setSelectedQuiz(quiz)}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#654321] hover:bg-[#FFF8F0] cursor-pointer transition-all group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">🎯</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-[#654321]">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {quiz.questions.length} {t("Questions", "प्रश्न", "ప్రశ్నలు")}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {t("Unit", "इकाई", "యూనిట్")} {quiz.unitNumber}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {quiz.questions.length * 10} XP {t("max", "अधिकतम", "గరిష్ఠం")}
                        </span>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        {t("Created", "बनाया गया", "సృష్టించబడింది")}: {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!quizStarted && !showResults && selectedQuiz && (
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedQuiz.title}</h2>
                <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>
                
                <div className="flex justify-center gap-6 mb-8 text-sm">
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    {selectedQuiz.questions.length} {t("Questions", "प्रश्न", "ప్రశ్నలు")}
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    {t("Unit", "इकाई", "యూనిట్")} {selectedQuiz.unitNumber}
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                    10 XP {t("per correct answer", "प्रति सही उत्तर", "ప్రతి సరైన సమాధానానికి")}
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    {t("← Back to Quizzes", "← क्विज़ पर वापस", "← క్విజ్‌లకు తిరిగి")}
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="bg-[#654321] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#543619] transition-colors"
                  >
                    {t("Start Quiz", "क्विज़ शुरू करें", "క్విజ్ ప్రారంభించండి")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {quizStarted && !showResults && selectedQuiz && selectedQuiz.questions[currentQuestionIndex] && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
              <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col gap-6 border border-gray-200">
                {/* Header with progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {t("Question", "प्रश्न", "ప్రశ్న")} {currentQuestionIndex + 1} {t("of", "का", "లో")} {selectedQuiz.questions.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedQuiz.title}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setSelectedQuiz(null);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers([]);
                    }}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t("Quit", "छोड़ें", "వదిలేయండి")}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#654321] to-[#8B5A2B] h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                  />
                </div>
                
                {/* Question */}
                <h2 className="text-2xl font-bold text-gray-800 text-center leading-relaxed">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h2>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 gap-4">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === index;
                    
                    return (
                      <label key={index} className="cursor-pointer">
                        <div
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                            isSelected
                              ? "border-[#654321] bg-[#FFF8F0] shadow-lg scale-[1.02]"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="quiz-answer"
                              value={index}
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(index)}
                              className="w-5 h-5 text-[#654321] bg-gray-100 border-gray-300 focus:ring-[#654321] focus:ring-2"
                            />
                            <span className={`font-bold text-lg ${isSelected ? 'text-[#654321]' : 'text-gray-600'}`}>
                              {String.fromCharCode(65 + index)})
                            </span>
                            <span className={`text-lg ${isSelected ? 'text-[#654321] font-medium' : 'text-gray-700'}`}>
                              {option}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← {t("Previous", "पिछला", "మునుపటి")}
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined || selectedAnswers[currentQuestionIndex] === -1}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#654321] to-[#8B5A2B] text-white font-bold hover:from-[#543619] hover:to-[#6B4423] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                  >
                    {currentQuestionIndex === selectedQuiz.questions.length - 1 
                      ? t("Finish Quiz", "क्विज़ समाप्त करें", "క్విజ్ పూర్తి చేయండి")
                      : t("Next", "अगला", "తదుపరి") + " →"
                    }
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResults && selectedQuiz && (
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("Quiz Completed!", "क्विज़ पूर्ण!", "క్విజ్ పూర్తయింది!")}
                </h2>
                
                {(() => {
                  if (!selectedQuiz) return null;
                  
                  const correctAnswers = selectedAnswers.filter((answer, index) => 
                    answer !== undefined && 
                    answer !== -1 && 
                    selectedQuiz.questions[index] && 
                    answer === selectedQuiz.questions[index].correctAnswer
                  ).length;
                  const totalQuestions = selectedQuiz.questions.length;
                  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
                  const xpEarned = correctAnswers * 10;
                  
                  return (
                    <>
                      <div className="mb-6">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {correctAnswers}/{totalQuestions}
                        </div>
                        <div className="text-lg text-gray-600 mb-4">
                          {percentage}% {t("Correct", "सही", "సరైనది")}
                        </div>
                        {xpEarned > 0 && (
                          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full inline-block">
                            +{xpEarned} XP {t("Earned!", "अर्जित!", "సంపాదించారు!")}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4 mb-8 text-left">
                        <h3 className="text-lg font-semibold text-center mb-4">
                          {t("Review Answers", "उत्तरों की समीक्षा", "సమాధానాల సమీక్ష")}
                        </h3>
                        {selectedQuiz.questions.map((question, index) => {
                          const userAnswer = selectedAnswers[index];
                          const isCorrect = userAnswer !== undefined && userAnswer !== -1 && userAnswer === question.correctAnswer;
                          
                          return (
                            <div key={question.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-2 mb-2">
                                <span className={`text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {isCorrect ? '✅' : '❌'}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium mb-2">{question.question}</div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    <strong>{t("Your answer:", "आपका उत्तर:", "మీ సమాధానం:")}</strong> {userAnswer !== undefined && userAnswer !== -1 ? question.options[userAnswer] : t("No answer selected", "कोई उत्तर नहीं चुना गया", "ఎటువంటి సమాధానం ఎంచుకోలేదు")}
                                  </div>
                                  {!isCorrect && (
                                    <div className="text-sm text-green-600 mb-2">
                                      <strong>{t("Correct answer:", "सही उत्तर:", "సరైన సమాధానం:")}</strong> {question.options[question.correctAnswer]}
                                    </div>
                                  )}
                                  <div className="text-sm text-gray-500">
                                    {question.explanation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
                
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    {t("Take Again", "फिर से लें", "మళ్ళీ తీసుకోండి")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuiz(null);
                      setShowResults(false);
                      setQuizStarted(false);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers([]);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t("Try Another Quiz", "दूसरा क्विज़ करें", "మరొక క్విజ్ ప్రయత్నించండి")}
                  </button>
                  <Link
                    href={isHindi ? "/hindi" : isTelugu ? "/telugu" : "/learn"}
                    className="px-6 py-3 bg-[#654321] text-white rounded-lg font-medium hover:bg-[#543619] transition-colors"
                  >
                    {t("Back to Learning", "सीखने पर वापस जाएं", "నేర్చుకోవడానికి తిరిగి వెళ్ళండి")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <RightBar />
      </div>
    </>
  );
}
