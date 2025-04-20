import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Heading,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const showMenuButton = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="nav"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      px={4}
      py={2}
      shadow="base"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex justify="space-between" align="center" maxW="100%" mx="auto">
        <HStack spacing={4}>
          {showMenuButton && (
            <IconButton
              variant={"outline"}
              aria-label="Toggle sidebar"
              icon={<HamburgerIcon />}
              onClick={onToggleSidebar}
              display={{ base: "flex", md: "none" }}
            />
          )}
          <RouterLink to="/">
            <Heading size="md">DevTools</Heading>
          </RouterLink>
        </HStack>

        <HStack spacing={4}>
          <IconButton
            variant={"ghost"}
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
