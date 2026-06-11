// src/services/pdfService.js
// Handles PDF text extraction.
// Uses `pdf-parse` to extract raw text content from uploaded files and truncates text if it exceeds set length limits.
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const MAX_TEXT_LENGTH = 50000;

export const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  let text = data.text || '';

  const truncated = text.length > MAX_TEXT_LENGTH;
  if (truncated) {
    text = text.slice(0, MAX_TEXT_LENGTH);
  }

  return { text, truncated, pageCount: data.numpages };
};
