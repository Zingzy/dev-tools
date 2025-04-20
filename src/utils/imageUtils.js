import ColorThief from "colorthief";

// Convert RGB array to hex color string
const rgbToHex = ([r, g, b]) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Creates an Image object from a file or URL
const createImage = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));

    if (source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else {
      img.src = source;
    }
  });
};

// Extract colors from an image using color-thief
export const extractColors = async (source, colorCount = 4) => {
  try {
    const img = await createImage(source);
    const colorThief = new ColorThief();

    // Get dominant color
    const dominantRgb = colorThief.getColor(img);
    const dominant = rgbToHex(dominantRgb);

    // Get color palette
    const paletteRgb = colorThief.getPalette(img, colorCount);
    const palette = paletteRgb.map(rgbToHex);

    // Clean up object URL if source was a File
    if (source instanceof File) {
      URL.revokeObjectURL(img.src);
    }

    return {
      dominant,
      palette,
    };
  } catch (error) {
    console.error("Error extracting colors:", error);
    throw new Error("Failed to extract colors from image");
  }
};

// Validate image file
export const validateImageFile = (file, maxSize) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("File must be a JPG, PNG, or WebP image");
  }

  return true;
};
