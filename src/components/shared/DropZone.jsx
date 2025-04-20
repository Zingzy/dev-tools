import { useCallback, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Input,
  useColorMode,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";

const DropZone = ({ onImageUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { colorMode } = useColorMode();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onImageUpload(file);
        }
        e.dataTransfer.clearData();
      }
    },
    [onImageUpload],
  );

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageUpload(file);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [onImageUpload],
  );

  return (
    <Box
      position="relative"
      h="200px"
      w="100%"
      borderWidth={2}
      borderRadius="lg"
      borderStyle="dashed"
      borderColor={
        isDragging ? "blue.500" : colorMode === "dark" ? "gray.600" : "gray.300"
      }
      bg={
        isDragging
          ? colorMode === "dark"
            ? "gray.700"
            : "gray.100"
          : colorMode === "dark"
            ? "gray.800"
            : "gray.50"
      }
      transition="all 0.2s ease"
      _hover={{
        borderColor: "blue.500",
        bg: colorMode === "dark" ? "gray.700" : "gray.100",
      }}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        opacity="0"
        aria-hidden="true"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isProcessing}
      />
      <VStack
        height="100%"
        width="100%"
        justify="center"
        spacing={2}
        color={colorMode === "dark" ? "gray.400" : "gray.500"}
      >
        {isProcessing ? (
          <Spinner size="lg" color="blue.500" />
        ) : (
          <>
            <Icon as={IconUpload} w={10} h={10} />
            <Text fontSize="lg" fontWeight="medium">
              {isDragging ? "Drop image here" : "Drop image or click to upload"}
            </Text>
            <Text fontSize="sm">Supports JPG, PNG and WebP (max 5MB)</Text>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default DropZone;
