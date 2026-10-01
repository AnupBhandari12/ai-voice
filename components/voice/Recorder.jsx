"use client";

import { useEffect, useRef, useState } from "react";
import RecordingTimer from "./RecordingTimer.jsx";

const MAX_RECORDING_SECONDS = 300; // 5 minutes

const AUDIO_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
export default function Recorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Release the microphone immediately when recording finishes.
  function releaseMicrophone() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  // Clear recording timers so they do not continue running in the background.
  function clearRecordingTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  // Pick the first audio format supported by the current browser.
  function getSupportedMimeType() {
    return (
      AUDIO_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || ""
    );
  }

  async function startRecording() {
    if (isRecording) return;
    try {
      setError("");
      setTranscript("");
      setAudioBlob(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Your browser does not support microphone recording.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = getSupportedMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearRecordingTimers();
        const audioBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });

        // Do not continue if recording produced no usable audio.
        if (audioBlob.size === 0) {
          setError("No audio was recorded. Please try again.");
          releaseMicrophone();
          setIsRecording(false);
          return;
        }

        // Create a temporary browser URL so we can test the recorded audio.
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));

        releaseMicrophone();
        setIsRecording(false);
      };

      recorder.start();
      setSeconds(0);
      setIsRecording(true);

      // Update the visible timer every second.
      intervalRef.current = setInterval(() => {
        setSeconds((current) => current + 1);
      }, 1000);

      // Hard stop after 5 minutes.
      timeoutRef.current = setTimeout(() => {
        const activeRecorder = mediaRecorderRef.current;

        if (activeRecorder?.state === "recording") {
          activeRecorder.stop();
        }
      }, MAX_RECORDING_SECONDS * 1000);
    } catch (error) {
      console.error("Microphone error:", error);
      clearRecordingTimers();
      releaseMicrophone();
      setIsRecording(false);
      setError("Microphone permission denied or microphone unavailable.");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
  }

  async function transcribeRecording() {
    if (!audioBlob) {
      setError("Please record audio before transcription.");
      return;
    }

    try {
      setError("");
      setIsTranscribing(true);

      const formData = new FormData();

      // Give the Blob a real filename so the server/provider knows the format.
      const extension = audioBlob.type.includes("mp4") ? "mp4" : "webm";

      formData.append("audio", audioBlob, `recording.${extension}`);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Transcription failed.");
      }

      setTranscript(data.transcript || "");
    } catch (error) {
      console.error("Transcription request failed:", error);

      setError(error.message || "Transcription could not be completed.");
    } finally {
      setIsTranscribing(false);
    }
  }

  // Safety cleanup if the user leaves the page while recording.
  useEffect(() => {
    return () => {
      clearRecordingTimers();
      releaseMicrophone();
    };
  }, []);

  return (
    <section className="rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold">Voice Recording</h2>

      <p className="mt-2 text-sm text-gray-600">
        Record a short Nepali voice sample to test microphone capture.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={startRecording}
          disabled={isRecording}
          className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-40"
        >
          Start Recording
        </button>

        <button
          type="button"
          onClick={stopRecording}
          disabled={!isRecording}
          className="rounded-lg border border-gray-300 px-5 py-2.5 disabled:opacity-40"
        >
          Stop
        </button>
      </div>

      {isRecording && (
        <div className="mt-4">
          <RecordingTimer seconds={seconds} />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {audioUrl && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Recorded audio</p>

          <audio controls src={audioUrl} />
        </div>
      )}

      {audioBlob && (
        <button
          type="button"
          onClick={transcribeRecording}
          disabled={isTranscribing}
          className="mt-5 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-40"
        >
          {isTranscribing ? "Transcribing..." : "Transcribe Nepali"}
        </button>
      )}

      {transcript && (
        <div className="mt-6 rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Raw Transcript</p>

          <p className="mt-3 whitespace-pre-wrap leading-7">{transcript}</p>
        </div>
      )}
    </section>
  );
}
