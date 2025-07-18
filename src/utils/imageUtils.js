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
