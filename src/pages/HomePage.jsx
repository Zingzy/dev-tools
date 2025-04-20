import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react";
import ToolCard from "../components/shared/ToolCard";
import { tools } from "../config/tools.jsx";

const HomePage = () => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Box
        bg={colorMode === "dark" ? "gray.800" : "gray.50"}
        py={"50px"}
        px={4}
        mb={10}
        borderRadius="lg"
      >
        <Container maxW="container.lg">
          <Heading
            as="h1"
            size="xl"
            mb={5}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Developer Tools
          </Heading>
          <Text
            fontSize="lg"
            color={colorMode === "dark" ? "gray.400" : "gray.600"}
            maxW="container.md"
          >
            A collection of essential tools for developers. Convert, transform,
            and manipulate data with our easy-to-use utilities.
          </Text>
        </Container>
      </Box>

      <Container maxW="container.lg">
        <Box mb={8}>
          <Heading size="lg" mb={4}>
            Available Tools
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {tools.map((tool) => (
              <ToolCard key={tool.path} {...tool} />
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
