import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export async function createDocxBuffer({
  title,
  text,
}) {
  const paragraphs = text
    .split(/\r?\n/)
    .map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line || " ",
              font: "Nirmala UI",
              size: 24,
            }),
          ],
          spacing: {
            after: 160,
          },
        }),
    );

  const document = new Document({
    creator: "Nepali Voice AI Writer",
    title: title || "Nepali Document",

    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  return Packer.toBuffer(document);
}