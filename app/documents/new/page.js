"use client";

import { useEffect, useState } from "react";

import ModeSelector from "@/components/documents/ModeSelector";
import Recorder from "@/components/voice/Recorder";
import ExactEditor from "@/components/documents/ExactEditor";
import CleanEditor from "@/components/documents/CleanEditor";
import AuthStatus from "@/components/auth/AuthStatus";
import AIDocumentEditor from "@/components/documents/AIDocumentEditor";

export default function NewDocumentPage() {
    const [selectedMode, setSelectedMode] = useState(null);
    const [originalTranscript, setOriginalTranscript] = useState("");
    const [editableText, setEditableText] = useState("");
    const [aiDescription, setAiDescription] = useState("");
    const [aiDraft, setAiDraft] = useState("");
    const [aiGeneratedText, setAiGeneratedText] = useState("");
    const [aiDocumentType, setAiDocumentType] = useState("");
    const [cleanResult, setCleanResult] = useState(null);
    const [cleanEditableText, setCleanEditableText] = useState("");

    const [title, setTitle] = useState("");
    const [documentId, setDocumentId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);

    function handleTranscriptReady(rawTranscript) {
        setOriginalTranscript(rawTranscript);

        // Start the editable version with the exact STT output.
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

        // A new transcript needs a fresh Clean Nepali result.
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
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (!id) {
            return;
        }

        async function loadDocument() {
            setIsLoadingDocument(true);
            setSaveMessage("");

            try {
                const response = await fetch(`/api/documents/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error?.message || "Document load failed.",
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
            setSaveMessage("Save गर्न text उपलब्ध छैन।");
            return;
        }

        setIsSaving(true);
        setSaveMessage("");

        try {
            const isUpdate = Boolean(documentId);

            const body = isUpdate
                ? {
                    title: title.trim() || "Untitled Document",
                    finalText,

                    ...(selectedMode === "clean" && {
                        correctedText: cleanEditableText,
                    }),

                    ...(selectedMode === "ai-document" && {
                        originalTranscript: aiDescription,
                        generatedText: aiGeneratedText,
                        documentType: aiDocumentType,
                    }),
                }
                : {
                    title: title.trim() || "Untitled Document",
                    mode: selectedMode,
                    originalTranscript: sourceText,
                    finalText,

                    ...(selectedMode === "clean" && {
                        correctedText: cleanEditableText,
                    }),

                    ...(selectedMode === "ai-document" && {
                        generatedText: aiGeneratedText,
                        documentType: aiDocumentType,
                    }),
                };
            const response = await fetch(
                isUpdate
                    ? `/api/documents/${documentId}`
                    : "/api/documents",
                {
                    method: isUpdate ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error?.message || "Document save failed.",
                );
            }

            setDocumentId(data.document.id);

            window.history.replaceState(
                {},
                "",
                `/documents/new?id=${data.document.id}`,
            );

            setSaveMessage(
                isUpdate ? "Document updated." : "Document saved.",
            );
        } catch (error) {
            setSaveMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="min-h-screen px-6 py-16">
            <section className="mx-auto max-w-5xl">
                <div className="mb-8 flex justify-end">
                    <AuthStatus />
                </div>
                <p className="text-sm font-medium text-gray-500">
                    New Document
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Choose how you want to write
                </h1>

                <p className="mt-3 max-w-2xl text-gray-600">
                    Select the mode that matches what you want to create.
                </p>

                <ModeSelector
                    selectedMode={selectedMode}
                    onModeChange={setSelectedMode}
                />

                <div className="mt-12">
                    <Recorder onTranscriptReady={handleTranscriptReady} />
                    {selectedMode === "exact" && (
                        <ExactEditor
                            originalTranscript={originalTranscript}
                            editableText={editableText}
                            onEditableTextChange={setEditableText}
                        />
                    )}
                    {selectedMode === "clean" && originalTranscript && (
                        <CleanEditor
                            originalTranscript={originalTranscript}
                            cleanResult={cleanResult}
                            onCleanResult={handleCleanResult}
                            editableText={cleanEditableText}
                            onEditableTextChange={setCleanEditableText}
                        />
                    )}
                    {selectedMode === "ai-document" && (
                        <AIDocumentEditor
                            description={aiDescription}
                            onDescriptionChange={setAiDescription}
                            draft={aiDraft}
                            onDraftChange={setAiDraft}
                            onResult={(result) => {
                                setAiGeneratedText(result.draft || "");
                                setAiDocumentType(
                                    result.intent?.documentType || "",
                                );
                            }}
                        />
                    )}
                    {selectedMode &&
                        (originalTranscript ||
                            (selectedMode === "ai-document" && aiDescription)) && (
                            <div className="mt-8 rounded-xl border border-gray-200 p-5">
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
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="Untitled Document"
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                                />

                                <button
                                    type="button"
                                    onClick={handleSaveDocument}
                                    disabled={isSaving || isLoadingDocument}
                                    className="mt-4 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                                >
                                    {isLoadingDocument
                                        ? "Loading..."
                                        : isSaving
                                            ? "Saving..."
                                            : documentId
                                                ? "Update Document"
                                                : "Save Document"}
                                </button>

                                {saveMessage && (
                                    <p className="mt-3 text-sm text-gray-600">
                                        {saveMessage}
                                    </p>
                                )}
                            </div>
                        )}
                </div>
            </section>
        </main>
    );
}