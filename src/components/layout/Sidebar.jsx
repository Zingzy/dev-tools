import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  Divider,
  useColorMode,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTools } from "../../contexts/ToolsContext";
import { StarIcon } from "@chakra-ui/icons";

const tools = [
  { name: "Base64 Encoder/Decoder", path: "/tools/base64", icon: "🔄" },
  { name: "Color Picker", path: "/tools/color-picker", icon: "🎨" },
  { name: "JWT Decoder", path: "/tools/jwt-decoder", icon: "🔑" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode();
  const { favorites, toggleFavorite } = useTools();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";

  const SidebarContent = () => (
    <VStack spacing={2} align="stretch">
      <Box px={4}>
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          TOOLS
        </Text>
      </Box>

      {tools.map((tool) => (
        <Link
          key={tool.path}
          as={RouterLink}
          to={tool.path}
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          onClick={isMobile ? onClose : undefined}
          _hover={{
            bg: colorMode === "dark" ? "gray.700" : "gray.100",
            textDecoration: "none",
          }}
        >
          <Text mr={2}>{tool.icon}</Text>
          <Text flex="1">{tool.name}</Text>
          <Icon
            as={StarIcon}
            color={favorites.includes(tool.path) ? "yellow.400" : "gray.500"}
            cursor="pointer"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(tool.path);
            }}
          />
        </Link>
      ))}

      {favorites.length > 0 && (
        <>
          <Divider my={2} />
          <Box px={4}>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              FAVORITES
            </Text>
          </Box>
          {tools
            .filter((tool) => favorites.includes(tool.path))
            .map((tool) => (
              <Link
                key={`fav-${tool.path}`}
                as={RouterLink}
                to={tool.path}
                px={4}
                py={2}
                display="flex"
                alignItems="center"
                onClick={isMobile ? onClose : undefined}
                _hover={{
                  bg: colorMode === "dark" ? "gray.700" : "gray.100",
                  textDecoration: "none",
                }}
              >
                <Text mr={2}>{tool.icon}</Text>
                <Text>{tool.name}</Text>
              </Link>
            ))}
        </>
      )}
    </VStack>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="250px">
          <DrawerCloseButton />
          <DrawerBody p={0} bg={bgColor}>
            <Box py={4}>
              <SidebarContent />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box
      as="aside"
      w="250px"
      h="100%"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
      position="fixed"
      left={0}
      top="58px"
      bottom={0}
      display={{ base: "none", md: "block" }}
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: colorMode === "dark" ? "#4A5568" : "#CBD5E0",
          borderRadius: "24px",
        },
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
