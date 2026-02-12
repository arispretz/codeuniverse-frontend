/**
 * @fileoverview Utility to clean and normalize mentor output text.
 * Removes unwanted prefixes, code blocks, metadata, technical references,
 * and redundant whitespace to produce a clean, user-friendly string.
 *
 * @module utils/cleanMentorOutput
 */

/**
 * Cleans and normalizes mentor output text by removing unwanted prefixes,
 * code blocks, metadata, and redundant whitespace.
 *
 * @function cleanMentorOutput
 * @param {string} text - Raw mentor output text.
 * @returns {string} Cleaned and normalized text.
 *
 * @example
 * const raw = "Answer: ```js\nconsole.log('Hello');\n``` Step 1: Do this...";
 * const cleaned = cleanMentorOutput(raw);
 * console.log(cleaned);
 * // Output: "Step 1: Do this..."
 */
export function cleanMentorOutput(text) {
  if (!text) return "";
  let result = String(text).trim();

  // 🔹 Remove common prefixes
  ["Answer:", "Explanation:", "Response:"].forEach((prefix) => {
    if (result.toLowerCase().startsWith(prefix.toLowerCase())) {
      result = result.slice(prefix.length).trim();
    }
  });

  // 🔹 Remove code blocks
  result = result.replace(/\\begin\{code\}[\s\S]*?\\end\{code\}/gi, "");
  result = result.replace(/```[\s\S]*?```/g, "");

  // 🔹 Remove Edge metadata
  result = result.replace(/edge_all_open_tabs\s*=\s*\[[\s\S]*?\]/gi, "");
  result = result.replace(/#\s*User.*browser.*tabs.*metadata.*/gi, "");

  // 🔹 Remove unwanted technical references
  result = result
    .replace(/\bdef\s+_load_model\b/gi, "")
    .replace(/\bllama_cpp\b/gi, "")
    .replace(/\bimport\s+os\b/gi, "")
    .replace(/\btraceback\b/gi, "");

  // 🔹 Keep only from "Step 1" onwards if found
  const stepMatch = result.match(/(Step\s*1|^\s*1\.)/im);
  if (stepMatch && stepMatch.index > 0) {
    result = result.slice(stepMatch.index).trim();
  }

  // 🔹 Normalize spacing and formatting
  result = result.replace(/\n{3,}/g, "\n\n").trim();
  result = result.replace(/[ \t]{2,}/g, " ");
  result = result.replace(/^limitation\s*:/im, "Limitation:");

  return result;
}
