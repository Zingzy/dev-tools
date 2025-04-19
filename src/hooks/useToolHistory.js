import { useCallback } from "react";
import { useTools } from "../contexts/ToolsContext";

export const useToolHistory = (toolName) => {
  const { addToHistory } = useTools();

  const recordHistory = useCallback(
    (input, output) => {
      addToHistory(toolName, input, output);
    },
    [toolName, addToHistory],
  );

  return recordHistory;
};

// Example usage:
// const recordHistory = useToolHistory('Base64 Tool');
// recordHistory('input text', 'encoded output');
