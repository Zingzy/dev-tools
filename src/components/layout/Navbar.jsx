import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	IconButton,
	useBreakpointValue,
	useColorMode,
} from "@chakra-ui/react";
import { IconMail, IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
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
							icon={<IconMenu2 size={20} />}
							onClick={onToggleSidebar}
							display={{ base: "flex", md: "none" }}
						/>
					)}
					<RouterLink to="/">
						<Heading size="md">DevTools</Heading>
					</RouterLink>
				</HStack>

				<HStack spacing={4} align="center">
					<Button
						as={RouterLink}
						to="/contact"
						variant="ghost"
						leftIcon={<IconMail size={20} />}
						display={{ base: "none", md: "flex" }}
					>
						Contact
					</Button>
					<IconButton
						variant={"ghost"}
						aria-label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`}
						icon={
							colorMode === "dark" ? (
								<IconSun size={20} />
							) : (
								<IconMoon size={20} />
							)
						}
						onClick={toggleColorMode}
					/>
				</HStack>
			</Flex>
		</Box>
	);
};

export default Navbar;
