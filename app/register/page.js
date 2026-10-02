"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            "Registration failed.",
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:min-h-180 lg:grid-cols-[1fr_1fr]">
          {/* Brand side */}
          <section className="relative hidden overflow-hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-950">
                  N
                </span>

                Nepali Voice AI Writer
              </Link>
            </div>

            <div className="max-w-lg">
              <p className="text-sm font-medium text-gray-400">
                Create your workspace
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Speak Nepali and turn your
                ideas into useful documents.
              </h1>

              <p className="mt-5 text-base leading-7 text-gray-300">
                Create an account to save,
                continue and export your voice
                documents whenever you need
                them.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">
                    Record naturally
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Speak in Nepali using your
                    device microphone.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">
                    Review before saving
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Edit generated or cleaned
                    text before keeping the
                    final document.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">
                    Export your work
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Download your final document
                    as DOCX or PDF.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs leading-5 text-gray-500">
              AI-generated drafts should be
              reviewed before submission.
            </p>
          </section>

          {/* Register side */}
          <section className="flex min-w-0 flex-col">
            {/* Mobile / tablet header */}
            <div className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/"
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                    N
                  </span>

                  <span className="truncate text-sm font-semibold text-gray-950">
                    Nepali Voice AI Writer
                  </span>
                </Link>

                <Link
                  href="/"
                  className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-gray-950"
                >
                  Home
                </Link>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
              <div className="w-full max-w-md">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Get started
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                    Create your account
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                    Save and continue your Nepali
                    voice documents from your
                    personal workspace.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(
                          event.target.value,
                        );

                        setError("");
                      }}
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(
                          event.target.value,
                        );

                        setError("");
                      }}
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Password
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) => {
                          setPassword(
                            event.target.value,
                          );

                          setError("");
                        }}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Create a password"
                        required
                        className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-20 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-2 focus:ring-gray-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) =>
                              !current,
                          )
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-medium text-gray-500 transition hover:text-gray-950"
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm leading-6 text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Creating account..."
                      : "Create account"}
                  </button>
                </form>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 transition hover:decoration-gray-950"
                    >
                      Login
                    </Link>
                  </p>
                </div>

                <p className="mt-8 text-center text-xs leading-5 text-gray-400">
                  Create an account to save and
                  access your documents.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}