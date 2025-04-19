import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";

export const useCopyToClipboard = () => {
  const toast = useToast();

  const copyToClipboard = useCallback(
    async (text, message = "Copied to clipboard!") => {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: message,
          status: "success",
          duration: 2000,
        });
        return true;
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          status: "error",
          duration: 2000,
        });
        return false;
      }
    },
    [toast],
  );

  return copyToClipboard;
};
