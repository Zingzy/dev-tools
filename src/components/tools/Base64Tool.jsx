import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  Textarea,
  VStack,
  HStack,
  useToast,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useTools } from "../../contexts/ToolsContext";

const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { addToHistory } = useTools();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const encode = useCallback(() => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      addToHistory("Base64 Encoder", input, encoded);
    } catch (error) {
      toast({
        title: "Encoding Error",
        description: "Please ensure your input contains valid text",
        status: "error",
        duration: 3000,
      });
    }
  }, [input, addToHistory, toast]);

  const decode = useCallback(() => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      addToHistory("Base64 Decoder", input, decoded);
    } catch (error) {
      toast({
        title: "Decoding Error",
        description: "Please ensure your input is valid Base64 encoded text",
        status: "error",
        duration: 3000,
      });
    }
  }, [input, addToHistory, toast]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
      status: "success",
      duration: 2000,
    });
  }, [output, toast]);

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Base64 Encoder/Decoder
      </Heading>

      <VStack spacing={4} align="stretch">
        <Box>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode or decode"
            size="lg"
            minH="150px"
            bg={colorMode === "dark" ? "gray.700" : "white"}
          />
        </Box>

        <HStack spacing={4} justify="center">
          <Button colorScheme="blue" onClick={encode} isDisabled={!input}>
            Encode
          </Button>
          <Button colorScheme="purple" onClick={decode} isDisabled={!input}>
            Decode
          </Button>
        </HStack>

        <Box position="relative">
          <Textarea
            value={output}
            placeholder="Output will appear here"
            size="lg"
            minH="150px"
            isReadOnly
            bg={colorMode === "dark" ? "gray.700" : "white"}
          />
          {output && (
            <IconButton
              icon={<CopyIcon />}
              aria-label="Copy to clipboard"
              position="absolute"
              top={2}
              right={2}
              onClick={copyToClipboard}
            />
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Base64Tool;
