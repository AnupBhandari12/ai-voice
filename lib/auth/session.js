import crypto from "node:crypto";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashSessionToken(token) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");
}

export function getSessionExpiryDate() {
  return new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000,
  );
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "nvai_session";