import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  IconButton,
  Heading,
  Select,
  useColorMode,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { useToolHistory } from "../../hooks/useToolHistory";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useDebounce } from "../../hooks/useDebounce";
import { generateColorShades, formatColor } from "../../utils/colorUtils";
import { isValidHexColor } from "../../utils/validation";

const ColorPickerTool = () => {
  const [color, setColor] = useLocalStorage("lastUsedColor", "#1a365d");
  const [format, setFormat] = useLocalStorage("colorFormat", "hex");
  const debouncedColor = useDebounce(color, 300);
  const recordHistory = useToolHistory("Color Picker");
  const copyToClipboard = useCopyToClipboard();
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    if (!isValidHexColor(newColor)) {
      toast({
        title: "Invalid Color",
        description: "Please enter a valid hex color code",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setColor(newColor);
    recordHistory(color, newColor);
  };

  const colorString = formatColor(debouncedColor, format);
  const shades = generateColorShades(debouncedColor);

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Color Picker
      </Heading>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Input
            type="color"
            value={color}
            onChange={handleColorChange}
            w="100px"
            h="40px"
            p={1}
            cursor="pointer"
          />
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            w="120px"
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="hsl">HSL</option>
          </Select>
        </HStack>

        <Box
          position="relative"
          bg={colorMode === "dark" ? "gray.700" : "white"}
          p={4}
          borderRadius="md"
        >
          <Text fontSize="lg" fontFamily="monospace">
            {colorString}
          </Text>
          <IconButton
            icon={<CopyIcon />}
            aria-label="Copy color value"
            position="absolute"
            top={2}
            right={2}
            size="sm"
            onClick={() => copyToClipboard(colorString)}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="bold">
            Color Shades
          </Text>
          <SimpleGrid columns={6} spacing={2}>
            {shades.map((shade, index) => (
              <Box
                key={index}
                bg={shade}
                h="40px"
                borderRadius="md"
                cursor="pointer"
                onClick={() => {
                  setColor(shade);
                  recordHistory(color, shade);
                }}
                position="relative"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default ColorPickerTool;
