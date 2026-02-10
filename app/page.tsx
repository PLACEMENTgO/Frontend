"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl rounded-xl bg-white p-12 shadow-sm dark:bg-zinc-900">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          AI Resume Builder
        </h1>

        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Upload your resume, parse real content, and generate job-specific
          resume using AI.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-lg bg-black px-6 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Login
          </Link>

          <Link
            href="/upload"
            className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-6 text-black transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Upload Resume
          </Link>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          <p>✔ Real resume parsing (PDF / DOCX)</p>
          <p>✔ Secure authentication (JWT)</p>
          <p>✔ AI-generated job-tailored resume</p>
        </div>
      </main>
    </div>
  );
}
