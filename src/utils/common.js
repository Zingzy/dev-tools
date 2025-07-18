export const isEmpty = (value) => {
	if (value === null || value === undefined) return true;
	if (typeof value === "string") return value.trim() === "";
	if (Array.isArray(value)) return value.length === 0;
	return false;
};

export const formatTimestamp = (timestamp) => {
	try {
		const date = new Date(timestamp);
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	} catch (_error) {
		return timestamp;
	}
};

// generate unique ID
export const generateId = (prefix = "") => {
	return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};
