import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      px={4}
      py={2}
      shadow="md"
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <HStack spacing={8}>
          <RouterLink to="/">
            <Heading size="md">DevTools</Heading>
          </RouterLink>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
