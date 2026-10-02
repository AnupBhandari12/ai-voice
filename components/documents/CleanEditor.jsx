"use client";

import { useState } from "react";

export default function CleanEditor({
  originalTranscript,
  cleanResult,
  onCleanResult,
  editableText,
  onEditableTextChange,
}) {
  const [isCleaning, setIsCleaning] =
    useState(false);

  const [error, setError] = useState("");

  const [copied, setCopied] =
    useState(false);

  const [
    reviewConfirmed,
    setReviewConfirmed,
  ] = useState(false);

  const [activeTab, setActiveTab] =
    useState(
      cleanResult ? "cleaned" : "original",
    );

  const hasHighRiskWarning =
    cleanResult?.reliabilityWarnings?.some(
      (warning) =>
        warning.severity === "high",
    ) ?? false;

  const wordCount = editableText.trim()
    ? editableText.trim().split(/\s+/).length
    : 0;

  const characterCount =
    editableText.length;

  async function handleCleanNepali() {
    if (!originalTranscript?.trim()) {
      return;
    }

    try {
      setError("");
      setReviewConfirmed(false);
      setIsCleaning(true);

      const response = await fetch(
        "/api/clean-text",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transcript:
              originalTranscript,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Clean Nepali failed.",
        );
      }

      onCleanResult({
        correctedText:
          data.correctedText || "",

        uncertainSpans:
          data.uncertainSpans || [],

        notes: data.notes || [],

        isSafe:
          data.isSafe ?? true,

        reliabilityWarnings:
          data.reliabilityWarnings || [],
      });

      setCopied(false);
      setActiveTab("cleaned");
    } catch (error) {
      console.error(
        "Clean Nepali request failed:",
        error,
      );

      setError(
        error.message ||
          "Clean Nepali could not be completed.",
      );
    } finally {
      setIsCleaning(false);
    }
  }

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
      console.error(
        "Copy failed:",
        error,
      );
    }
  }

  function handleTextChange(event) {
    onEditableTextChange(
      event.target.value,
    );

    setCopied(false);
    setReviewConfirmed(false);
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                Clean
              </span>

              <p className="text-sm font-medium text-gray-500">
                Clean Nepali
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-gray-950 sm:text-xl">
              Improve your Nepali text
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Improve spelling, grammar and
              punctuation while preserving the
              facts from your original
              transcript.
            </p>
          </div>

          {cleanResult && (
            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                cleanResult.isSafe
                  ? "bg-green-50 text-green-700 ring-green-200"
                  : "bg-amber-50 text-amber-700 ring-amber-200"
              }`}
            >
              {cleanResult.isSafe
                ? "Reliability check passed"
                : "Review required"}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Clean action */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Clean this transcript
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                The cleaner can improve the
                language, but it should not
                change names, numbers, dates or
                other important facts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCleanNepali}
              disabled={
                isCleaning ||
                !originalTranscript?.trim()
              }
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCleaning
                ? "Cleaning..."
                : cleanResult
                  ? "Clean Again"
                  : "Clean Nepali"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {isCleaning && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />

              <div>
                <p className="text-sm font-medium text-blue-900">
                  Cleaning your Nepali text
                </p>

                <p className="mt-0.5 text-xs text-blue-700">
                  Checking language while
                  preserving important facts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 overflow-x-auto">
          <div className="inline-flex min-w-full rounded-xl bg-gray-100 p-1 sm:min-w-0">
            <button
              type="button"
              onClick={() =>
                setActiveTab("original")
              }
              className={`min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition sm:min-w-32 ${
                activeTab === "original"
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Original
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("cleaned")
              }
              disabled={!cleanResult}
              className={`min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-32 ${
                activeTab === "cleaned"
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Cleaned
            </button>
          </div>
        </div>

        {/* Original tab */}
        {activeTab === "original" && (
          <section className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Original Transcript
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Raw speech-to-text result.
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
        )}

        {/* Cleaned tab */}
        {activeTab === "cleaned" &&
          cleanResult && (
            <section className="mt-5">
              {/* Reliability warning */}
              {cleanResult.isSafe === false &&
                cleanResult
                  .reliabilityWarnings
                  ?.length > 0 && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700"
                        aria-hidden="true"
                      >
                        !
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-red-800">
                          Possible factual change
                          detected
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-red-700">
                          Review these items before
                          using the cleaned text.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {cleanResult.reliabilityWarnings.map(
                        (
                          warning,
                          index,
                        ) => (
                          <div
                            key={`${warning.code}-${warning.value}-${index}`}
                            className="rounded-xl border border-red-200 bg-white/70 px-3 py-3 text-sm text-red-800"
                          >
                            <span className="font-semibold uppercase">
                              {warning.severity ||
                                "medium"}
                              :
                            </span>{" "}
                            {warning.message}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Confirmation */}
              {cleanResult.isSafe === false &&
                hasHighRiskWarning && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={
                          reviewConfirmed
                        }
                        onChange={(event) =>
                          setReviewConfirmed(
                            event.target
                              .checked,
                          )
                        }
                        className="mt-1 h-4 w-4 shrink-0"
                      />

                      <span>
                        <span className="block text-sm font-semibold text-amber-900">
                          Confirm factual review
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-amber-800">
                          I reviewed the factual
                          changes shown above.
                        </span>
                      </span>
                    </label>
                  </div>
                )}

              {cleanResult.isSafe === false &&
                hasHighRiskWarning &&
                reviewConfirmed && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    Reviewed by user ✓
                  </div>
                )}

              {/* Editor */}
              <div className="mt-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <label
                      htmlFor="clean-editor"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Editable Cleaned Text
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      Review and edit the final
                      cleaned version before
                      saving.
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
                  id="clean-editor"
                  value={editableText}
                  onChange={handleTextChange}
                  rows={10}
                  placeholder="Your cleaned Nepali text will appear here..."
                  className="mt-3 min-h-64 w-full resize-y rounded-2xl border border-gray-300 bg-white p-4 text-base leading-8 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 sm:p-5"
                />
              </div>

              {/* Uncertain spans */}
              {cleanResult.uncertainSpans
                ?.length > 0 && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Needs review
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    These parts may need your
                    confirmation.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {cleanResult.uncertainSpans.map(
                      (span, index) => (
                        <span
                          key={`${span}-${index}`}
                          className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-amber-800"
                        >
                          {span}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {cleanResult.notes?.length >
                0 && (
                <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notes
                  </h3>

                  <div className="mt-3 space-y-2">
                    {cleanResult.notes.map(
                      (note, index) => (
                        <div
                          key={`${note}-${index}`}
                          className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm leading-6 text-gray-600"
                        >
                          {note}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Copy */}
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-gray-500">
                  {hasHighRiskWarning &&
                  !reviewConfirmed
                    ? "Review the high-risk factual warning before copying this text."
                    : "Copy the reviewed cleaned text when you are ready."}
                </p>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={
                    !editableText ||
                    (hasHighRiskWarning &&
                      !reviewConfirmed)
                  }
                  className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    copied
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "bg-gray-950 text-white hover:bg-gray-800"
                  }`}
                >
                  {copied
                    ? "Copied ✓"
                    : "Copy Cleaned Text"}
                </button>
              </div>
            </section>
          )}
      </div>
    </section>
  );
}