import {
  Box,
  Button,
  Heading,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { generateLoremIpsum } from "../../utils/loremIpsumUtils";
import { isEmpty } from "../../utils/common";

const LoremIpsumTool = () => {
  const [type, setType] = useLocalStorage("lorem-type", "paragraphs");
  const [length, setLength] = useLocalStorage("lorem-length", 3);
  const [startWithLorem, setStartWithLorem] = useLocalStorage(
    "lorem-start",
    false,
  );
  const [output, setOutput] = useLocalStorage("lorem-output", "");
  const recordHistory = useToolHistory("Lorem Ipsum Generator");
  const copyToClipboard = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleGenerate = () => {
    const result = generateLoremIpsum(type, length, startWithLorem);
    if (result.success) {
      setOutput(result.value);
      recordHistory(
        `${type}: ${length}${startWithLorem ? " (classic start)" : ""}`,
        result.value,
      );
    } else {
      toast({
        title: "Generation Error",
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
        Lorem Ipsum Generator
      </Heading>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            bg={colorMode === "dark" ? "gray.700" : "white"}
            flex="1"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </Select>

          <NumberInput
            value={length}
            onChange={(valueString) => setLength(parseInt(valueString, 10))}
            min={1}
            max={50}
            maxW="150px"
            bg={colorMode === "dark" ? "gray.700" : "white"}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>

        <HStack spacing={4}>
          <Text>Start with "Lorem ipsum dolor sit amet"</Text>
          <Switch
            isChecked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            colorScheme="blue"
          />
        </HStack>

        <HStack spacing={4} justifyContent={"center"}>
          <Button colorScheme="blue" onClick={handleGenerate}>
            Generate
          </Button>
        </HStack>

        <Box position="relative">
          <Textarea
            value={output}
            placeholder="Generated text will appear here"
            size="md"
            minH="300px"
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

export default LoremIpsumTool;
