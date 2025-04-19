// Encode string to Base64
export const encodeToBase64 = (input) => {
  try {
    const encoded = btoa(input);
    return {
      success: true,
      value: encoded,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid input for encoding",
    };
  }
};

// Decode string from Base64
export const decodeFromBase64 = (input) => {
  try {
    const decoded = atob(input);
    return {
      success: true,
      value: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid Base64 string",
    };
  }
};
