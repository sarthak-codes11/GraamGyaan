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
        { id: "s-8", name: "Arjun Singh", xp: 160, modulesCompleted: 5, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 84 } ] },
        { id: "s-9", name: "Meera Nair", xp: 200, modulesCompleted: 6, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 91 } ] },
        { id: "s-10", name: "Karan Patel", xp: 115, modulesCompleted: 3, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 72 } ] },
        { id: "s-11", name: "Priya Sharma", xp: 245, modulesCompleted: 7, submissions: [ { assignmentId: "a-1", status: "Submitted", score: 96 } ] },
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
        { id: "s-12", name: "Rohit Verma", xp: 175, modulesCompleted: 5, submissions: [ { assignmentId: "a-3", status: "Submitted", score: 89 } ] },
        { id: "s-13", name: "Sneha Rao", xp: 210, modulesCompleted: 6, submissions: [ { assignmentId: "a-3", status: "Submitted", score: 93 } ] },
        { id: "s-14", name: "Imran Khan", xp: 95, modulesCompleted: 2, submissions: [ { assignmentId: "a-3", status: "Pending", score: null } ] },
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
  const [noteFiles, setNoteFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [noteUnitNumber, setNoteUnitNumber] = useState<number>(units[0]?.unitNumber ?? 1);
  const [noteSuccess, setNoteSuccess] = useState<string | null>(null);
  const [videoSuccess, setVideoSuccess] = useState<string | null>(null);

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

  useEffect(() => {
    void fetchNotes();
    void fetchVideos();
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

  // Modal state for student details
  const [modalStudent, setModalStudent] = useState<Student | null>(null);

  const getAccuracy = (s: Student): number => {
    const scores = s.submissions.map(x => x.score).filter((x): x is number => typeof x === "number");
    if (scores.length === 0) return 0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Profile Header */}
        <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/60 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-100/60 blur-2xl" />
          <div className="relative flex items-center gap-4 sm:gap-6">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold shadow-lg sm:h-20 sm:w-20">
              AS
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-900">Aarav Sharma</h1>
              <p className="text-sm sm:text-base text-emerald-700/80">Science Teacher · Class 6</p>
            </div>
            <div className="ml-auto hidden sm:flex gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 text-sm">2 Classes</div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-amber-700 text-sm">3 Assignments</div>
            </div>
          </div>
        </section>

        <p className="mt-6 text-gray-700">
          Welcome, Teacher. Manage classes, track progress, assign work, and upload notes & videos for students.
        </p>

        {/* Recent Uploads */}
        <section className="mt-6 rounded-2xl border-2 border-purple-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-purple-900">Recent Uploads</h2>
            <span className="text-xs text-gray-500">Latest notes and videos</span>
          </div>
          {(() => {
            const recent = [...notes, ...videos]
              .slice()
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
              .slice(0, 6);
            if (recent.length === 0) {
              return <div className="text-sm text-gray-500">No uploads yet. Upload your first note or video below.</div>;
            }
            return (
              <ul className="flex flex-col gap-2">
                {recent.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-3">
                    <div className={["grid h-8 w-8 place-items-center rounded-lg text-white text-xs font-bold", item.type === "note" ? "bg-purple-600" : "bg-fuchsia-600"].join(" ")}>{item.type === "note" ? "PDF" : "VID"}</div>
                    <div className="flex min-w-0 flex-col">
                      <div className="truncate font-semibold text-purple-900">{item.title}</div>
                      <div className="text-xs text-purple-800/70 truncate">
                        {item.unitNumber ? `Unit ${item.unitNumber} · ` : ""}{new Date(item.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <a
                        href={item.relativePath}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-purple-200 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => {
                          const title = prompt("Edit title", item.title) ?? item.title;
                          const description = prompt("Edit description", item.description ?? "") ?? item.description;
                          void saveItem(item.id, item.type, title, description ?? undefined);
                        }}
                        className="rounded-lg border border-purple-200 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void deleteItem(item.id, item.type)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-700 border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            );
          })()}
        </section>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-xl font-bold">{selectedClass.name} · Students</h2>
              <div className="flex flex-col gap-2">
                {selectedClass.students.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-3 hover:bg-emerald-50/60 cursor-pointer"
                    onClick={() => setModalStudent(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setModalStudent(s); }}
                  >
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

        {/* Spacer before upload/manage */}
        <div className="mt-2" />
      </div>

      {/* ====== Upload & Manage Section ====== */}
      <div className="mx-auto max-w-6xl p-6">
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

      {/* Student Detail Modal */}
      {modalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalStudent(null)}>
          <div
            className="w-full max-w-md rounded-2xl border-2 border-emerald-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white text-lg font-bold">
                {modalStudent.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-extrabold text-emerald-900">{modalStudent.name}</div>
                <div className="text-xs text-emerald-700/80">Class {selectedClass?.name} · Science</div>
              </div>
              <button className="ml-auto text-gray-500 hover:text-gray-700" onClick={() => setModalStudent(null)}>✕</button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <div className="text-xs text-gray-500">Accuracy</div>
                <div className="text-xl font-bold text-gray-800">{getAccuracy(modalStudent)}%</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <div className="text-xs text-gray-500">Modules</div>
                <div className="text-xl font-bold text-gray-800">{modalStudent.modulesCompleted}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <div className="text-xs text-gray-500">XP</div>
                <div className="text-xl font-bold text-gray-800">{modalStudent.xp}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Recent Scores</div>
              <ul className="text-sm text-gray-700 list-disc pl-5 max-h-40 overflow-auto">
                {modalStudent.submissions.map((sub) => (
                  <li key={sub.assignmentId}>
                    {sub.assignmentId}: {sub.status} {typeof sub.score === 'number' ? `· ${sub.score}%` : ''}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700" onClick={() => setModalStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeacherLanding;
