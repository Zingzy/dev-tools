import { useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  IconButton,
  useToast,
  Heading,
  Select,
  useColorMode,
  SimpleGrid,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useTools } from "../../contexts/ToolsContext";

const ColorPickerTool = () => {
  const [color, setColor] = useState("#1a365d");
  const [format, setFormat] = useState("hex");
  const { addToHistory } = useTools();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getFormattedColor = useCallback(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return "";

    switch (format) {
      case "hex":
        return color;
      case "rgb":
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case "hsl":
        // Convert RGB to HSL
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h,
          s,
          l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      default:
        return color;
    }
  }, [color, format]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    addToHistory("Color Picker", color, newColor);
  };

  const copyToClipboard = useCallback(() => {
    const colorValue = getFormattedColor();
    navigator.clipboard.writeText(colorValue);
    toast({
      title: "Copied!",
      description: "Color value copied to clipboard",
      status: "success",
      duration: 2000,
    });
  }, [getFormattedColor, toast]);

  // Generate shades
  const generateShades = useCallback(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return [];

    const shades = [];
    for (let i = 0; i <= 100; i += 20) {
      const shade = {
        r: Math.round(rgb.r * (1 - i / 100)),
        g: Math.round(rgb.g * (1 - i / 100)),
        b: Math.round(rgb.b * (1 - i / 100)),
      };
      shades.push(
        `#${shade.r.toString(16).padStart(2, "0")}${shade.g.toString(16).padStart(2, "0")}${shade.b.toString(16).padStart(2, "0")}`,
      );
    }
    return shades;
  }, [color]);

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
            {getFormattedColor()}
          </Text>
          <IconButton
            icon={<CopyIcon />}
            aria-label="Copy color value"
            position="absolute"
            top={2}
            right={2}
            size="sm"
            onClick={copyToClipboard}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="bold">
            Color Shades
          </Text>
          <SimpleGrid columns={6} spacing={2}>
            {generateShades().map((shade, index) => (
              <Box
                key={index}
                bg={shade}
                h="40px"
                borderRadius="md"
                cursor="pointer"
                onClick={() => {
                  setColor(shade);
                  addToHistory("Color Picker", color, shade);
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
