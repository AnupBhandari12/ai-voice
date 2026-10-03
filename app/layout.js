import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import InstallAppPrompt from "@/components/pwa/InstallAppPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Nepali Voice AI Writer",
    template: "%s | Nepali Voice AI Writer",
  },

  description:
    "Speak in Nepali, convert your voice into editable text, improve Nepali writing, and create useful document drafts with AI.",

  applicationName: "Nepali Voice AI Writer",

  authors: [
    {
      name: "Bhanova Technologies Pvt. Ltd.",
    },
  ],

  creator: "Bhanova Technologies Pvt. Ltd.",
  publisher: "Bhanova Technologies Pvt. Ltd.",

  keywords: [
    "Nepali Voice AI Writer",
    "Nepali voice to text",
    "Nepali speech to text",
    "Nepali AI writer",
    "Nepali document generator",
    "Nepali application writer",
    "Nepali letter writer",
    "voice to document",
  ],

  category: "productivity",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Nepali Voice AI Writer",
    title: "Nepali Voice AI Writer",
    description:
      "Speak in Nepali and turn your voice into editable text, cleaned Nepali writing, and useful document drafts.",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "Nepali Voice AI Writer",
    description:
      "Speak in Nepali and create editable digital documents with voice and AI.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
      >
        <ServiceWorkerRegister />

        {children}

        <InstallAppPrompt />
      </body>
    </html>
  );
}