import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Textarea,
  Image,
  Text,
  useColorMode,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
  Spinner,
  Stack,
  AspectRatio,
  Divider,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import DropZone from "../shared/DropZone";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { isEmpty } from "../../utils/common";
import { validateImageFile, isValidBase64 } from "../../utils/validation";
import ImageModal from "../shared/ImageModal";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const Base64ImageTool = () => {
  const { colorMode } = useColorMode();
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [decodedImage, setDecodedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const toast = useToast();
  const copyToClipboard = useCopyToClipboard();

  const handleImageUpload = (file) => {
    if (!file) return;

    try {
      validateImageFile(file, MAX_FILE_SIZE);
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        setImageDataUrl(result);
        setBase64Input("");
        setDecodedImage(null);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Could not read the image file.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "File Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      clearAll();
    }
  };

  const handleBase64InputChange = (event) => {
    setBase64Input(event.target.value);
    setImageDataUrl("");
    setDecodedImage(null);
  };

  const decodeBase64 = () => {
    if (isEmpty(base64Input)) {
      toast({
        title: "Empty Input",
        description: "Please paste Base64 image data to decode",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    const base64String = base64Input.replace(
      /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/,
      "",
    );

    if (base64Input.startsWith("data:image/") && isValidBase64(base64String)) {
      setDecodedImage(base64Input);
      setImageDataUrl("");
    } else {
      const errorMsg =
        "Invalid Base64 image data URL. Please ensure it starts with 'data:image/' and contains valid Base64 data.";
      setDecodedImage(null);
      toast({
        title: "Decoding Error",
        description: errorMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsProcessing(false);
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(imageDataUrl);
  };

  const clearAll = () => {
    setImageDataUrl("");
    setBase64Input("");
    setDecodedImage(null);
    setIsProcessing(false);
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Base64 Image Encoder/Decoder
          </Heading>
        </Box>

        <Stack
          spacing={4}
          direction={{ base: "column", md: "row" }}
          justify="center"
          align="start"
        >
          <Box w={{ base: "100%", md: "50%" }} height={"100%"}>
            <Box>
              <VStack spacing={4} align="stretch" h="100%">
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                  >
                    Base64 Data
                  </FormLabel>
                  <Box position="relative">
                    <Textarea
                      value={imageDataUrl || base64Input}
                      onChange={handleBase64InputChange}
                      placeholder="Paste Base64 image data here or drag and drop an image"
                      minH="500px"
                      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                      fontFamily="monospace"
                      isDisabled={isProcessing}
                      borderColor={
                        colorMode === "dark" ? "gray.600" : "gray.200"
                      }
                    />
                    {imageDataUrl && (
                      <IconButton
                        position={"absolute"}
                        top={2}
                        right={2}
                        icon={<CopyIcon />}
                        aria-label="Copy to clipboard"
                        onClick={handleCopyToClipboard}
                        size="sm"
                      />
                    )}
                  </Box>
                </FormControl>

                <HStack spacing={4} justify="flex-start">
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={decodeBase64}
                    isDisabled={!base64Input || isProcessing}
                    leftIcon={isProcessing ? <Spinner size="xs" /> : undefined}
                  >
                    Decode
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    isDisabled={
                      isEmpty(imageDataUrl) &&
                      isEmpty(base64Input) &&
                      isEmpty(decodedImage)
                    }
                  >
                    Clear All
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Box>

          <Box w={{ base: "100%", md: "50%" }} h={"100%"}>
            <VStack spacing={4} align="stretch">
              {/* Dropzone Section */}
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={colorMode === "dark" ? "white" : "gray.800"}
                  >
                    Image Upload
                  </FormLabel>
                  <DropZone
                    onImageUpload={handleImageUpload}
                    isProcessing={isProcessing}
                    acceptedFileTypes={["image/*"]}
                  />
                </FormControl>
              </VStack>

              {/* Preview Section */}
              <VStack spacing={4} align="stretch">
                <AspectRatio ratio={16 / 9}>
                  {imageDataUrl || decodedImage ? (
                    <Image
                      src={imageDataUrl || decodedImage}
                      alt="Image Preview"
                      objectFit="contain"
                      bg={colorMode === "dark" ? "gray.700" : "gray.50"}
                      borderRadius="md"
                      shadow={"base"}
                      onClick={() => {
                        setModalImage(decodedImage || imageDataUrl);
                        setIsModalOpen(true);
                      }}
                    />
                  ) : (
                    <Text
                      color="gray.500"
                      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                      borderRadius={"md"}
                      shadow={"base"}
                    >
                      No image selected
                    </Text>
                  )}
                </AspectRatio>
              </VStack>
            </VStack>
          </Box>
        </Stack>
      </VStack>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={modalImage}
        title={modalTitle}
        description={modalDescription}
      />
    </Box>
  );
};

export default Base64ImageTool;
