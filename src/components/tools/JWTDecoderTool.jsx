import {
  Box,
  Button,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useColorMode,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { isEmpty } from "../../utils/common";
import {
  parseJWT,
  formatTimestamp,
  isTokenExpired,
} from "../../utils/jwtUtils";

const JWTDecoderTool = () => {
  const [input, setInput] = useLocalStorage("jwt-input", "");
  const [decodedData, setDecodedData] = useLocalStorage("jwt-decoded", null);
  const recordHistory = useToolHistory("JWT Decoder");
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

  const decode = () => {
    if (isEmpty(input)) {
      toast({
        title: "Empty Input",
        description: "Please enter a JWT token to decode",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const result = parseJWT(input);
    if (result.success) {
      setDecodedData(result.value);
      recordHistory(input, JSON.stringify(result.value, null, 2));
    } else {
      toast({
        title: "Decoding Error",
        description: result.error,
        status: "error",
        duration: 3000,
      });
      setDecodedData(null);
    }
  };

  const renderTokenSection = (title, data, raw) => {
    const content = JSON.stringify(data, null, 2);
    return (
      <Box
        p={4}
        borderRadius="md"
        bg={colorMode === "dark" ? "gray.700" : "gray.50"}
        position="relative"
      >
        <HStack mb={2} justify="space-between">
          <Heading size="sm">{title}</Heading>
          <IconButton
            size="sm"
            icon={<CopyIcon />}
            aria-label={`Copy ${title}`}
            onClick={() => copyToClipboard(raw || content)}
          />
        </HStack>
        <Textarea
          value={content}
          isReadOnly
          size="sm"
          minH="100px"
          fontFamily="monospace"
          bg={colorMode === "dark" ? "gray.800" : "white"}
        />
      </Box>
    );
  };

  const renderExpiryInfo = () => {
    if (!decodedData?.payload?.exp) return null;

    const expired = isTokenExpired(decodedData.payload);
    return (
      <HStack>
        <Text>Expires:</Text>
        <Badge colorScheme={expired ? "red" : "green"}>
          {formatTimestamp(decodedData.payload.exp)}
        </Badge>
        <Badge colorScheme={expired ? "red" : "green"}>
          {expired ? "Expired" : "Valid"}
        </Badge>
      </HStack>
    );
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        JWT Decoder
      </Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter JWT token to decode"
            size="lg"
            minH="100px"
            bg={colorMode === "dark" ? "gray.800" : "white"}
          />
        </Box>

        <Button
          colorScheme="blue"
          onClick={decode}
          isDisabled={isEmpty(input)}
          alignSelf="center"
        >
          Decode Token
        </Button>

        {decodedData && (
          <VStack spacing={4} align="stretch">
            {renderExpiryInfo()}
            {renderTokenSection(
              "Header",
              decodedData.header,
              decodedData.raw.header,
            )}
            {renderTokenSection(
              "Payload",
              decodedData.payload,
              decodedData.raw.payload,
            )}
            <Box
              p={4}
              borderRadius="md"
              bg={colorMode === "dark" ? "gray.700" : "gray.50"}
              position="relative"
            >
              <HStack mb={2} justify="space-between">
                <Heading size="sm">Signature</Heading>
                <IconButton
                  size="sm"
                  icon={<CopyIcon />}
                  aria-label="Copy signature"
                  onClick={() => copyToClipboard(decodedData.raw.signature)}
                />
              </HStack>
              <Text
                p={4}
                fontFamily="monospace"
                fontSize="sm"
                wordBreak="break-all"
                bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              >
                {decodedData.signature}
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default JWTDecoderTool;
