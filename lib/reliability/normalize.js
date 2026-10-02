const NEPALI_DIGITS = {
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9",
};

export function normalizeDigits(text = "") {
  return text.replace(/[०-९]/g, (digit) => NEPALI_DIGITS[digit]);
}

export function normalizeTextForComparison(text = "") {
  return normalizeDigits(text)
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}