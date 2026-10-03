"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

function isDismissedRecently() {
  const saved = localStorage.getItem(DISMISS_KEY);

  if (!saved) {
    return false;
  }

  const dismissedAt = Number(saved);

  if (!dismissedAt) {
    return false;
  }

  const sevenDays =
    DISMISS_DAYS * 24 * 60 * 60 * 1000;

  return Date.now() - dismissedAt < sevenDays;
}

function isIOSDevice() {
  const userAgent = window.navigator.userAgent;

  const normalIOS =
    /iPad|iPhone|iPod/.test(userAgent);

  const iPadDesktopMode =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

  return normalIOS || iPadDesktopMode;
}

function isStandalone() {
  const displayMode = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const iosStandalone =
    window.navigator.standalone === true;

  return displayMode || iosStandalone;
}

export default function InstallAppPrompt() {
  const [showPrompt, setShowPrompt] =
    useState(false);

  const installEventRef = useRef(null);

  const isIOS =
    typeof window !== "undefined" &&
    isIOSDevice();

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    const mobileScreen = window.matchMedia(
      "(max-width: 768px)",
    ).matches;

    if (!mobileScreen) {
      return;
    }

    if (isDismissedRecently()) {
      return;
    }

    let timer;

    if (isIOSDevice()) {
      timer = window.setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();

      installEventRef.current = event;

      timer = window.setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    function handleAppInstalled() {
      setShowPrompt(false);
      installEventRef.current = null;

      localStorage.removeItem(DISMISS_KEY);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled,
    );

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled,
      );
    };
  }, []);

  function handleDismiss() {
    localStorage.setItem(
      DISMISS_KEY,
      String(Date.now()),
    );

    setShowPrompt(false);
  }

  async function handleInstall() {
    const installEvent =
      installEventRef.current;

    if (!installEvent) {
      return;
    }

    installEvent.prompt();

    const choice =
      await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setShowPrompt(false);
      installEventRef.current = null;
      return;
    }

    handleDismiss();
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md sm:hidden">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <Image
            src="/icons/icon-192.png"
            alt="Bhanova Technologies"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-xl"
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-950">
              Install Nepali Voice AI Writer
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-600">
              {isIOS
                ? "Install the app on your Home Screen for faster access."
                : "Add the app to your phone for faster access and an app-like experience."}
            </p>
          </div>
        </div>

        {isIOS && (
          <div className="mt-4 rounded-xl bg-gray-50 p-3">
            <p className="text-xs leading-5 text-gray-600">
              Safari मा{" "}
              <span className="font-semibold text-gray-900">
                Share
              </span>{" "}
              थिच्नुहोस् अनि{" "}
              <span className="font-semibold text-gray-900">
                Add to Home Screen
              </span>{" "}
              छान्नुहोस्।
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-11 flex-1 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Not now
          </button>

          {!isIOS && (
            <button
              type="button"
              onClick={handleInstall}
              className="min-h-11 flex-1 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}