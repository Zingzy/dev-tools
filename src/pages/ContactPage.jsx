import {
  Box,
  Container,
  Heading,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import ContactForm from "../components/contact/ContactForm";

const ContactPage = () => {
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
            Contact Us
          </Heading>
          <Text
            fontSize="lg"
            color={colorMode === "dark" ? "gray.400" : "gray.600"}
            maxW="container.md"
          >
            Have questions or suggestions? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </Text>
        </Container>
      </Box>

      <Container maxW="container.md" pb={10}>
        <ContactForm />
      </Container>
    </Box>
  );
};

export default ContactPage;