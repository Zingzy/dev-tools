import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
  Image,
  Stack,
  AspectRatio,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import DropZone from "../shared/DropZone";
import ColorCard from "../shared/ColorCard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { extractColors } from "../../utils/imageUtils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_COLOR_COUNT = 4;
const MAX_COLOR_COUNT = 8;

const ImagePaletteDisplay = ({ dominantColor, palette, isLoading }) => {
  return (
    <VStack spacing={6} align="stretch">
      {dominantColor && (
        <ColorCard
          color={dominantColor}
          isDominant={true}
          isLoading={isLoading}
        />
      )}

      <SimpleGrid columns={[2, null, 4]} spacing={4}>
        {palette.map((color, index) => (
          <ColorCard
            key={`${color}-${index}`}
            color={color}
            isDominant={false}
            isLoading={isLoading}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

const ImagePaletteTool = () => {
  const [image, setImage] = useState(null);
  const [dominantColor, setDominantColor] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorCount, setColorCount] = useLocalStorage(
    "paletteColorCount",
    DEFAULT_COLOR_COUNT,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const recordHistory = useToolHistory("Image Palette");
  const toast = useToast();

  const handleImageUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { dominant, palette } = await extractColors(file, colorCount);
      setImage(URL.createObjectURL(file));
      setDominantColor(dominant);
      setColorPalette(palette);
      recordHistory("Extracted colors from image", file.name);
    } catch (error) {
      toast({
        title: "Error processing image",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleColorCountChange = async (value) => {
    if (!image) return;
    setColorCount(value);
    setIsProcessing(true);

    try {
      const { palette } = await extractColors(image, value);
      setColorPalette(palette);
    } catch (error) {
      toast({
        title: "Error updating palette",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Image Palette
      </Heading>

      <VStack spacing={6} align="stretch">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={6}
          align="stretch"
        >
          <Box flex={1}>
            <DropZone
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
            />
          </Box>
          {image && (
            <Box flex={1}>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={image}
                  alt="Uploaded image"
                  objectFit="contain"
                  borderRadius="lg"
                  boxShadow="sm"
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                />
              </AspectRatio>
            </Box>
          )}
        </Stack>

        {image && (
          <>
            <Box>
              <Text mb={2} fontWeight="bold">
                Number of Colors
              </Text>
              <Slider
                min={2}
                max={MAX_COLOR_COUNT}
                value={colorCount}
                onChange={handleColorCountChange}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                isDisabled={isProcessing}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  label={`${colorCount} colors`}
                  placement="top"
                  isOpen={showTooltip}
                  bg="blue.500"
                >
                  <SliderThumb />
                </Tooltip>
              </Slider>
            </Box>

            <ImagePaletteDisplay
              dominantColor={dominantColor}
              palette={colorPalette}
              isLoading={isProcessing}
            />
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ImagePaletteTool;
