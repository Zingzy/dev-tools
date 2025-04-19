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
  FormControl,
  FormLabel,
  Select,
  Switch,
  Text,
} from "@chakra-ui/react";
import SyntaxHighlighter from "../shared/SyntaxHighlighter";
import { CopyIcon, RepeatIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { formatJSON, validateJSON } from "../../utils/jsonUtils";
import { isEmpty } from "../../utils/common";
import { useEffect, useState } from "react";

const INDENTATION_OPTIONS = [
  { value: "2", label: "2 Spaces" },
  { value: "4", label: "4 Spaces" },
  { value: "t", label: "Tab" },
];

const JSONFormatterTool = () => {
  const [input, setInput] = useLocalStorage("json-input", "");
  const [output, setOutput] = useLocalStorage("json-output", "");
  const [indentation, setIndentation] = useLocalStorage("json-indent", "2");
  const [sortKeys, setSortKeys] = useLocalStorage("json-sort", false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const recordHistory = useToolHistory("JSON Formatter");
  const copyToClipboard = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 50000) {
      toast({
        title: "Input Too Long",
        description: "Please enter text less than 50000 characters",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setInput(value);
    if (!isEmpty(value)) {
      const validation = validateJSON(value);
      setIsValid(validation.success);
      setError(validation.success ? null : validation.error);
    } else {
      setIsValid(true);
      setError(null);
    }
  };

  const format = () => {
    if (isEmpty(input)) {
      toast({
        title: "Empty Input",
        description: "Please enter some JSON to format",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const result = formatJSON(input, indentation, sortKeys);
    if (result.success) {
      setOutput(result.value);
      setError(null);
      setIsValid(true);
      recordHistory(input, result.value);
    } else {
      toast({
        title: "Formatting Error",
        description: result.error,
        status: "error",
        duration: 3000,
      });
      setError(result.error);
      setIsValid(false);
      setOutput("");
    }
  };

  const toggleSortKeys = () => {
    setSortKeys(!sortKeys);
    if (!isEmpty(input) && isValid) {
      const result = formatJSON(input, indentation, !sortKeys);
      if (result.success) {
        setOutput(result.value);
      }
    }
  };

  const handleIndentationChange = (e) => {
    setIndentation(e.target.value);
    if (!isEmpty(input) && isValid) {
      const result = formatJSON(input, e.target.value, sortKeys);
      if (result.success) {
        setOutput(result.value);
      }
    }
  };

  useEffect(() => {
    // Auto-format valid JSON on load if we have input
    if (!isEmpty(input) && isValid) {
      format();
    }
  }, []);

  return (
    <Box>
      <Heading size="lg" mb={6}>
        JSON Formatter
      </Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter JSON to format"
            size="lg"
            minH="200px"
            bg={colorMode === "dark" ? "gray.700" : "white"}
            fontFamily="monospace"
            isInvalid={!isValid}
            _focus={{
              borderColor: isValid ? undefined : "red.300",
            }}
          />
          {error && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {error}
            </Text>
          )}
        </Box>

        <HStack spacing={4} justify="space-between">
          <HStack spacing={4}>
            <FormControl display="flex" alignItems="center" maxW="200px">
              <FormLabel htmlFor="indent" mb={0} fontSize="sm">
                Indentation:
              </FormLabel>
              <Select
                id="indent"
                size="md"
                value={indentation}
                onChange={handleIndentationChange}
              >
                {INDENTATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="sort" mb={0} fontSize="sm">
                Sort Properties:
              </FormLabel>
              <Switch
                id="sort"
                isChecked={sortKeys}
                onChange={toggleSortKeys}
                colorScheme="blue"
              />
            </FormControl>
          </HStack>

          <Button
            colorScheme="blue"
            onClick={format}
            isDisabled={isEmpty(input)}
            leftIcon={<RepeatIcon />}
          >
            Format
          </Button>
        </HStack>

        <Box position="relative">
          <SyntaxHighlighter
            code={output || "Formatted JSON will appear here"}
            language="json"
            minH="300px"
            maxH="300px"
          />
          {!isEmpty(output) && (
            <IconButton
              icon={<CopyIcon />}
              aria-label="Copy to clipboard"
              position="absolute"
              top={2}
              right={3}
              onClick={() => copyToClipboard(output)}
            />
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default JSONFormatterTool;
