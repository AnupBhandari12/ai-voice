"use client";

import { useState } from "react";

export default function ExactEditor({
  originalTranscript,
  editableText,
  onEditableTextChange,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!editableText) return;

    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function handleTextChange(event) {
    onEditableTextChange(event.target.value);
    setCopied(false);
  }

  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <div>
        <p className="text-sm font-medium text-gray-500">
          Exact Dictation
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          Review and edit your text
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          You can edit this copy. Your original transcript remains unchanged.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-gray-600">
          Original Transcript
        </p>

        <div className="rounded-lg bg-gray-50 p-4 leading-7">
          {originalTranscript}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="exact-editor"
          className="mb-2 block text-sm font-medium"
        >
          Editable Text
        </label>

        <textarea
          id="exact-editor"
          value={editableText}
          onChange={handleTextChange}
          rows={8}
          className="w-full rounded-lg border border-gray-300 p-4 leading-7 outline-none focus:border-black"
        />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!editableText}
        className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-40"
      >
        {copied ? "Copied ✓" : "Copy Text"}
      </button>
    </section>
  );
}