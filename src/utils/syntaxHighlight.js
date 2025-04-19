/**
 * Utility for JSON syntax highlighting
 */

const COLORS = {
  STRING: "#4CAF50", // Green
  NUMBER: "#2196F3", // Blue
  BOOLEAN: "#FF9800", // Orange
  NULL: "#F44336", // Red
  KEY: "#9C27B0", // Purple
};

/**
 * Convert special characters to HTML entities
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHtml = (text) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Add syntax highlighting to JSON string
 * @param {string} json - JSON string to highlight
 * @returns {string} HTML string with syntax highlighting
 */
export const highlightJSON = (json) => {
  // First, format the JSON if it's not already formatted
  let formatted;
  try {
    formatted = JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return escapeHtml(json); // Return escaped but unhighlighted if invalid JSON
  }

  // Add syntax highlighting
  return formatted
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let color = COLORS.STRING; // Default to string color
        let isKey = false;

        if (/^"/.test(match) && /:$/.test(match)) {
          color = COLORS.KEY; // Object key
          isKey = true;
          match = match.slice(0, -1); // Remove the colon
        } else if (/true|false/.test(match)) {
          color = COLORS.BOOLEAN; // Boolean
        } else if (/null/.test(match)) {
          color = COLORS.NULL; // Null
        } else if (/^-?\d/.test(match)) {
          color = COLORS.NUMBER; // Number
        }

        // Wrap the match in a span with the appropriate color
        const highlighted = `<span style="color: ${color}">${match}</span>`;
        return isKey
          ? highlighted + '<span style="color: inherit">:</span>'
          : highlighted;
      },
    );
};
