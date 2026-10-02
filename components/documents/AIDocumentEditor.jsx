"use client";

import { useState } from "react";

function formatDocumentType(value) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getReadableValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (!value) {
    return "";
  }

  return (
    value.reason ||
    value.field ||
    value.message ||
    JSON.stringify(value)
  );
}

export default function AIDocumentEditor({
  description,
  onDescriptionChange,
  draft,
  onDraftChange,
  onResult,
}) {
  const [result, setResult] =
    useState(null);

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    resultDescription,
    setResultDescription,
  ] = useState("");

  const isCurrentResult =
    resultDescription === description;

  const wordCount = draft.trim()
    ? draft.trim().split(/\s+/).length
    : 0;

  const characterCount =
    draft.length;

  async function handleGenerate() {
    if (!description.trim()) {
      setError(
        "पहिले document को बारेमा लेख्नुहोस् वा बोल्नुहोस्।",
      );

      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch(
        "/api/documents/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            description,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Document generate गर्न सकिएन.",
        );
      }

      setResult(data);
      setResultDescription(description);

      onResult?.(data);

      onDraftChange(
        data.draft || "",
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-950 px-2.5 py-1 text-xs font-semibold text-white">
                AI
              </span>

              <p className="text-sm font-medium text-gray-500">
                AI Document
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold text-gray-950 sm:text-xl">
              Create a structured document
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Explain what you need in Nepali.
              The AI will identify the document
              type, check the supplied details
              and prepare a draft for review.
            </p>
          </div>

          <span className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
            Draft only
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Description */}
        <section>
          <div>
            <label
              htmlFor="ai-document-description"
              className="text-sm font-semibold text-gray-900"
            >
              Explain what you need
            </label>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Include important details such as
              names, dates, places, reasons and
              other facts you want in the
              document.
            </p>
          </div>

          <textarea
            id="ai-document-description"
            value={description}
            onChange={(event) => {
              onDescriptionChange(
                event.target.value,
              );

              setError("");
            }}
            rows={7}
            placeholder="उदाहरण: मेरो ATM card हराएको छ र replacement card को लागि application लेख्नु छ..."
            className="mt-3 min-h-44 w-full resize-y rounded-2xl border border-gray-300 bg-white p-4 text-base leading-8 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 sm:p-5"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              You can add more information later
              and generate again.
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                !description.trim()
              }
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating
                ? "Generating..."
                : draft
                  ? "Generate Again"
                  : "Generate Draft"}
            </button>
          </div>
        </section>

        {/* Loading */}
        {isGenerating && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />

              <div>
                <p className="text-sm font-medium text-blue-900">
                  Preparing your document
                </p>

                <p className="mt-0.5 text-xs leading-5 text-blue-700">
                  Detecting the document type
                  and checking the information
                  you provided.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {/* Intent result */}
        {isCurrentResult &&
          result?.intent && (
            <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Detected document
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-gray-950">
                    {formatDocumentType(
                      result.intent
                        .documentType,
                    )}
                  </h3>
                </div>

                <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                  नेपाली
                </span>
              </div>

              {/* Missing fields */}
              {result.intent
                .missingFields?.length >
                0 && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="text-sm font-semibold text-amber-900">
                    More information needed
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Add these details to the
                    description and generate
                    again.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.intent.missingFields.map(
                      (field, index) => (
                        <span
                          key={`${field}-${index}`}
                          className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-800"
                        >
                          {formatDocumentType(
                            field,
                          )}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Uncertain fields */}
              {result.intent
                .uncertainFields
                ?.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-amber-900">
                    Please review
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Some information may need
                    your confirmation.
                  </p>

                  <div className="mt-3 space-y-2">
                    {result.intent.uncertainFields.map(
                      (field, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-800"
                        >
                          {getReadableValue(
                            field,
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {result.intent
                .missingFields?.length ===
                0 &&
                !result.intent
                  .uncertainFields
                  ?.length && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-sm font-medium text-green-800">
                      Information looks ready
                      for drafting ✓
                    </p>
                  </div>
                )}
            </section>
          )}

        {/* Validation warnings */}
        {isCurrentResult &&
          result?.validation?.warnings
            ?.length > 0 && (
            <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-amber-900">
                Review these warnings
              </h3>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Check these items before using
                the generated draft.
              </p>

              <div className="mt-3 space-y-2">
                {result.validation.warnings.map(
                  (warning, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm leading-6 text-amber-800"
                    >
                      {getReadableValue(
                        warning,
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

        {/* Generated draft */}
        {draft && (
          <section className="mt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Generated Draft
                  </h3>

                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                    Review required
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Edit the draft before saving,
                  exporting or submitting it.
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
              value={draft}
              onChange={(event) =>
                onDraftChange(
                  event.target.value,
                )
              }
              rows={16}
              className="mt-3 min-h-96 w-full resize-y rounded-2xl border border-gray-300 bg-white p-4 text-base leading-8 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 sm:p-5"
            />

            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs leading-5 text-amber-800">
                Draft — please review before
                saving, printing or submitting
                it to any organization.
              </p>
            </div>
          </section>
        )}

        {/* No draft because info is missing */}
        {isCurrentResult &&
          result?.intent
            ?.missingFields?.length > 0 &&
          !draft && (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center">
              <p className="text-sm font-semibold text-gray-800">
                Add the missing information
                above
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                You can type the details or
                record another voice message,
                then generate the draft again.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}