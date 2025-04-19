import { Box, Container, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = () => {
  return (
    <Flex minH="100vh" direction="column">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={4} as="main">
          <Container maxW="container.xl">
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default RootLayout;
