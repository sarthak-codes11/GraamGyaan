import type { NextPage } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { TopBar } from "~/components/TopBar";

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
  const [subject, setSubject] = useState<string>("All Subjects");
  const [performance, setPerformance] = useState<string>("All Levels");
  const [attendance, setAttendance] = useState<string>("All Students");
  const [search, setSearch] = useState<string>("");
  const selectedClass = useMemo(() => classes.find((c) => c.id === selectedClassId) ?? classes[0], [classes, selectedClassId]);

  const subjects = ["All Subjects", "Mathematics", "Science", "English", "History", "Geography"];

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const filteredStudents = useMemo(() => {
    let list = [...(selectedClass?.students ?? [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    // performance/attendance are placeholders for future server-side filters
    return list;
  }, [selectedClass, search]);

  const leaderboard = useMemo(() => {
    return [...filteredStudents].sort((a, b) => b.xp - a.xp).slice(0, 10);
  }, [filteredStudents]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return filteredStudents.find((s) => s.id === selectedStudentId) ?? null;
  }, [filteredStudents, selectedStudentId]);

  const studentMetrics = useMemo(() => {
    if (!selectedStudent) return null;
    const xp = selectedStudent.xp;
    const modules = selectedStudent.modulesCompleted;
    const totalSubs = selectedStudent.submissions.length || 1;
    const submitted = selectedStudent.submissions.filter((x) => x.status === "Submitted").length;
    const avgScore = Math.round(
      (
        selectedStudent.submissions.reduce((sum, s) => sum + (s.score ?? 0), 0) /
        Math.max(1, submitted)
      ) || 0
    );
    const accuracy = Math.min(100, Math.max(40, avgScore));
    const streakDays = Math.min(30, Math.max(1, Math.floor(xp / 25)));
    const minutes = 10 * modules + Math.floor(xp / 5);
    return { xp, modules, submitted, totalSubs, accuracy, streakDays, minutes };
  }, [selectedStudent]);

  return (
    <div>
      <TopBar />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10">
        <div className="px-4 pb-20 w-full max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2a1 1 0 00-1 1v5.1a3 3 0 001.1 2.34L10 13v6a1 1 0 001 1h2a1 1 0 001-1v-6l2.9-2.56A3 3 0 0018 8.1V3a1 1 0 00-1-1H7z"/></svg>
              <div>
                <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-gray-500">Manage classes, students, and assignments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2 pl-8 text-sm"
                />
                <span className="absolute left-2 top-2">🔍</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <section className="rounded-2xl bg-white/90 shadow-sm p-5">
              <h2 className="mb-3 text-lg font-semibold">Your Classes</h2>
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

            <section className="rounded-2xl bg-white/90 shadow-sm p-5">
              <h2 className="mb-3 text-lg font-semibold">Assignments</h2>
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

          <div className="rounded-2xl bg-white/90 shadow-sm p-5 mb-6">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="border rounded-lg p-2 text-sm">
                {subjects.map((s)=> <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={performance} onChange={(e)=>setPerformance(e.target.value)} className="border rounded-lg p-2 text-sm">
                <option>All Levels</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
              <select value={attendance} onChange={(e)=>setAttendance(e.target.value)} className="border rounded-lg p-2 text-sm">
                <option>All Students</option>
                <option>Present</option>
                <option>Absent</option>
              </select>
              <select value={selectedClassId} onChange={(e)=>setSelectedClassId(e.target.value)} className="border rounded-lg p-2 text-sm">
                {classes.map((c)=> <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {selectedClass && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="rounded-2xl bg-white/90 shadow-sm p-5">
                <h2 className="mb-3 text-lg font-semibold">{selectedClass.name} · Students</h2>
                <div className="flex flex-col gap-2">
                  {filteredStudents.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-3 text-left hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="text-sm text-gray-600">Modules: {s.modulesCompleted} · XP: {s.xp}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {s.submissions.filter((x) => x.status === "Submitted").length}/{s.submissions.length} submitted
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white/90 shadow-sm p-5">
                <h2 className="mb-3 text-lg font-semibold">Class Leaderboard</h2>
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
      </div>
      {selectedStudent && studentMetrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.09 6.26L21 9.27l-5 3.64L17.18 21 12 17.77 6.82 21 8 12.91l-5-3.64 6.91-0.01L12 3z"/></svg>
                <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={()=>setSelectedStudentId("")}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">XP</div>
                <div className="text-xl font-bold">{studentMetrics.xp}</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">Accuracy</div>
                <div className="text-xl font-bold">{studentMetrics.accuracy}%</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">Modules</div>
                <div className="text-xl font-bold">{studentMetrics.modules}</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">Submissions</div>
                <div className="text-xl font-bold">{studentMetrics.submitted}/{studentMetrics.totalSubs}</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">Streak</div>
                <div className="text-xl font-bold">{studentMetrics.streakDays} days</div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-3">
                <div className="text-xs text-gray-500">Time Spent</div>
                <div className="text-xl font-bold">{studentMetrics.minutes} min</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={()=>setSelectedStudentId("")} className="rounded-xl bg-[#7B3F00] text-white px-4 py-2 font-semibold hover:bg-[#5C4033]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLanding;



