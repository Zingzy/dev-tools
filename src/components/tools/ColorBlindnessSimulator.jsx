import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Stack,
  AspectRatio,
  useToast,
  useColorMode,
  Spinner,
} from "@chakra-ui/react";
import DropZone from "../shared/DropZone";
import ImageModal from "../shared/ImageModal";
import {
  simulateColorBlindness,
  simulationTypes,
} from "../../utils/colorBlindUtils";
import { validateImageFile } from "../../utils/validation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SimulatedImage = ({ image, title, description, onClick }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      bg={colorMode === "dark" ? "gray.700" : "white"}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "md",
      }}
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          src={image}
          alt={title}
          objectFit="cover"
          fallback={
            <Box
              bg={colorMode === "dark" ? "gray.600" : "gray.100"}
              width="100%"
              height="100%"
            />
          }
        />
      </AspectRatio>
      <Box p={4}>
        <Text fontWeight="bold" mb={1}>
          {title}
        </Text>
        <Text
          fontSize="sm"
          color={colorMode === "dark" ? "gray.400" : "gray.600"}
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
};

const ColorBlindnessSimulator = () => {
  const [image, setImage] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();

  const handleImageUpload = async (file) => {
    try {
      try {
        validateImageFile(file, MAX_FILE_SIZE);
      } catch (error) {
        toast({
          title: "Invalid file",
          description: error.message,
          status: "error",
          duration: 3000,
        });
        return;
      }
      setSimulations([]);
      setIsProcessing(true);

      // Create object URL for original image
      const originalUrl = URL.createObjectURL(file);
      setImage(originalUrl);

      // Process simulations
      const results = await Promise.all(
        simulationTypes.map(async (type) => {
          const simulatedUrl = await simulateColorBlindness(file, type.id);
          return {
            id: type.id,
            name: type.name,
            description: type.description,
            image: simulatedUrl,
          };
        }),
      );

      setSimulations(results);
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

  const handleImageClick = (title, image, description) => {
    setSelectedImage({ title, image, description });
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Color Blindness Simulator
      </Heading>

      <VStack spacing={8} align="stretch">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={6}
          align="stretch"
        >
          <Box flex={1}>
            <DropZone
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
              acceptedFileTypes={["image/*"]}
            />
          </Box>

          {/* Show original image and simulations only after processing */}
          {simulations.length > 0 && image && (
            <Box flex={0.8}>
              <SimulatedImage
                image={image}
                title="Original Image"
                description="Click to view larger version"
                onClick={() =>
                  handleImageClick(
                    "Original Image",
                    image,
                    "Original image without any simulation",
                  )
                }
              />
            </Box>
          )}
        </Stack>

        {simulations.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {simulations.map((sim) => (
              <SimulatedImage
                key={sim.id}
                image={sim.image}
                title={sim.name}
                description={sim.description}
                onClick={() =>
                  handleImageClick(sim.name, sim.image, sim.description)
                }
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage?.image}
        title={selectedImage?.title}
        description={selectedImage?.description}
      />
    </Box>
  );
};

export default ColorBlindnessSimulator;
