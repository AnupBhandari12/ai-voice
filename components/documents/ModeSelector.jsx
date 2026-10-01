"use client";

// import { useState } from "react";

const modes = [
  {
    id: "exact",
    title: "Exact Dictation",
    description:
      "Convert your Nepali speech into text without rewriting your words.",
  },
  {
    id: "clean",
    title: "Clean Nepali",
    description:
      "Improve spelling, grammar, and punctuation while preserving your facts.",
  },
  {
    id: "ai-document",
    title: "AI Document",
    description:
      "Turn your provided information into applications, letters, notices, and drafts.",
  },
];

export default function ModeSelector({ selectedMode, onModeChange }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            className={`rounded-xl border p-6 text-left transition ${
              isSelected
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h2 className="text-lg font-semibold">{mode.title}</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {mode.description}
            </p>

            {isSelected && (
              <p className="mt-4 text-sm font-medium">Selected ✓</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
