import { transcribeWithGoogle } from "./google";
import { transcribeWithOpenAI } from "./openai";

// Keep the UI/API independent from a specific speech provider.
export async function transcribeAudio(input) {
  const provider = process.env.SPEECH_PROVIDER || "openai";

  if (provider === "openai") {
    return transcribeWithOpenAI(input);
  }

  return transcribeWithGoogle(input);
}