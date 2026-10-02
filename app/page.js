import Link from "next/link";

const modes = [
  {
    number: "01",
    title: "Exact Dictation",
    description:
      "Turn your Nepali speech into editable text without rewriting your words.",
    note: "Your words stay unchanged",
  },
  {
    number: "02",
    title: "Clean Nepali",
    description:
      "Improve spelling, grammar and punctuation while keeping your important facts.",
    note: "Better writing, same facts",
  },
  {
    number: "03",
    title: "AI Document",
    description:
      "Use your information to create applications, letters, notices and other useful drafts.",
    note: "Structured document drafting",
  },
];

const steps = [
  {
    number: "1",
    title: "Choose a mode",
    description:
      "Select Exact Dictation, Clean Nepali or AI Document based on what you want to create.",
  },
  {
    number: "2",
    title: "Speak in Nepali",
    description:
      "Record your voice naturally using the microphone on your phone or computer.",
  },
  {
    number: "3",
    title: "Review and export",
    description:
      "Edit the final text, save your document and download it as DOCX or PDF.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      {/* Navigation */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
              N
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-950 sm:text-base">
                Nepali Voice AI Writer
              </p>

              <p className="hidden text-xs text-gray-500 sm:block">
                Voice to trustworthy Nepali
                documents
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#how-it-works"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-950 md:inline-flex"
            >
              How it works
            </a>

            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:px-4"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gray-950 px-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:px-4"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
              Built for Nepali voice workflows
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Speak Nepali.
              <br />
              Create useful digital documents.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Record your voice, convert it into
              Nepali text, clean your writing or
              create structured document drafts
              with AI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/documents/new"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Start Writing
              </Link>

              <a
                href="#modes"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Explore Modes
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
              <span>✓ Nepali voice input</span>
              <span>✓ Editable text</span>
              <span>✓ DOCX & PDF export</span>
            </div>
          </div>

          {/* Product preview */}
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    New Document
                  </p>

                  <p className="mt-1 font-semibold text-gray-950">
                    Choose how you want to write
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                  Ready
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {modes.map((mode) => (
                  <div
                    key={mode.number}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700">
                      {mode.number}
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-gray-950">
                        {mode.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {mode.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-gray-950 p-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-gray-950">
                    🎙
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Ready to record
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Speak naturally in Nepali
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section
        id="modes"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-gray-500">
            Three writing modes
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Choose the workflow that matches
            your task.
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Use simple dictation when you want
            your exact words, Clean Nepali for
            language improvement, or AI Document
            when you need a structured draft.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {modes.map((mode) => (
            <article
              key={mode.number}
              className="flex min-h-64 flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-xs font-bold text-white">
                {mode.number}
              </span>

              <h3 className="mt-6 text-xl font-semibold text-gray-950">
                {mode.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {mode.description}
              </p>

              <p className="mt-auto pt-6 text-xs font-medium text-gray-400">
                {mode.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-gray-100 bg-gray-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-gray-500">
              Simple workflow
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              From voice to document in three
              steps.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-semibold text-gray-950">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / review section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-gray-950 lg:grid-cols-2">
          <div className="p-6 text-white sm:p-8 lg:p-10">
            <p className="text-sm font-semibold text-gray-400">
              You stay in control
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Review before you use the final
              document.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Generated and cleaned text remains
              editable. Review names, numbers,
              dates and other important details
              before saving, printing or
              submitting.
            </p>
          </div>

          <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                <p className="font-semibold">
                  Original transcript
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Keep the source text available
                  for comparison.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                <p className="font-semibold">
                  Reliability warnings
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Review uncertain or potentially
                  changed information.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                <p className="font-semibold">
                  Editable final text
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Make the final decision before
                  saving or exporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Ready to create your first Nepali
            voice document?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Create an account or start writing
            and turn your voice into editable
            digital text.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-xs font-bold text-white">
              N
            </span>

            <p className="text-sm font-semibold text-gray-900">
              Nepali Voice AI Writer
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Speak Nepali. Review your text.
            Create useful documents.
          </p>
        </div>
      </footer>
    </main>
  );
}