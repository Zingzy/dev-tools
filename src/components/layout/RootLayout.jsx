import { Box, Container, Flex, useDisclosure } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = () => {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Flex minH="100vh" direction="column">
			<Navbar onToggleSidebar={onToggle} />
			<Flex flex="1" position="relative">
				<Sidebar isOpen={isOpen} onClose={onToggle} />
				<Box
					flex="1"
					p={4}
					as="main"
					ml={{ base: 0, md: "250px" }}
					transition="margin-left 0.3s"
				>
					<Container maxW="container.xl">
						<Outlet />
					</Container>
				</Box>
			</Flex>
		</Flex>
	);
};

export default RootLayout;
