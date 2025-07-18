import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [darkMode, setDarkMode] = useState(true);

	const toggleColorMode = () => {
		setDarkMode(!darkMode);
	};

	const value = {
		darkMode,
		toggleColorMode,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};
