import { Box, Container, Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";

const ErrorLayout = ({ children }) => {
  return (
    <Flex minH="100vh" direction="column">
      <Navbar />
      <Box flex="1" p={4} as="main">
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
    </Flex>
  );
};

export default ErrorLayout;