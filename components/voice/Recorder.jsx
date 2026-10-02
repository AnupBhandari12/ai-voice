"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import RecordingTimer from "./RecordingTimer.jsx";

const MAX_RECORDING_SECONDS = 300;

const AUDIO_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

export default function Recorder({
  onTranscriptReady,
}) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const [audioBlob, setAudioBlob] =
    useState(null);

  const [transcript, setTranscript] =
    useState("");

  const [
    isTranscribing,
    setIsTranscribing,
  ] = useState(false);

  const recordingProgress = Math.min(
    (seconds / MAX_RECORDING_SECONDS) * 100,
    100,
  );

  function releaseMicrophone() {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  }

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

  function getSupportedMimeType() {
    return (
      AUDIO_MIME_TYPES.find((type) =>
        MediaRecorder.isTypeSupported(type),
      ) || ""
    );
  }

  async function startRecording() {
    if (isRecording) {
      return;
    }

    try {
      setError("");
      setTranscript("");
      setAudioBlob(null);

      onTranscriptReady?.("");

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(
          "Your browser does not support microphone recording.",
        );

        return;
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          },
        );

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType =
        getSupportedMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (
        event,
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onstop = () => {
        clearRecordingTimers();

        const recordedBlob = new Blob(
          chunksRef.current,
          {
            type: recorder.mimeType,
          },
        );

        if (recordedBlob.size === 0) {
          setError(
            "No audio was recorded. Please try again.",
          );

          releaseMicrophone();
          setIsRecording(false);

          return;
        }

        const nextAudioUrl =
          URL.createObjectURL(
            recordedBlob,
          );

        setAudioBlob(recordedBlob);
        setAudioUrl(nextAudioUrl);

        releaseMicrophone();
        setIsRecording(false);
      };

      recorder.start();

      setSeconds(0);
      setIsRecording(true);

      intervalRef.current =
        setInterval(() => {
          setSeconds(
            (current) => current + 1,
          );
        }, 1000);

      timeoutRef.current =
        setTimeout(() => {
          const activeRecorder =
            mediaRecorderRef.current;

          if (
            activeRecorder?.state ===
            "recording"
          ) {
            activeRecorder.stop();
          }
        }, MAX_RECORDING_SECONDS * 1000);
    } catch (error) {
      console.error(
        "Microphone error:",
        error,
      );

      clearRecordingTimers();
      releaseMicrophone();

      setIsRecording(false);

      setError(
        "Microphone permission denied or microphone unavailable.",
      );
    }
  }

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state === "recording"
    ) {
      recorder.stop();
    }
  }

  async function transcribeRecording() {
    if (!audioBlob) {
      setError(
        "Please record audio before transcription.",
      );

      return;
    }

    try {
      setError("");
      setIsTranscribing(true);

      const formData = new FormData();

      const extension =
        audioBlob.type.includes("mp4")
          ? "mp4"
          : "webm";

      formData.append(
        "audio",
        audioBlob,
        `recording.${extension}`,
      );

      const response = await fetch(
        "/api/transcribe",
        {
          method: "POST",
          body: formData,
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Transcription failed.",
        );
      }

      const rawTranscript =
        data.transcript || "";

      setTranscript(rawTranscript);

      onTranscriptReady?.(
        rawTranscript,
      );
    } catch (error) {
      console.error(
        "Transcription request failed:",
        error,
      );

      setError(
        error.message ||
          "Transcription could not be completed.",
      );
    } finally {
      setIsTranscribing(false);
    }
  }

  useEffect(() => {
    return () => {
      clearRecordingTimers();
      releaseMicrophone();
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Recording status header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h3 className="font-semibold text-gray-950">
            Record your voice
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Speak naturally in Nepali for up
            to 5 minutes.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isRecording
              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
              : audioBlob
                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isRecording
                ? "animate-pulse bg-red-500"
                : audioBlob
                  ? "bg-green-500"
                  : "bg-gray-400"
            }`}
          />

          {isRecording
            ? "Recording"
            : audioBlob
              ? "Recording ready"
              : "Ready"}
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Main recorder area */}
        <div
          className={`rounded-2xl border p-5 transition sm:p-6 ${
            isRecording
              ? "border-red-200 bg-red-50/50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl shadow-sm ${
                  isRecording
                    ? "bg-red-600 text-white"
                    : "bg-gray-950 text-white"
                }`}
                aria-hidden="true"
              >
                🎙
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-gray-950">
                  {isRecording
                    ? "Listening..."
                    : audioBlob
                      ? "Recording complete"
                      : "Ready to record"}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {isRecording
                    ? "Speak clearly. Your microphone is active."
                    : audioBlob
                      ? "Preview your audio or transcribe it into Nepali text."
                      : "Press Start Recording and allow microphone access."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <button
                type="button"
                onClick={startRecording}
                disabled={
                  isRecording ||
                  isTranscribing
                }
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {audioBlob
                  ? "Record Again"
                  : "Start Recording"}
              </button>

              <button
                type="button"
                onClick={stopRecording}
                disabled={!isRecording}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Stop Recording
              </button>
            </div>
          </div>

          {/* Timer */}
          {isRecording && (
            <div className="mt-6 rounded-xl border border-red-100 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                    Recording time
                  </p>

                  <div className="mt-1 text-gray-950">
                    <RecordingTimer
                      seconds={seconds}
                    />
                  </div>
                </div>

                <p className="text-xs font-medium text-gray-500">
                  Max 05:00
                </p>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{
                    width: `${recordingProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        {/* Audio preview */}
        {audioUrl && (
          <section className="mt-5 rounded-2xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-gray-900">
                Recorded audio
              </h4>

              <p className="text-xs text-gray-500">
                Listen before sending the
                recording for transcription.
              </p>
            </div>

            <audio
              controls
              src={audioUrl}
              className="mt-4 w-full"
            />

            {audioBlob && (
              <button
                type="button"
                onClick={
                  transcribeRecording
                }
                disabled={
                  isTranscribing ||
                  isRecording
                }
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {isTranscribing
                  ? "Transcribing..."
                  : "Transcribe Nepali"}
              </button>
            )}
          </section>
        )}

        {/* Processing state */}
        {isTranscribing && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />

              <div>
                <p className="text-sm font-medium text-blue-900">
                  Transcribing your recording
                </p>

                <p className="mt-0.5 text-xs text-blue-700">
                  Please wait while your Nepali
                  speech is converted to text.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <section className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Raw Transcript
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Speech-to-text result from your
                  recording.
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
                Transcribed
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <p className="whitespace-pre-wrap wrap-break-word text-base leading-8 text-gray-800">
                {transcript}
              </p>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}