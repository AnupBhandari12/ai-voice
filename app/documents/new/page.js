"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import ModeSelector from "@/components/documents/ModeSelector";
import Recorder from "@/components/voice/Recorder";
import ExactEditor from "@/components/documents/ExactEditor";
import CleanEditor from "@/components/documents/CleanEditor";
import AIDocumentEditor from "@/components/documents/AIDocumentEditor";

function getModeLabel(mode) {
  const labels = {
    EXACT: "Exact Dictation",
    CLEAN: "Clean Nepali",
    AI_DOCUMENT: "AI Document",
    exact: "Exact Dictation",
    clean: "Clean Nepali",
    "ai-document": "AI Document",
  };

  return labels[mode] || mode || "Document";
}

function getSafeExportTitle(title) {
  const cleaned = (title.trim() || "nepali-document")
    .replace(/[\/\\:*?"<>|]/g, "-")
    .slice(0, 80);

  return cleaned || "nepali-document";
}

export default function NewDocumentPage() {
  const [selectedMode, setSelectedMode] = useState(null);

  const [originalTranscript, setOriginalTranscript] =
    useState("");

  const [editableText, setEditableText] = useState("");

  const [aiDescription, setAiDescription] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [aiGeneratedText, setAiGeneratedText] =
    useState("");
  const [aiDocumentType, setAiDocumentType] =
    useState("");

  const [cleanResult, setCleanResult] = useState(null);

  const [cleanEditableText, setCleanEditableText] =
    useState("");

  const [title, setTitle] = useState("");
  const [documentId, setDocumentId] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [isExportingDocx, setIsExportingDocx] =
    useState(false);

  const [isExportingPdf, setIsExportingPdf] =
    useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const [isLoadingDocument, setIsLoadingDocument] =
    useState(false);

  const [recentDocuments, setRecentDocuments] =
    useState([]);

  function handleTranscriptReady(rawTranscript) {
    setOriginalTranscript(rawTranscript);

    setEditableText(rawTranscript);

    if (selectedMode === "ai-document") {
      setAiDescription((previousDescription) => {
        const previous = previousDescription.trim();

        if (!previous) {
          return rawTranscript;
        }

        return `${previous}\n${rawTranscript}`;
      });

      setAiDraft("");
      setAiGeneratedText("");
    }

    setCleanResult(null);
    setCleanEditableText("");
    setDocumentId(null);
    setSaveMessage("");
  }

  function handleCleanResult(result) {
    setCleanResult(result);
    setCleanEditableText(result.correctedText);
  }

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const id = params.get("id");

    if (!id) {
      return;
    }

    async function loadDocument() {
      setIsLoadingDocument(true);
      setSaveMessage("");

      try {
        const response = await fetch(
          `/api/documents/${id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message ||
              "Document load failed.",
          );
        }

        const document = data.document;

        const modeMap = {
          EXACT: "exact",
          CLEAN: "clean",
          AI_DOCUMENT: "ai-document",
        };

        setDocumentId(document.id);

        setTitle(document.title || "");

        setSelectedMode(modeMap[document.mode]);

        setOriginalTranscript(
          document.originalTranscript || "",
        );

        setEditableText(
          document.finalText ||
            document.originalTranscript ||
            "",
        );

        if (document.mode === "CLEAN") {
          setCleanEditableText(
            document.finalText ||
              document.correctedText ||
              "",
          );
        }

        if (document.mode === "AI_DOCUMENT") {
          setAiDescription(
            document.originalTranscript || "",
          );

          setAiGeneratedText(
            document.generatedText || "",
          );

          setAiDraft(
            document.finalText ||
              document.generatedText ||
              "",
          );

          setAiDocumentType(
            document.documentType || "",
          );
        }

        setSaveMessage("Document loaded.");
      } catch (error) {
        setSaveMessage(error.message);
      } finally {
        setIsLoadingDocument(false);
      }
    }

    loadDocument();
  }, []);

  useEffect(() => {
    async function loadRecentDocuments() {
      try {
        const response = await fetch(
          "/api/documents",
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setRecentDocuments(
          (data.documents || []).slice(0, 6),
        );
      } catch {
        setRecentDocuments([]);
      }
    }

    loadRecentDocuments();
  }, []);

  async function handleSaveDocument() {
    const finalText =
      selectedMode === "clean"
        ? cleanEditableText
        : selectedMode === "ai-document"
          ? aiDraft
          : editableText;

    const sourceText =
      selectedMode === "ai-document"
        ? aiDescription
        : originalTranscript;

    if (
      !selectedMode ||
      !sourceText.trim() ||
      !finalText.trim()
    ) {
      setSaveMessage(
        "Save गर्न text उपलब्ध छैन।",
      );

      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const isUpdate = Boolean(documentId);

      const body = isUpdate
        ? {
            title:
              title.trim() ||
              "Untitled Document",

            finalText,

            ...(selectedMode === "clean" && {
              correctedText: cleanEditableText,
            }),

            ...(selectedMode ===
              "ai-document" && {
              originalTranscript: aiDescription,
              generatedText: aiGeneratedText,
              documentType: aiDocumentType,
            }),
          }
        : {
            title:
              title.trim() ||
              "Untitled Document",

            mode: selectedMode,

            originalTranscript: sourceText,

            finalText,

            ...(selectedMode === "clean" && {
              correctedText: cleanEditableText,
            }),

            ...(selectedMode ===
              "ai-document" && {
              generatedText: aiGeneratedText,
              documentType: aiDocumentType,
            }),
          };

      const response = await fetch(
        isUpdate
          ? `/api/documents/${documentId}`
          : "/api/documents",
        {
          method: isUpdate
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Document save failed.",
        );
      }

      setDocumentId(data.document.id);

      setTitle(
        data.document.title ||
          title ||
          "Untitled Document",
      );

      window.history.replaceState(
        {},
        "",
        `/documents/new?id=${data.document.id}`,
      );

      setRecentDocuments(
        (previousDocuments) => {
          const otherDocuments =
            previousDocuments.filter(
              (document) =>
                document.id !== data.document.id,
            );

          return [
            data.document,
            ...otherDocuments,
          ].slice(0, 6);
        },
      );

      setSaveMessage(
        isUpdate
          ? "Document updated."
          : "Document saved.",
      );
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDownloadDocx() {
    const finalText =
      selectedMode === "clean"
        ? cleanEditableText
        : selectedMode === "ai-document"
          ? aiDraft
          : editableText;

    if (!finalText.trim()) {
      setSaveMessage(
        "Export गर्न text उपलब्ध छैन।",
      );

      return;
    }

    setIsExportingDocx(true);
    setSaveMessage("");

    try {
      const response = await fetch(
        "/api/export/docx",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              title.trim() ||
              "Nepali Document",

            finalText,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error?.message ||
            "DOCX export failed.",
        );
      }

      const blob = await response.blob();

      const url =
        URL.createObjectURL(blob);

      const safeTitle =
        getSafeExportTitle(title);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${safeTitle}.docx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      setSaveMessage(
        "DOCX downloaded.",
      );
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setIsExportingDocx(false);
    }
  }

  async function handleDownloadPdf() {
    const finalText =
      selectedMode === "clean"
        ? cleanEditableText
        : selectedMode === "ai-document"
          ? aiDraft
          : editableText;

    if (!finalText.trim()) {
      setSaveMessage(
        "Export गर्न text उपलब्ध छैन।",
      );

      return;
    }

    setIsExportingPdf(true);
    setSaveMessage("");

    try {
      const response = await fetch(
        "/api/export/pdf",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              title.trim() ||
              "Nepali Document",

            finalText,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error?.message ||
            "PDF export failed.",
        );
      }

      const blob = await response.blob();

      const url =
        URL.createObjectURL(blob);

      const safeTitle =
        getSafeExportTitle(title);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${safeTitle}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      setSaveMessage(
        "PDF downloaded.",
      );
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setIsExportingPdf(false);
    }
  }

  const successMessages = [
    "Document loaded.",
    "Document saved.",
    "Document updated.",
    "DOCX downloaded.",
    "PDF downloaded.",
  ];

  const isSuccessMessage =
    successMessages.includes(saveMessage);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AppHeader
          showBack
          title="Nepali Voice AI Writer"
          subtitle="Create, edit and export Nepali documents"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Recent documents */}
          <aside className="order-2 min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:order-1 lg:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Documents
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Quickly continue your work
                </p>
              </div>

              <Link
                href="/dashboard"
                className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-black"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {recentDocuments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm font-medium text-gray-700">
                    No documents yet
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your recently saved documents
                    will appear here.
                  </p>
                </div>
              ) : (
                recentDocuments.map(
                  (document) => (
                    <a
                      key={document.id}
                      href={`/documents/new?id=${document.id}`}
                      className={`group block min-w-0 rounded-xl border p-3 transition ${
                        documentId ===
                        document.id
                          ? "border-gray-900 bg-gray-100"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {document.title ||
                              "Untitled Document"}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {getModeLabel(
                              document.mode,
                            )}
                          </p>
                        </div>

                        {documentId ===
                          document.id && (
                          <span className="shrink-0 rounded-full bg-gray-900 px-2 py-1 text-[10px] font-medium text-white">
                            Open
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xs font-medium text-gray-400 transition group-hover:text-gray-700">
                        Open document →
                      </p>
                    </a>
                  ),
                )
              )}
            </div>

            <a
              href="/documents/new"
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:border-gray-500 hover:bg-gray-50"
            >
              + New Document
            </a>
          </aside>

          {/* Main workspace */}
          <section className="order-1 min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm lg:order-2">
            <div className="border-b border-gray-100 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-500">
                      {documentId
                        ? "Document Workspace"
                        : "New Document"}
                    </p>

                    {documentId && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                        Saved document
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    {documentId
                      ? title ||
                        "Edit your document"
                      : "Choose how you want to write"}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                    {documentId
                      ? "Continue editing, recording or exporting your document."
                      : "Select a writing mode, speak naturally in Nepali, then review and save your document."}
                  </p>
                </div>

                {selectedMode && (
                  <div className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                    {getModeLabel(selectedMode)}
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <section>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Writing mode
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose the type of output you
                    want.
                  </p>
                </div>

                <ModeSelector
                  selectedMode={selectedMode}
                  onModeChange={setSelectedMode}
                />
              </section>

              <div className="my-7 border-t border-gray-100 sm:my-8" />

              <section>
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Voice recording
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Record your Nepali voice and
                    continue editing below.
                  </p>
                </div>

                <Recorder
                  onTranscriptReady={
                    handleTranscriptReady
                  }
                />
              </section>

              <div className="mt-6 sm:mt-8">
                {selectedMode === "exact" && (
                  <ExactEditor
                    originalTranscript={
                      originalTranscript
                    }
                    editableText={editableText}
                    onEditableTextChange={
                      setEditableText
                    }
                  />
                )}

                {selectedMode === "clean" &&
                  originalTranscript && (
                    <CleanEditor
                      originalTranscript={
                        originalTranscript
                      }
                      cleanResult={cleanResult}
                      onCleanResult={
                        handleCleanResult
                      }
                      editableText={
                        cleanEditableText
                      }
                      onEditableTextChange={
                        setCleanEditableText
                      }
                    />
                  )}

                {selectedMode ===
                  "ai-document" && (
                  <AIDocumentEditor
                    description={aiDescription}
                    onDescriptionChange={
                      setAiDescription
                    }
                    draft={aiDraft}
                    onDraftChange={setAiDraft}
                    onResult={(result) => {
                      setAiGeneratedText(
                        result.draft || "",
                      );

                      setAiDocumentType(
                        result.intent
                          ?.documentType || "",
                      );
                    }}
                  />
                )}
              </div>

              {selectedMode &&
                (originalTranscript ||
                  (selectedMode ===
                    "ai-document" &&
                    aiDescription)) && (
                  <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 lg:p-6">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        Save & Export
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Give your document a name,
                        save it, or download a
                        copy.
                      </p>
                    </div>

                    <div className="mt-5">
                      <label
                        htmlFor="document-title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Document title
                      </label>

                      <input
                        id="document-title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                          setTitle(
                            event.target.value,
                          )
                        }
                        placeholder="Untitled Document"
                        className="mt-2 min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={
                          handleSaveDocument
                        }
                        disabled={
                          isSaving ||
                          isLoadingDocument
                        }
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-44"
                      >
                        {isLoadingDocument
                          ? "Loading..."
                          : isSaving
                            ? "Saving..."
                            : documentId
                              ? "Update Document"
                              : "Save Document"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleDownloadDocx
                        }
                        disabled={
                          isExportingDocx
                        }
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40"
                      >
                        {isExportingDocx
                          ? "Exporting..."
                          : "Download DOCX"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleDownloadPdf
                        }
                        disabled={
                          isExportingPdf
                        }
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40"
                      >
                        {isExportingPdf
                          ? "Exporting..."
                          : "Download PDF"}
                      </button>
                    </div>

                    {saveMessage && (
                      <div
                        className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                          isSuccessMessage
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        }`}
                      >
                        {saveMessage}
                      </div>
                    )}
                  </section>
                )}

              {!selectedMode && (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Choose a writing mode to get
                    started.
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Exact Dictation, Clean Nepali
                    or AI Document.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}