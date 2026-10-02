"use client";

const modes = [
  {
    id: "exact",
    number: "01",
    title: "Exact Dictation",
    shortTitle: "Exact",
    description:
      "Convert your Nepali speech into text without rewriting your words.",
    note: "Your words stay unchanged",
  },
  {
    id: "clean",
    number: "02",
    title: "Clean Nepali",
    shortTitle: "Clean",
    description:
      "Improve spelling, grammar, and punctuation while preserving your facts.",
    note: "Better writing, same facts",
  },
  {
    id: "ai-document",
    number: "03",
    title: "AI Document",
    shortTitle: "AI Draft",
    description:
      "Turn your provided information into applications, letters, notices, and drafts.",
    note: "Structured document drafting",
  },
];

export default function ModeSelector({
  selectedMode,
  onModeChange,
}) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3 lg:gap-4">
      {modes.map((mode) => {
        const isSelected =
          selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() =>
              onModeChange(mode.id)
            }
            aria-pressed={isSelected}
            className={`group relative flex min-h-44 w-full flex-col rounded-2xl border p-5 text-left outline-none transition sm:p-6 ${
              isSelected
                ? "border-gray-950 bg-gray-950 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-950 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm"
            } focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2`}
          >
            <div className="flex w-full items-start justify-between gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isSelected
                    ? "bg-white text-gray-950"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {mode.number}
              </div>

              {isSelected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white">
                  Selected
                  <span aria-hidden="true">
                    ✓
                  </span>
                </span>
              ) : (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 transition group-hover:bg-white">
                  {mode.shortTitle}
                </span>
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-base font-semibold sm:text-lg">
                {mode.title}
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${
                  isSelected
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {mode.description}
              </p>
            </div>

            <div
              className={`mt-auto pt-5 text-xs font-medium ${
                isSelected
                  ? "text-gray-300"
                  : "text-gray-400"
              }`}
            >
              {mode.note}
            </div>
          </button>
        );
      })}
    </div>
  );
}