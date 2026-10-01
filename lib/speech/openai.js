import OpenAI from "openai";

export async function transcribeWithOpenAI({ file }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!file) {
    throw new Error("Audio file is required.");
  }

  // Create the client only on the server.
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-transcribe",
    language : ['ne'],
  });

  return {
    text: transcription.text || "",
    provider: "openai",
  };
}