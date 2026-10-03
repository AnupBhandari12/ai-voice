import Link from "next/link";

export const metadata = {
  title: "You are Offline",
  description:
    "Internet connection is required for Nepali voice transcription and AI document generation.",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-2xl font-bold text-white">
          B
        </div>

        <p className="mt-6 text-sm font-semibold text-gray-500">
          Nepali Voice AI Writer
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          You&apos;re offline
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
          An internet connection is required for
          Nepali speech transcription, AI
          cleanup and AI document generation.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-sm font-semibold text-gray-900">
            When your connection returns
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Open the app again and continue
            creating, editing, saving and
            exporting your documents.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
        >
          Try Again
        </Link>

        <p className="mt-6 text-xs leading-5 text-gray-400">
          Installed PWA does not mean the AI
          features work fully offline.
        </p>
      </section>
    </main>
  );
}