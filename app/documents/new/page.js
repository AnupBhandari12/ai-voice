import ModeSelector from "../../../components/documents/ModeSelector";

export default function NewDocumentPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-gray-500">
          New Document
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Choose how you want to write
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Select the mode that matches what you want to create.
        </p>

        <ModeSelector />
      </section>
    </main>
  );
}