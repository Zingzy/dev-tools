import {
	Box,
	Divider,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Icon,
	Link,
	Text,
	useBreakpointValue,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { IconStar } from "@tabler/icons-react";
import { Link as RouterLink } from "react-router-dom";
import { tools } from "../../config/tools.jsx";
import { useTools } from "../../contexts/ToolsContext";

const Sidebar = ({ isOpen, onClose }) => {
	const { colorMode } = useColorMode();
	const { favorites, toggleFavorite } = useTools();
	const isMobile = useBreakpointValue({ base: true, md: false });

	const bgColor = colorMode === "dark" ? "gray.900" : "gray.50";
	const borderColor = colorMode === "dark" ? "gray.700" : "gray.200";

	const SidebarContent = () => (
		<VStack spacing={1} align="stretch" overflow={"auto"}>
			{favorites.length > 0 && (
				<>
					<Box px={4}>
						<Text fontSize="md" fontWeight="bold" mb={2} color={"teal.300"}>
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
								mb={1}
								mr={2}
								ml={2}
								px={4}
								py={2}
								borderRadius={"md"}
								display="flex"
								alignItems="center"
								onClick={isMobile ? onClose : undefined}
								_hover={{
									bg: colorMode === "dark" ? "gray.700" : "gray.100",
									textDecoration: "none",
								}}
							>
								<Text mr={4}>{tool.icon}</Text>
								<Text>{tool.name}</Text>
							</Link>
						))}

					<Divider my={2} />
				</>
			)}

			<Box px={4}>
				<Text fontSize="md" fontWeight="bold" mb={2} color={"teal.300"}>
					TOOLS
				</Text>
			</Box>

			{tools.map((tool) => (
				<Link
					key={tool.path}
					as={RouterLink}
					to={tool.path}
					mb={1}
					mr={2}
					ml={2}
					px={4}
					py={2}
					borderRadius={"md"}
					display="flex"
					alignItems="center"
					onClick={isMobile ? onClose : undefined}
					_hover={{
						bg: colorMode === "dark" ? "gray.700" : "gray.100",
						textDecoration: "none",
					}}
				>
					<Text mr={4}>{tool.icon}</Text>
					<Text flex="1">{tool.name}</Text>
					<Icon
						as={IconStar}
						size={20}
						ml={2}
						color={favorites.includes(tool.path) ? "yellow.400" : "gray.500"}
						cursor="pointer"
						onClick={(e) => {
							e.preventDefault();
							toggleFavorite(tool.path);
						}}
					/>
				</Link>
			))}
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
