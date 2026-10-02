import Link from "next/link";
import { redirect } from "next/navigation";

import AuthStatus from "@/components/auth/AuthStatus";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { prisma } from "@/lib/prisma";
import DocumentActions from "@/components/documents/DocumentActions";

export default async function DashboardPage({ searchParams }) {
    const params = await searchParams;
    const query = params?.query?.trim() || "";
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const recentDocuments = await prisma.document.findMany({
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
        <main className="min-h-screen px-6 py-16">
            <section className="mx-auto max-w-5xl">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Dashboard
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Welcome, {user.name}
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Create a new voice document or continue your saved work.
                        </p>
                    </div>

                    <AuthStatus />
                </div>

                <div className="mt-10">
                    <Link
                        href="/documents/new"
                        className="inline-block rounded-lg bg-black px-5 py-3 text-white"
                    >
                        + New Voice Document
                    </Link>
                </div>
                <form
                    method="GET"
                    action="/dashboard"
                    className="mt-8 flex max-w-xl gap-3"
                >
                    <input
                        type="search"
                        name="query"
                        defaultValue={query}
                        placeholder="Search documents by title..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium"
                    >
                        Search
                    </button>
                </form>
                <section className="mt-12 rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold">
                        {query ? "Search Results" : "Recent Documents"}
                    </h2>

                    <div className="mt-5 space-y-3">
                        {recentDocuments.map((document) => (
                            <div
                                key={document.id}
                                className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <h3 className="font-medium">
                                        {document.title}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                        <span className="rounded-full border border-gray-300 px-2 py-1 text-xs font-medium">
                                            {document.mode}
                                        </span>

                                        {document.documentType && (
                                            <span className="rounded-full border border-gray-300 px-2 py-1 text-xs">
                                                {document.documentType}
                                            </span>
                                        )}

                                        <span>
                                            Created: {document.createdAt.toLocaleDateString()}
                                        </span>

                                        <span>
                                            Updated: {document.updatedAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`/documents/new?id=${document.id}`}
                                        className="text-sm font-medium underline"
                                    >
                                        Open
                                    </Link>

                                    <DocumentActions
                                        documentId={document.id}
                                        currentTitle={document.title}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}