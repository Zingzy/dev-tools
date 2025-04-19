import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ToolsContext = createContext();

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};

export const ToolsProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useLocalStorage("tool-favorites", []);

  const addToHistory = (tool, input, output) => {
    setHistory((prev) => [
      {
        tool,
        input,
        output,
        timestamp: new Date().toISOString(),
      },
      ...prev.slice(0, 9),
    ]); // Keep last 10 items
  };

  const toggleFavorite = (toolPath) => {
    setFavorites((prev) =>
      prev.includes(toolPath)
        ? prev.filter((path) => path !== toolPath)
        : [...prev, toolPath],
    );
  };

  const value = {
    history,
    favorites,
    addToHistory,
    toggleFavorite,
  };

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
};
