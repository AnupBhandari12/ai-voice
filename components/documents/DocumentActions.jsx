"use client";

import { useRouter } from "next/navigation";
import {  useState } from "react";

export default function DocumentActions({ documentId, currentTitle }) {
  const router = useRouter();

  const [isRenaming, setIsRenaming] = useState(false);

  const [title, setTitle] = useState(currentTitle);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const [isDuplicating, setIsDuplicating] = useState(false);



  async function handleRename() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title खाली हुन मिल्दैन।");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: trimmedTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Rename failed.");
      }

      setIsRenaming(false);
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDuplicate() {
    setIsDuplicating(true);
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}/duplicate`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Duplicate failed.");
      }

      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDuplicating(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${currentTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Delete failed.");
      }

      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancelRename() {
    setTitle(currentTitle);
    setError("");
    setIsRenaming(false);
  }

  if (isRenaming) {
    return (
      <div className="w-full min-w-0 lg:w-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleRename();
              }

              if (event.key === "Escape") {
                handleCancelRename();
              }
            }}
            autoFocus
            className="min-h-10 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 sm:min-w-52"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRename}
              disabled={isSaving}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleCancelRename}
              disabled={isSaving}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsRenaming(true);
          }}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          Rename
        </button>

        <button
          type="button"
          onClick={handleDuplicate}
          disabled={isDuplicating || isDeleting}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDuplicating ? "Duplicating..." : "Duplicate"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isDuplicating}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
