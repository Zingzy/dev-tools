import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  useColorMode,
  IconButton,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

const ColorCard = ({ color, isDominant, isLoading }) => {
  const { colorMode } = useColorMode();
  const copyToClipboard = useCopyToClipboard();
  const toast = useToast();

  const handleCopy = () => {
    copyToClipboard(color, `${color} has been copied to clipboard`);
  };

  return (
    <Skeleton isLoaded={!isLoading}>
      <Box
        position="relative"
        h={isDominant ? "150px" : "100px"}
        bg={color}
        borderRadius="lg"
        overflow="hidden"
        borderWidth="2px"
        borderColor="transparent"
        boxShadow="sm"
        transition="all 0.2s ease"
        _hover={{
          boxShadow: "md",
          borderColor: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.100",
        }}
      >
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          bg={colorMode === "dark" ? "blackAlpha.700" : "whiteAlpha.800"}
          backdropFilter="blur(5px)"
        >
          <VStack spacing={0} align="stretch">
            {isDominant && (
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={colorMode === "dark" ? "gray.300" : "gray.600"}
              >
                Dominant Color
              </Text>
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text
                fontSize="sm"
                fontFamily="monospace"
                color={colorMode === "dark" ? "gray.300" : "gray.600"}
              >
                {color}
              </Text>
              <IconButton
                icon={<CopyIcon />}
                aria-label="Copy color code"
                size="xs"
                variant="ghost"
                onClick={handleCopy}
                color={colorMode === "dark" ? "gray.300" : "gray.600"}
              />
            </Box>
          </VStack>
        </Box>
      </Box>
    </Skeleton>
  );
};

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

export default ImagePaletteDisplay;
