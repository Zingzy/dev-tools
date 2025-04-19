// Format JSON string with specified indentation
export const formatJSON = (input, indent = 2, sortKeys = false) => {
  try {
    if (!input) {
      return { success: false, error: "Input is empty" };
    }

    // Parse JSON to validate and create object
    const parsed = JSON.parse(input);

    // Function to sort object keys recursively
    const sortObjectKeys = (obj) => {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
      }

      const sorted = {};
      Object.keys(obj)
        .sort()
        .forEach((key) => {
          sorted[key] = sortObjectKeys(obj[key]);
        });
      return sorted;
    };

    // Sort keys if requested
    const processedObj = sortKeys ? sortObjectKeys(parsed) : parsed;

    // Convert indentation to actual characters
    const indentStr = indent === "t" ? "\t" : " ".repeat(Number(indent));

    // Format with specified indentation
    const formatted = JSON.stringify(processedObj, null, indentStr);

    return { success: true, value: formatted };
  } catch (error) {
    return {
      success: false,
      error: "Invalid JSON: " + error.message,
      errorPosition: getErrorPosition(error.message),
    };
  }
};

// Extract position information from JSON parse error message
const getErrorPosition = (errorMessage) => {
  const posMatch = errorMessage.match(/position (\d+)/);
  if (posMatch && posMatch[1]) {
    return parseInt(posMatch[1], 10);
  }
  return null;
};

// Validate JSON string
export const validateJSON = (input) => {
  try {
    if (!input) {
      return { success: false, error: "Input is empty" };
    }
    JSON.parse(input);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Invalid JSON: " + error.message,
      errorPosition: getErrorPosition(error.message),
    };
  }
};

// Calculate min/max indentation in JSON string
export const analyzeIndentation = (jsonString) => {
  try {
    const lines = jsonString.split("\n");
    let minIndent = Infinity;
    let maxIndent = 0;

    lines.forEach((line) => {
      const indent = line.match(/^\s*/)[0].length;
      if (line.trim()) {
        // Skip empty lines
        minIndent = Math.min(minIndent, indent);
        maxIndent = Math.max(maxIndent, indent);
      }
    });

    return {
      success: true,
      value: {
        min: minIndent === Infinity ? 0 : minIndent,
        max: maxIndent,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
