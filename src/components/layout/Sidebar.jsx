import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTools } from "../../contexts/ToolsContext";
import { StarIcon } from "@chakra-ui/icons";

const tools = [
  { name: "Base64 Encoder/Decoder", path: "/tools/base64", icon: "🔄" },
  { name: "Color Picker", path: "/tools/color-picker", icon: "🎨" },
];

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const { favorites, toggleFavorite } = useTools();

  const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
  const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";

  return (
    <Box
      as="aside"
      w="250px"
      h="100%"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
    >
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
    </Box>
  );
};

export default Sidebar;
