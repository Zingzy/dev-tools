import {
  Box,
  Button,
  Heading,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { encodeURL, decodeURL } from "../../utils/urlUtils";
import { isEmpty } from "../../utils/common";

const URLEncoderTool = () => {
  const [input, setInput] = useLocalStorage("url-input", "");
  const [output, setOutput] = useLocalStorage("url-output", "");
  const recordHistory = useToolHistory("URL Encoder/Decoder");
  const copyToClipboard = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 10000) {
      toast({
        title: "Input Too Long",
        description: "Please enter text less than 10000 characters",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setInput(value);
  };

  const encode = () => {
    if (isEmpty(input)) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to encode",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const result = encodeURL(input);
    if (result.success) {
      setOutput(result.value);
      recordHistory(input, result.value);
    } else {
      toast({
        title: "Encoding Error",
        description: result.error,
        status: "error",
        duration: 3000,
      });
      setOutput("");
    }
  };

  const decode = () => {
    if (isEmpty(input)) {
      toast({
        title: "Empty Input",
        description: "Please enter a URL encoded string to decode",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const result = decodeURL(input);
    if (result.success) {
      setOutput(result.value);
      recordHistory(input, result.value);
    } else {
      toast({
        title: "Decoding Error",
        description: result.error,
        status: "error",
        duration: 3000,
      });
      setOutput("");
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        URL Encoder/Decoder
      </Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter text to encode or decode"
            size="lg"
            minH="150px"
            bg={colorMode === "dark" ? "gray.700" : "white"}
          />
        </Box>

        <HStack spacing={4} justify="center">
          <Button
            colorScheme="blue"
            onClick={encode}
            isDisabled={isEmpty(input)}
          >
            Encode
          </Button>
          <Button
            colorScheme="purple"
            onClick={decode}
            isDisabled={isEmpty(input)}
          >
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
          {!isEmpty(output) && (
            <IconButton
              icon={<CopyIcon />}
              aria-label="Copy to clipboard"
              position="absolute"
              top={2}
              right={2}
              onClick={() => copyToClipboard(output)}
            />
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default URLEncoderTool;
