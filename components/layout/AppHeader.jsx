import Link from "next/link";
import AuthStatus from "@/components/auth/AuthStatus";

export default function AppHeader({
  title = "Nepali Voice AI Writer",
  subtitle = "Voice to trustworthy Nepali documents",
  showBack = false,
}) {
  return (
    <header className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && (
            <Link
              href="/dashboard"
              className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ← Dashboard
            </Link>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {title}
            </p>

            <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/documents/new"
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + New Document
          </Link>

          <AuthStatus />
        </div>
      </div>
    </header>
  );
}