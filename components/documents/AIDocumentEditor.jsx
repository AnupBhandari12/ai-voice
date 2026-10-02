"use client";

import { useState } from "react";

export default function AIDocumentEditor({
  description,
  onDescriptionChange,
  draft,
  onDraftChange,
  onResult,
}) {
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [resultDescription, setResultDescription] = useState("");

  async function handleGenerate() {
    if (!description.trim()) {
      setError("पहिले document को बारेमा लेख्नुहोस् वा बोल्नुहोस्।");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Document generate गर्न सकिएन.");
      }

      setResult(data);
      setResultDescription(description);
      onResult?.(data);

      if (data.draft) {
        onDraftChange(data.draft);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div>
        <label className="mb-2 block font-medium">Explain what you need</label>

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={6}
          placeholder="उदाहरण: मेरो ATM card हराएको छ र replacement card को लागि application लेख्नु छ..."
          className="w-full rounded-lg border border-gray-300 p-3"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {isGenerating ? "Processing..." : "Generate Draft"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {resultDescription === description && result?.intent && (
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm">
            <span className="font-medium">Detected:</span>{" "}
            {result.intent.documentType}
          </p>

          {result.intent.missingFields.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium">Missing information:</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {result.intent.missingFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs"
                  >
                    {field}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Missing information माथिको description मा थपेर फेरि Generate
                Draft गर्नुहोस्।
              </p>
            </div>
          )}
          {result.intent.uncertainFields?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-amber-700">
                Please review:
              </p>

              <div className="mt-2 space-y-2">
                {result.intent.uncertainFields.map((field, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm"
                  >
                    {typeof field === "string"
                      ? field
                      : field.reason || field.field || JSON.stringify(field)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {draft && (
        <div>
          <label className="mb-2 block font-medium">Generated Draft</label>

          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          <p className="mt-2 text-xs text-gray-500">
            Draft — please review before saving or submitting.
          </p>
        </div>
      )}

      {resultDescription === description &&
  result?.validation?.warnings?.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="font-medium">Please review these warnings:</p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {result.validation.warnings.map((warning, index) => (
              <li key={index}>
                {typeof warning === "string"
                  ? warning
                  : JSON.stringify(warning)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
