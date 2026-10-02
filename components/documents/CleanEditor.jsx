"use client";

import { useState } from "react";

export default function CleanEditor({
  originalTranscript,
  cleanResult,
  onCleanResult,
  editableText,
  onEditableTextChange,
}) {
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState(
    cleanResult ? "cleaned" : "original",
  );

  const hasHighRiskWarning =
    cleanResult?.reliabilityWarnings?.some(
      (warning) => warning.severity === "high",
    ) ?? false;

  async function handleCleanNepali() {
    if (!originalTranscript?.trim()) return;

    try {
      setError("");
      setReviewConfirmed(false);
      setIsCleaning(true);

      const response = await fetch("/api/clean-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: originalTranscript,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Clean Nepali failed.");
      }

      onCleanResult({
        correctedText: data.correctedText || "",
        uncertainSpans: data.uncertainSpans || [],
        notes: data.notes || [],
        isSafe: data.isSafe ?? true,
        reliabilityWarnings: data.reliabilityWarnings || [],
      });

      setCopied(false);
      setActiveTab("cleaned");
    } catch (error) {
      console.error("Clean Nepali request failed:", error);

      setError(error.message || "Clean Nepali could not be completed.");
    } finally {
      setIsCleaning(false);
    }
  }

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
    setReviewConfirmed(false);
  }
  return (
    <section className="mt-8 rounded-xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">Clean Nepali</p>

      <h2 className="mt-1 text-xl font-semibold">Review your cleaned text</h2>

      <p className="mt-2 text-sm text-gray-600">
        Language can be corrected, but your facts must remain unchanged.
      </p>

      <button
        type="button"
        onClick={handleCleanNepali}
        disabled={isCleaning}
        className="mt-5 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-40"
      >
        {isCleaning ? "Cleaning..." : "Clean Nepali"}
      </button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("original")}
          className={`rounded-lg px-4 py-2 text-sm ${
            activeTab === "original"
              ? "bg-black text-white"
              : "border border-gray-300"
          }`}
        >
          Original
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cleaned")}
          disabled={!cleanResult}
          className={`rounded-lg px-4 py-2 text-sm disabled:opacity-40 ${
            activeTab === "cleaned"
              ? "bg-black text-white"
              : "border border-gray-300"
          }`}
        >
          Cleaned
        </button>
      </div>

      {activeTab === "original" ? (
        <div className="mt-5 rounded-lg bg-gray-50 p-4 leading-7">
          {originalTranscript}
        </div>
      ) : (
        <div className="mt-5">
          {activeTab === "cleaned" &&
            cleanResult?.isSafe === false &&
            cleanResult?.reliabilityWarnings?.length > 0 && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-medium text-red-700">
                  Possible factual change detected
                </p>

                <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                  {cleanResult.reliabilityWarnings.map((warning, index) => (
                    <li key={`${warning.code}-${warning.value}-${index}`}>
                      <span className="font-semibold uppercase">
                        {warning.severity || "medium"}:
                      </span>{" "}
                      {warning.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {activeTab === "cleaned" &&
            cleanResult?.isSafe === false &&
            hasHighRiskWarning && (
              <label className="mb-4 flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={reviewConfirmed}
                  onChange={(event) => setReviewConfirmed(event.target.checked)}
                  className="mt-1"
                />

                <span>I reviewed the factual changes shown above.</span>
              </label>
            )}

          {activeTab === "cleaned" &&
            cleanResult?.isSafe === false &&
            hasHighRiskWarning &&
            reviewConfirmed && (
              <p className="mb-4 text-sm font-medium text-green-700">
                Reviewed by user ✓
              </p>
            )}
          <label
            htmlFor="clean-editor"
            className="mb-2 block text-sm font-medium"
          >
            Editable Cleaned Text
          </label>

          <textarea
            id="clean-editor"
            value={editableText}
            onChange={handleTextChange}
            rows={8}
            className="w-full rounded-lg border border-gray-300 p-4 leading-7 outline-none focus:border-black"
          />

          <button
            type="button"
            onClick={handleCopy}
            disabled={!editableText || (hasHighRiskWarning && !reviewConfirmed)}
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-40"
          >
            {copied ? "Copied ✓" : "Copy Cleaned Text"}
          </button>
        </div>
      )}
      {activeTab === "cleaned" && cleanResult?.uncertainSpans?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">Needs review</p>

          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
            {cleanResult.uncertainSpans.map((span, index) => (
              <li key={`${span}-${index}`}>{span}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "cleaned" && cleanResult?.notes?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">Notes</p>

          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
            {cleanResult.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
