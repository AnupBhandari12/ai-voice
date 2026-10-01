import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold">
          Nepali Voice AI Writer
        </h1>

        <p className="mt-4 text-gray-600">
          Speak in Nepali, convert your voice into text, edit it,
          and create useful documents.
        </p>

        {/* Main entry point for creating a new document */}
        <Link
          href="/documents/new"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Create New Document
        </Link>
      </section>
    </main>
  );
}