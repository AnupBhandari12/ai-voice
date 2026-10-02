"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  if (!isRenaming) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsRenaming(true)}
          className="text-sm font-medium underline"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={handleDuplicate}
          disabled={isDuplicating}
          className="text-sm font-medium underline disabled:opacity-50"
        >
          {isDuplicating ? "Duplicating..." : "Duplicate"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm font-medium text-red-600 underline disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>

        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRename}
          disabled={isSaving}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={() => {
            setTitle(currentTitle);
            setError("");
            setIsRenaming(false);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
