import {
  Box,
  Heading,
  Text,
  Icon,
  useColorMode,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import { useTools } from "../../contexts/ToolsContext";

const ToolCard = ({ name, description, path, icon }) => {
  const { colorMode } = useColorMode();
  const { favorites, toggleFavorite } = useTools();
  const isFavorite = favorites.includes(path);

  return (
    <ChakraLink
      as={RouterLink}
      to={path}
      _hover={{ textDecoration: "none" }}
      w="100%"
    >
      <Box
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
          borderColor: "blue.500",
        }}
        transition="all 0.2s"
        position="relative"
      >
        <Box
          position="absolute"
          top={2}
          right={3}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(path);
          }}
          cursor="pointer"
        >
          <Icon
            as={StarIcon}
            color={isFavorite ? "yellow.400" : "gray.500"}
            _hover={{ color: isFavorite ? "yellow.500" : "yellow.400" }}
          />
        </Box>

        <Box display="flex" alignItems="center" mb={3}>
          <Text fontSize="2xl" mr={2}>
            {icon}
          </Text>
          <Heading size="md">{name}</Heading>
        </Box>

        <Text
          noOfLines={2}
          color={colorMode === "dark" ? "gray.400" : "gray.600"}
        >
          {description}
        </Text>
      </Box>
    </ChakraLink>
  );
};

export default ToolCard;
