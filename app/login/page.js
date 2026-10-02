"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Login failed.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-md">
        <p className="text-sm font-medium text-gray-500">
          Nepali Voice AI Writer
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome back
        </h1>

        <p className="mt-3 text-gray-600">
          Login to access your saved documents.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-xl border border-gray-200 p-6"
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline"
          >
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}