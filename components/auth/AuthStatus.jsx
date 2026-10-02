"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getInitial(name, email) {
  const value = name?.trim() || email?.trim();

  if (!value) {
    return "U";
  }

  return value.charAt(0).toUpperCase();
}

export default function AuthStatus() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data =
          await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(
          "Could not load account:",
          error,
        );

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Logout failed.",
        );
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2"
        aria-label="Loading account"
      >
        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />

        <div className="hidden sm:block">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

          <div className="mt-1.5 h-2.5 w-28 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      {/* User */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200">
          {getInitial(
            user.name,
            user.email,
          )}
        </div>

        <div className="hidden min-w-0 sm:block">
          <p className="max-w-36 truncate text-sm font-semibold text-gray-900 lg:max-w-44">
            {user.name || "Account"}
          </p>

          <p className="max-w-36 truncate text-xs text-gray-500 lg:max-w-44">
            {user.email}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
      >
        {isLoggingOut
          ? "Logging out..."
          : "Logout"}
      </button>
    </div>
  );
}