// Utility functions for generating checksums
import md5 from "js-md5";

// Calculate checksum for a file using the specified algorithm
export const calculateChecksum = async (file, algorithm) => {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate algorithm
    const validAlgorithms = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    if (!validAlgorithms.includes(algorithm)) {
      return { success: false, error: "Invalid algorithm" };
    }

    // Read file as array buffer
    const arrayBuffer = await readFileAsArrayBuffer(file);

    // For MD5, use the js-md5 library since Web Crypto API doesn't support MD5
    if (algorithm === "MD5") {
      const hashHex = md5(new Uint8Array(arrayBuffer));
      return { success: true, value: hashHex };
    }

    // For other algorithms, use Web Crypto API
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);

    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return { success: true, value: hashHex };
  } catch (error) {
    console.error("Error calculating checksum:", error);
    return { success: false, error: error.message };
  }
};

// Read a file as ArrayBuffer
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// Get the Web Crypto API algorithm name from our display name
export const getAlgorithmName = (algorithm) => {
  const algorithmMap = {
    MD5: "MD5",
    SHA1: "SHA-1",
    SHA256: "SHA-256",
    SHA384: "SHA-384",
    SHA512: "SHA-512",
  };

  return algorithmMap[algorithm] || algorithm;
};

// This function is used to check if we need to use the Web Crypto API or a custom implementation
export const isWebCryptoSupported = (algorithm) => {
  // MD5 is not supported by Web Crypto API
  return algorithm !== "MD5";
};

// List of supported checksum algorithms
export const checksumAlgorithms = [
  { value: "MD5", label: "MD5" },
  { value: "SHA1", label: "SHA-1" },
  { value: "SHA256", label: "SHA-256" },
  { value: "SHA384", label: "SHA-384" },
  { value: "SHA512", label: "SHA-512" },
];
