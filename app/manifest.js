export default function manifest() {
  return {
    name: "Nepali Voice AI Writer",
    short_name: "VoiceWriter",

    description:
      "Speak in Nepali, convert your voice into editable text, clean Nepali writing, and create useful document drafts with AI.",

    start_url: "/",

    scope: "/",

    display: "standalone",

    background_color: "#f9fafb",

    theme_color: "#111827",

    orientation: "any",

    lang: "ne",

    categories: [
      "productivity",
      "utilities",
    ],

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}