"use client";

import { useState } from "react";

export default function ExactEditor({
  originalTranscript,
  editableText,
  onEditableTextChange,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!editableText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        editableText,
      );

      setCopied(true);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  function handleTextChange(event) {
    onEditableTextChange(
      event.target.value,
    );

    setCopied(false);
  }

  const wordCount = editableText.trim()
    ? editableText.trim().split(/\s+/).length
    : 0;

  const characterCount =
    editableText.length;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                Exact
              </span>

              <p className="text-sm font-medium text-gray-500">
                Exact Dictation
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-gray-950 sm:text-xl">
              Review and edit your text
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Your speech is kept as-is.
              You can edit the working copy
              without changing the original
              transcript.
            </p>
          </div>

          <span className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
            Original preserved
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Original transcript */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Original Transcript
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                This is the raw transcript from
                your recording.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              Read only
            </span>
          </div>

          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            {originalTranscript ? (
              <p className="whitespace-pre-wrap wrap-break-word text-base leading-8 text-gray-800">
                {originalTranscript}
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                No transcript yet.
              </p>
            )}
          </div>
        </section>

        {/* Editable copy */}
        <section className="mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <label
                htmlFor="exact-editor"
                className="text-sm font-semibold text-gray-900"
              >
                Editable Text
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Make any corrections you need
                before saving or exporting.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>
                {wordCount}{" "}
                {wordCount === 1
                  ? "word"
                  : "words"}
              </span>

              <span aria-hidden="true">
                •
              </span>

              <span>
                {characterCount} characters
              </span>
            </div>
          </div>

          <textarea
            id="exact-editor"
            value={editableText}
            onChange={handleTextChange}
            rows={10}
            placeholder="Your editable transcript will appear here..."
            className="mt-3 min-h-64 w-full resize-y rounded-2xl border border-gray-300 bg-white p-4 text-base leading-8 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 sm:p-5"
          />
        </section>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500">
            Copy the edited version when you
            want to use it somewhere else.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!editableText}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              copied
                ? "border border-green-200 bg-green-50 text-green-700"
                : "bg-gray-950 text-white hover:bg-gray-800"
            }`}
          >
            {copied
              ? "Copied ✓"
              : "Copy Text"}
          </button>
        </div>
      </div>
    </section>
  );
}