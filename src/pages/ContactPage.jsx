import { Box, Container, Heading, Text, useColorMode } from "@chakra-ui/react";
import ContactForm from "../components/contact/ContactForm";

const ContactPage = () => {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={8}>
        <Heading
          as="h1"
          size="xl"
          mb={3}
          color={colorMode === "dark" ? "blue.400" : "blue.600"}
        >
          Contact Us
        </Heading>
        <Text
          fontSize="lg"
          color={colorMode === "dark" ? "gray.400" : "gray.600"}
        >
          Have questions or suggestions? We'd love to hear from you.
        </Text>
      </Box>
      <ContactForm />
    </Container>
  );
};

export default ContactPage;
