import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Select,
  HStack,
  IconButton,
  useToast,
  useColorMode,
  Spinner,
  FormControl,
  FormLabel,
  Code,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { IconCalculator } from "@tabler/icons-react";
import DropZone from "../shared/DropZone";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  calculateChecksum,
  checksumAlgorithms,
  getAlgorithmName,
} from "../../utils/checksumUtils";
import { validateFile } from "../../utils/validation";
import { isEmpty } from "../../utils/common";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const ChecksumGeneratorTool = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [checksum, setChecksum] = useState("");
  const [algorithm, setAlgorithm] = useLocalStorage(
    "checksum-algorithm",
    "SHA256",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [expectedHash, setExpectedHash] = useLocalStorage("expected-hash", "");
  const [comparisonResult, setComparisonResult] = useState(null); // null, true (match), false (no match)
  const recordHistory = useToolHistory("Checksum Generator");
  const copyToClipboard = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      validateFile(file, MAX_FILE_SIZE);
      setFile(file);
      setFileName(file.name);
      setChecksum("");

      // Generate checksum immediately after file upload
      await generateChecksum(file, algorithm);
    } catch (error) {
      toast({
        title: "File Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    }
  };

  const generateChecksum = async (fileToProcess, selectedAlgorithm) => {
    if (!fileToProcess) {
      toast({
        title: "No File Selected",
        description: "Please upload a file first",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await calculateChecksum(
        fileToProcess,
        getAlgorithmName(selectedAlgorithm),
      );

      if (result.success) {
        const hashValue = result.value;
        setChecksum(hashValue);
        recordHistory(
          `${fileToProcess.name} (${selectedAlgorithm})`,
          hashValue,
        );

        // Compare with expected hash if provided
        compareHashes(hashValue, expectedHash);
      } else {
        toast({
          title: "Checksum Error",
          description: result.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setChecksum("");
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setChecksum("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAlgorithmChange = async (e) => {
    const newAlgorithm = e.target.value;
    setAlgorithm(newAlgorithm);

    if (file) {
      await generateChecksum(file, newAlgorithm);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setChecksum("");
    setComparisonResult(null);
  };

  const compareHashes = (generatedHash, expected) => {
    if (!expected || expected.trim() === "") {
      setComparisonResult(null);
      return;
    }

    // Normalize hashes (remove spaces, convert to lowercase)
    const normalizedGenerated = generatedHash.toLowerCase().replace(/\s/g, "");
    const normalizedExpected = expected.toLowerCase().replace(/\s/g, "");

    setComparisonResult(normalizedGenerated === normalizedExpected);
  };

  const handleExpectedHashChange = (e) => {
    const value = e.target.value;
    setExpectedHash(value);

    if (checksum) {
      compareHashes(checksum, value);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Checksum Generator
      </Heading>

      <VStack spacing={6} align="stretch">
        <Box>
          <FormControl mb={4}>
            <FormLabel
              fontSize="sm"
              fontWeight="bold"
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              Algorithm
            </FormLabel>
            <Select
              value={algorithm}
              onChange={handleAlgorithmChange}
              disabled={isProcessing}
            >
              {checksumAlgorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel
              fontSize="sm"
              fontWeight="bold"
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              Expected Hash (Optional)
            </FormLabel>
            <Input
              value={expectedHash}
              onChange={handleExpectedHashChange}
              placeholder="Enter expected hash for comparison"
              disabled={isProcessing}
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              If provided, the calculated hash will be compared with this value
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel
              fontSize="sm"
              fontWeight="bold"
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              File Upload
            </FormLabel>
            <DropZone
              onImageUpload={handleFileUpload}
              isProcessing={false}
              acceptedFileTypes={["*/*"]}
              maxSize={1024}
            />
          </FormControl>
        </Box>

        {fileName && (
          <Box
            p={4}
            borderRadius="md"
            bg={colorMode === "dark" ? "gray.700" : "gray.50"}
          >
            <Text fontWeight="bold" mb={2}>
              File: {fileName}
            </Text>
            {file && (
              <Text fontSize="sm" color="gray.500">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            )}
          </Box>
        )}

        {isProcessing && (
          <Box textAlign="center" py={4}>
            <Spinner size="lg" color="blue.500" />
            <Text mt={2}>Calculating {algorithm} checksum...</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              This may take a while for large files
            </Text>
          </Box>
        )}

        {!isEmpty(checksum) && !isProcessing && (
          <Box
            p={4}
            borderRadius="md"
            bg={colorMode === "dark" ? "gray.700" : "gray.50"}
            position="relative"
          >
            <HStack mb={2} justify="space-between">
              <Text fontWeight="bold">{algorithm} Checksum:</Text>
              <IconButton
                size="sm"
                icon={<CopyIcon />}
                aria-label="Copy checksum"
                onClick={() => copyToClipboard(checksum)}
              />
            </HStack>
            <Code
              p={4}
              w="100%"
              borderRadius="md"
              fontSize="sm"
              wordBreak="break-all"
              bg={colorMode === "dark" ? "gray.800" : "gray.100"}
              color={colorMode === "dark" ? "gray.100" : "gray.800"}
            >
              {checksum}
            </Code>

            {comparisonResult !== null && (
              <Alert
                status={comparisonResult ? "success" : "error"}
                mt={4}
                borderRadius="md"
              >
                <AlertIcon />
                <AlertTitle mr={2}>
                  {comparisonResult ? "Hash Verified" : "Hash Mismatch"}
                </AlertTitle>
                <AlertDescription>
                  {comparisonResult
                    ? "The calculated hash matches the expected hash."
                    : "The calculated hash does not match the expected hash."}
                </AlertDescription>
              </Alert>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ChecksumGeneratorTool;
