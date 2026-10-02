import Link from "next/link";
import { redirect } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import DocumentActions from "@/components/documents/DocumentActions";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { prisma } from "@/lib/prisma";

function getModeLabel(mode) {
    const labels = {
        EXACT: "Exact Dictation",
        CLEAN: "Clean Nepali",
        AI_DOCUMENT: "AI Document",
    };

    return labels[mode] || mode;
}

function getDocumentTypeLabel(type) {
    if (!type) {
        return null;
    }

    return type
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
        );
}

function formatDate(date) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function DashboardPage({
    searchParams,
}) {
    const params = await searchParams;
    const query = params?.query?.trim() || "";

    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const recentDocuments =
        await prisma.document.findMany({
            where: {
                userId: user.id,

                ...(query && {
                    title: {
                        contains: query,
                        mode: "insensitive",
                    },
                }),
            },

            orderBy: {
                updatedAt: "desc",
            },

            take: 10,

            select: {
                id: true,
                title: true,
                mode: true,
                documentType: true,
                createdAt: true,
                updatedAt: true,
            },
        });

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <AppHeader
                    title="Nepali Voice AI Writer"
                    subtitle="Your document workspace"
                />

                {/* Welcome section */}
                <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid gap-6 px-5 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Dashboard
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                                Welcome, {user.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                                Create a new Nepali voice
                                document or continue working on
                                one of your saved documents.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <Link
                                href="/documents/new"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                + New Document
                            </Link>

                            <a
                                href="#documents"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                View Documents
                            </a>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-semibold text-gray-900">
                            Find a document
                        </h2>

                        <p className="text-sm text-gray-500">
                            Search your saved documents by
                            title.
                        </p>
                    </div>

                    <form
                        method="GET"
                        action="/dashboard"
                        className="mt-4 flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="search"
                            name="query"
                            defaultValue={query}
                            placeholder="Search documents by title..."
                            className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                        />

                        <button
                            type="submit"
                            className="min-h-12 rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Search
                        </button>

                        {query && (
                            <Link
                                href="/dashboard"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </section>

                {/* Documents */}
                <section
                    id="documents"
                    className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-950 sm:text-xl">
                                {query
                                    ? "Search Results"
                                    : "Recent Documents"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {query
                                    ? `Results for "${query}"`
                                    : "Your recently updated documents"}
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                            {recentDocuments.length}{" "}
                            {recentDocuments.length === 1
                                ? "document"
                                : "documents"}
                        </span>
                    </div>

                    {recentDocuments.length === 0 ? (
                        <div className="px-5 py-12 text-center sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-md">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">
                                    📄
                                </div>

                                <h3 className="mt-4 font-semibold text-gray-900">
                                    {query
                                        ? "No matching documents"
                                        : "No documents yet"}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    {query
                                        ? "Try another title or clear the search."
                                        : "Create your first voice document and it will appear here."}
                                </p>

                                {query ? (
                                    <Link
                                        href="/dashboard"
                                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Clear Search
                                    </Link>
                                ) : (
                                    <Link
                                        href="/documents/new"
                                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
                                    >
                                        + Create Document
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-5 lg:p-6">
                            <div className="grid gap-3">
                                {recentDocuments.map(
                                    (document) => (
                                        <article
                                            key={document.id}
                                            className="rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm sm:p-5"
                                        >
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="max-w-full truncate text-base font-semibold text-gray-950">
                                                            {document.title ||
                                                                "Untitled Document"}
                                                        </h3>

                                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                            {getModeLabel(
                                                                document.mode,
                                                            )}
                                                        </span>

                                                        {document.documentType && (
                                                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                                                                {getDocumentTypeLabel(
                                                                    document.documentType,
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                                                        <span>
                                                            Created{" "}
                                                            {formatDate(
                                                                document.createdAt,
                                                            )}
                                                        </span>

                                                        <span>
                                                            Updated{" "}
                                                            {formatDate(
                                                                document.updatedAt,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                                                    <Link
                                                        href={`/documents/new?id=${document.id}`}
                                                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                                                    >
                                                        Open
                                                    </Link>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <DocumentActions
                                                            documentId={
                                                                document.id
                                                            }
                                                            currentTitle={
                                                                document.title
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}