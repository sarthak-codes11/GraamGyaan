import type { NextPage } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";

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
    </main>
  );
};

export default TeacherLanding;



