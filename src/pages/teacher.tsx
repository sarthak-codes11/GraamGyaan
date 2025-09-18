import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { units } from "~/utils/units";
import type { UploadItem } from "~/types/uploads";

type Student = {
  id: string;
  name: string;
  xp: number;
  modulesCompleted: number;
  submissions: { assignmentId: string; status: "Submitted" | "Pending"; score: number | null }[];
};

type ClassRoom = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  students: Student[];
};

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  classId: string;
};

const TeacherLanding: NextPage = () => {
  const currentUserName = useBoundStore((s) => s.name) || "You";

  const { classes, assignments } = useMemo(() => {
    const classA: ClassRoom = {
      id: "c-1",
      name: "Class 6A",
      grade: "6",
      subject: "Science",
      students: [
        {
          id: "s-1",
          name: `${currentUserName} (Teacher’s pick)`,
          xp: 175,
          modulesCompleted: 5,
          submissions: [
            { assignmentId: "a-1", status: "Submitted", score: 92 },
            { assignmentId: "a-2", status: "Pending", score: null },
          ],
        },
        { id: "s-2", name: "Sita Devi", xp: 220, modulesCompleted: 6, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 88 }, { assignmentId: "a-2", status: "Submitted", score: 94 } ] },
        { id: "s-3", name: "Raju Kumar", xp: 140, modulesCompleted: 4, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 76 }, { assignmentId: "a-2", status: "Pending", score: null } ] },
        { id: "s-4", name: "Lakshmi", xp: 90, modulesCompleted: 3, submissions: [ { assignmentId: "a-1", status: "Pending", score: null }, { assignmentId: "a-2", status: "Pending", score: null } ] },
      ],
    };
    const classB: ClassRoom = {
      id: "c-2",
      name: "Class 6B",
      grade: "6",
      subject: "Science",
      students: [
        { id: "s-5", name: "Pooja", xp: 255, modulesCompleted: 7, submissions: [ { assignmentId: "a-3", status: "Submitted", score: 96 } ] },
        { id: "s-6", name: "Vikram", xp: 130, modulesCompleted: 4, submissions: [ { assignmentId: "a-3", status: "Pending", score: null } ] },
        { id: "s-7", name: "Asha", xp: 180, modulesCompleted: 5, submissions: [ { assignmentId: "a-3", status: "Submitted", score: 81 } ] },
      ],
    };
    const assignments: Assignment[] = [
      { id: "a-1", title: "Properties of Materials - MCQ", dueDate: "2025-09-25", classId: "c-1" },
      { id: "a-2", title: "Grouping Materials - Worksheet", dueDate: "2025-09-28", classId: "c-1" },
      { id: "a-3", title: "Unit 1 Review - Quiz", dueDate: "2025-09-30", classId: "c-2" },
    ];
    return { classes: [classA, classB], assignments };
  }, [currentUserName]);

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? "");
  const selectedClass = useMemo(() => classes.find((c) => c.id === selectedClassId) ?? classes[0], [classes, selectedClassId]);

  const leaderboard = useMemo(() => {
    return [...(selectedClass?.students ?? [])]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);
  }, [selectedClass]);

  // ====== Upload state & effects ======
  const [notes, setNotes] = useState<UploadItem[]>([]);
  const [videos, setVideos] = useState<UploadItem[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [noteFiles, setNoteFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [noteUnitNumber, setNoteUnitNumber] = useState<number>(units[0]?.unitNumber ?? 1);
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);
  const [videoSuccess, setVideoSuccess] = useState<string | null>(null);
  
  // Quiz state
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizUnitNumber, setQuizUnitNumber] = useState<number>(units[0]?.unitNumber ?? 1);
  const [quizSuccess, setQuizSuccess] = useState<string | null>(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [questions, setQuestions] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[]>([{
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  }]);

  const fetchNotes = async () => {
    const res = await fetch(`/api/manageUploads?type=note`);
    const data = await res.json();
    if (data?.items) setNotes(data.items as UploadItem[]);
  };
  const fetchVideos = async () => {
    const res = await fetch(`/api/manageUploads?type=video`);
    const data = await res.json();
    if (data?.items) setVideos(data.items as UploadItem[]);
  };
  
  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`/api/quizzes`);
      const data = await res.json();
      if (data?.quizzes) setQuizzes(data.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  useEffect(() => {
    void fetchNotes();
    void fetchVideos();
    void fetchQuizzes();
  }, []);

  const uploadNote = async () => {
    if (!noteFiles.length) return;
    const fd = new FormData();
    // Append multiple files under the same field name 'file'
    for (const f of noteFiles) fd.append("file", f);
    fd.append("title", noteTitle || noteFiles[0]!.name);
    if (noteDesc) fd.append("description", noteDesc);
    fd.append("unitNumber", String(noteUnitNumber));
    const res = await fetch("/api/uploadNotes", { method: "POST", body: fd });
    if (res.ok) {
      setNoteFiles([]);
      setNoteTitle("");
      setNoteDesc("");
      setNoteSuccess(`Material uploaded successfully (${noteFiles.length}).`);
      setTimeout(() => setNoteSuccess(null), 3000);
      void fetchNotes();
    }
  };

  const uploadVideo = async () => {
    if (!videoFiles.length) return;
    const fd = new FormData();
    for (const f of videoFiles) fd.append("file", f);
    fd.append("title", videoTitle || videoFiles[0]!.name);
    if (videoDesc) fd.append("description", videoDesc);
    const res = await fetch("/api/uploadVideos", { method: "POST", body: fd });
    if (res.ok) {
      setVideoFiles([]);
      setVideoTitle("");
      setVideoDesc("");
      setVideoSuccess(`Video uploaded successfully (${videoFiles.length}).`);
      setTimeout(() => setVideoSuccess(null), 3000);
      void fetchVideos();
    }
  };

  const deleteItem = async (id: string, type: "note" | "video") => {
    const res = await fetch(`/api/manageUploads?type=${type}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      if (type === "note") void fetchNotes(); else void fetchVideos();
    }
  };

  const saveItem = async (id: string, type: "note" | "video", title: string, description?: string) => {
    const res = await fetch(`/api/manageUploads?type=${type}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, description }),
    });
    if (res.ok) {
      if (type === "note") void fetchNotes(); else void fetchVideos();
    }
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }]);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Update question
  const updateQuestion = (index: number, field: string, value: string | number) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[index];
    if (!currentQuestion) return;
    
    if (field === 'question' || field === 'explanation') {
      updatedQuestions[index] = { ...currentQuestion, [field]: value as string };
    } else if (field === 'correctAnswer') {
      updatedQuestions[index] = { ...currentQuestion, correctAnswer: value as number };
    }
    setQuestions(updatedQuestions);
  };

  // Update option
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[questionIndex];
    if (!currentQuestion) return;
    
    const newOptions = [...currentQuestion.options];
    newOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...currentQuestion, options: newOptions };
    setQuestions(updatedQuestions);
  };

  // Create quiz with custom questions
  const createQuiz = async () => {
    if (!quizTitle.trim()) return;
    
    // Validate questions
    const validQuestions = questions.filter(q => 
      q.question.trim() && 
      q.options.every(opt => opt.trim()) && 
      q.explanation.trim()
    );

    if (validQuestions.length === 0) {
      alert('Please add at least one complete question with all options and explanation.');
      return;
    }

    const formattedQuestions = validQuestions.map((q, index) => ({
      id: `q${index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }));

    const newQuiz = {
      id: `quiz_${Date.now()}`,
      title: quizTitle,
      description: quizDesc,
      unitNumber: quizUnitNumber,
      questions: formattedQuestions,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz)
      });

      if (res.ok) {
        setQuizTitle("");
        setQuizDesc("");
        setQuestions([{
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: ""
        }]);
        setShowQuizForm(false);
        setQuizSuccess(`Quiz created successfully with ${formattedQuestions.length} questions!`);
        setTimeout(() => setQuizSuccess(null), 3000);
        void fetchQuizzes();
      }
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quizzes?id=${encodeURIComponent(quizId)}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        void fetchQuizzes();
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const toggleQuizActive = async (quizId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/quizzes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quizId, isActive })
      });
      if (res.ok) {
        void fetchQuizzes();
      }
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold text-[#5C4033]">Teacher Dashboard (Preview)</h1>
        <p className="mt-2 text-gray-600">
          Welcome, Teacher. This area can host roster management, class progress, assignments, and reports.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">Your Classes</h2>
            <div className="flex flex-col gap-2">
              {classes.map((c) => (
                <button
                  key={c.id}
                  className={[
                    "flex items-center justify-between rounded-xl border-2 border-b-4 px-4 py-3 text-left",
                    selectedClassId === c.id ? "border-[#7B3F00] bg-[#FFF6EE]" : "border-gray-200 bg-white",
                  ].join(" ")}
                  onClick={() => setSelectedClassId(c.id)}
                >
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="text-sm text-gray-600">Grade {c.grade} · {c.subject}</div>
                  </div>
                  <div className="text-sm text-gray-500">{c.students.length} students</div>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">Assignments</h2>
            <div className="flex flex-col gap-2">
              {assignments.map((a) => (
                <div key={a.id} className="rounded-xl border-2 border-gray-200 p-4">
                  <div className="font-bold">{a.title}</div>
                  <div className="text-sm text-gray-600">Due: {a.dueDate} · {classes.find((c) => c.id === a.classId)?.name}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {selectedClass && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-xl font-bold">{selectedClass.name} · Students</h2>
              <div className="flex flex-col gap-2">
                {selectedClass.students.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-3">
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-sm text-gray-600">Modules: {s.modulesCompleted} · XP: {s.xp}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {s.submissions.filter((x) => x.status === "Submitted").length}/{s.submissions.length} submitted
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-xl font-bold">Class Leaderboard</h2>
              <ol className="flex flex-col gap-2">
                {leaderboard.map((s, idx) => (
                  <li key={s.id} className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#7B3F00] text-center font-bold text-white">{idx + 1}</div>
                      <div className="font-bold">{s.name}</div>
                    </div>
                    <div className="text-sm text-gray-700">{s.xp} XP</div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-2xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-6 py-2 font-bold uppercase text-white transition hover:bg-[#5C4033] hover:border-[#5C4033]"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* ====== Upload & Manage Section ====== */}
      <div className="mx-auto max-w-3xl p-6">
        <div className="mt-8 grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
          {/* Upload Notes */}
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">Upload Notes (PDF)</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="rounded-lg border p-2"
              />
              <textarea
                placeholder="Description"
                value={noteDesc}
                onChange={(e) => setNoteDesc(e.target.value)}
                className="rounded-lg border p-2"
                rows={2}
              />
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setNoteFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="rounded-lg border p-2"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Unit:</label>
                <select
                  value={noteUnitNumber}
                  onChange={(e) => setNoteUnitNumber(Number(e.target.value) || 1)}
                  className="rounded-lg border p-2"
                >
                  {units.map((u) => (
                    <option key={u.unitNumber} value={u.unitNumber}>
                      Unit {u.unitNumber}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={uploadNote}
                className="rounded-xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-4 py-2 font-bold text-white hover:bg-[#5C4033]"
                disabled={!noteFiles.length}
              >
                Submit
              </button>
              {noteSuccess && (
                <div className="mt-2 rounded-lg bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm">
                  {noteSuccess}
                </div>
              )}
            </div>
            {/* List notes */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Existing Notes</h3>
              <ul className="flex flex-col gap-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-lg border p-3 flex items-center gap-2">
                    <a href={n.relativePath} target="_blank" rel="noreferrer" className="text-[#7B3F00] font-semibold underline truncate">
                      {n.title}
                    </a>
                    <span className="text-xs text-gray-500 ml-2 truncate">{n.description}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => {
                          const title = prompt("Edit title", n.title) ?? n.title;
                          const description = prompt("Edit description", n.description ?? "") ?? n.description;
                          void saveItem(n.id, "note", title, description ?? undefined);
                        }}
                        className="px-3 py-1 rounded-lg text-sm border"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void deleteItem(n.id, "note")}
                        className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {notes.length === 0 && <li className="text-sm text-gray-500">No notes uploaded yet.</li>}
              </ul>
            </div>
          </section>

          {/* Upload Videos */}
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">Upload Videos</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="rounded-lg border p-2"
              />
              <textarea
                placeholder="Description"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                className="rounded-lg border p-2"
                rows={2}
              />
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => setVideoFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="rounded-lg border p-2"
              />
              <button
                onClick={uploadVideo}
                className="rounded-xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-4 py-2 font-bold text-white hover:bg-[#5C4033]"
                disabled={!videoFiles.length}
              >
                Submit
              </button>
              {videoSuccess && (
                <div className="mt-2 rounded-lg bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm">
                  {videoSuccess}
                </div>
              )}
            </div>
            {/* List videos */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Existing Videos</h3>
              <ul className="flex flex-col gap-2">
                {videos.map((v) => (
                  <li key={v.id} className="rounded-lg border p-3 flex items-center gap-2">
                    <a href={v.relativePath} target="_blank" rel="noreferrer" className="text-[#7B3F00] font-semibold underline truncate">
                      {v.title}
                    </a>
                    <span className="text-xs text-gray-500 ml-2 truncate">{v.description}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => {
                          const title = prompt("Edit title", v.title) ?? v.title;
                          const description = prompt("Edit description", v.description ?? "") ?? v.description;
                          void saveItem(v.id, "video", title, description ?? undefined);
                        }}
                        className="px-3 py-1 rounded-lg text-sm border"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void deleteItem(v.id, "video")}
                        className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {videos.length === 0 && <li className="text-sm text-gray-500">No videos uploaded yet.</li>}
              </ul>
            </div>
          </section>

          {/* Quiz Management */}
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">Quiz Management</h2>
            
            {!showQuizForm ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowQuizForm(true)}
                  className="rounded-xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-4 py-2 font-bold text-white hover:bg-[#5C4033]"
                >
                  Create New Quiz
                </button>
                {quizSuccess && (
                  <div className="mt-2 rounded-lg bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm">
                    {quizSuccess}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Quiz Title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="rounded-lg border p-2"
                  />
                  <textarea
                    placeholder="Quiz Description"
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    className="rounded-lg border p-2"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Unit:</label>
                    <select
                      value={quizUnitNumber}
                      onChange={(e) => setQuizUnitNumber(Number(e.target.value) || 1)}
                      className="rounded-lg border p-2"
                    >
                      {units.map((u) => (
                        <option key={u.unitNumber} value={u.unitNumber}>
                          Unit {u.unitNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Questions Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Questions</h3>
                    <button
                      onClick={addQuestion}
                      className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200"
                    >
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-700">Question {qIndex + 1}</span>
                          {questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="px-2 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <textarea
                            placeholder="Enter your question"
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            className="w-full rounded-lg border p-2"
                            rows={2}
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={question.correctAnswer === oIndex}
                                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                  className="text-green-600"
                                />
                                <input
                                  type="text"
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  className="flex-1 rounded-lg border p-2"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <textarea
                            placeholder="Explanation for the correct answer"
                            value={question.explanation}
                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                            className="w-full rounded-lg border p-2"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={createQuiz}
                    className="flex-1 rounded-xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-4 py-2 font-bold text-white hover:bg-[#5C4033]"
                    disabled={!quizTitle.trim()}
                  >
                    Create Quiz
                  </button>
                  <button
                    onClick={() => {
                      setShowQuizForm(false);
                      setQuizTitle("");
                      setQuizDesc("");
                      setQuestions([{
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: 0,
                        explanation: ""
                      }]);
                    }}
                    className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* List existing quizzes */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Existing Quizzes</h3>
              <ul className="flex flex-col gap-2">
                {quizzes.map((quiz) => (
                  <li key={quiz.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-[#7B3F00]">{quiz.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{quiz.description}</div>
                        <div className="text-xs text-gray-400">
                          Unit {quiz.unitNumber} • {quiz.questions?.length || 0} questions
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            quiz.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <button
                          onClick={() => toggleQuizActive(quiz.id, !quiz.isActive)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            quiz.isActive 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {quiz.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {quizzes.length === 0 && (
                  <li className="text-sm text-gray-500">No quizzes created yet.</li>
                )}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block rounded-2xl border-2 border-b-4 border-[#7B3F00] bg-[#7B3F00] px-6 py-2 font-bold uppercase text-white transition hover:bg-[#5C4033] hover:border-[#5C4033]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default TeacherLanding;



