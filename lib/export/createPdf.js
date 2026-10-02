import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function createPdfBuffer({
  title,
  text,
}) {
  const safeTitle = escapeHtml(
    title || "Nepali Document",
  );

  const safeText = escapeHtml(text);

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "NotoSansDevanagari-Regular.woff2",
  );

  const fontBuffer = await readFile(fontPath);
  const fontBase64 = fontBuffer.toString("base64");

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ne">
        <head>
          <meta charset="UTF-8" />

          <style>
            @font-face {
              font-family: "NotoDevanagari";
              src: url("data:font/woff2;base64,${fontBase64}")
                format("woff2");
              font-weight: 400;
              font-style: normal;
            }

            @page {
              size: A4;
              margin: 24mm 20mm;
            }

            body {
              font-family:
                "NotoDevanagari",
                "Nirmala UI",
                sans-serif;

              font-size: 14px;
              line-height: 1.7;
              color: #111;
            }

            h1 {
              font-size: 20px;
              margin-bottom: 24px;
            }

            .content {
              white-space: pre-wrap;
              overflow-wrap: break-word;
            }
          </style>
        </head>

        <body>
          <h1>${safeTitle}</h1>

          <div class="content">${safeText}</div>
        </body>
      </html>
    `);

    await page.evaluate(() => document.fonts.ready);

    return await page.pdf({
      format: "A4",
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}