import { decodeFromBase64 } from "./base64Utils";
import { isEmpty } from "./common";

// Parse and validate a JWT token
export const parseJWT = (token) => {
  try {
    if (isEmpty(token)) {
      return { success: false, error: "Token is empty" };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { success: false, error: "Invalid JWT format" };
    }

    const [headerB64, payloadB64, signature] = parts;

    // Decode header
    const headerResult = decodeFromBase64(headerB64);
    if (!headerResult.success) {
      return { success: false, error: "Invalid header encoding" };
    }

    // Decode payload
    const payloadResult = decodeFromBase64(payloadB64);
    if (!payloadResult.success) {
      return { success: false, error: "Invalid payload encoding" };
    }

    // Parse JSON
    const header = JSON.parse(headerResult.value);
    const payload = JSON.parse(payloadResult.value);

    return {
      success: true,
      value: {
        header,
        payload,
        signature,
        raw: {
          header: headerB64,
          payload: payloadB64,
          signature,
        },
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Format a timestamp in a human-readable format
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  } catch {
    return "Invalid Date";
  }
};

// Check if a JWT is expired
export const isTokenExpired = (payload) => {
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
};
