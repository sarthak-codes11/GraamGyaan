import type { NextPage } from "next";
import Link from "next/link";

const TeacherLanding: NextPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold text-[#5C4033]">Teacher Dashboard (Preview)</h1>
        <p className="mt-2 text-gray-600">
          Welcome, Teacher. This area can host roster management, class progress, assignments, and reports.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-2 text-xl font-bold">Your Classes</h2>
            <p className="text-gray-600">Create and manage classes, invite students, and monitor progress.</p>
          </section>
          <section className="rounded-2xl border-2 border-gray-200 bg-white p-5">
            <h2 className="mb-2 text-xl font-bold">Assignments</h2>
            <p className="text-gray-600">Build practice sets and schedule assessments.</p>
          </section>
        </div>

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



