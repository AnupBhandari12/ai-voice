"use client";

import { useState } from "react";

import ModeSelector from "../../../components/documents/ModeSelector";
import Recorder from "../../../components/voice/Recorder";
import ExactEditor from "../../../components/documents/ExactEditor";
import CleanEditor from "../../../components/documents/CleanEditor";

export default function NewDocumentPage() {
    const [selectedMode, setSelectedMode] = useState(null);
    const [originalTranscript, setOriginalTranscript] = useState("");
    const [editableText, setEditableText] = useState("");
    const [cleanResult, setCleanResult] = useState(null);
    const [cleanEditableText, setCleanEditableText] = useState("");


    function handleTranscriptReady(rawTranscript) {
        setOriginalTranscript(rawTranscript);

        // Start the editable version with the exact STT output.
        setEditableText(rawTranscript);

        // A new transcript needs a fresh Clean Nepali result.
        setCleanResult(null);
        setCleanEditableText("");
    }

    function handleCleanResult(result) {
        setCleanResult(result);
        setCleanEditableText(result.correctedText);
    }

    return (
        <main className="min-h-screen px-6 py-16">
            <section className="mx-auto max-w-5xl">
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
                </div>
            </section>
        </main>
    );
}