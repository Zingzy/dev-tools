// Encode a string using URL encoding
export const encodeURL = (input) => {
	try {
		if (!input) {
			return { success: false, error: "Input is empty" };
		}
		const encoded = encodeURIComponent(input);
		return { success: true, value: encoded };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Decode a URL encoded string
export const decodeURL = (input) => {
	try {
		if (!input) {
			return { success: false, error: "Input is empty" };
		}
		const decoded = decodeURIComponent(input);
		return { success: true, value: decoded };
	} catch (error) {
		return {
			success: false,
			error: "Invalid URL encoding: " + error.message,
		};
	}
};
