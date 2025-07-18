import { WarningTwoIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Heading,
	Text,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
	const { colorMode } = useColorMode();

	return (
		<VStack
			spacing={8}
			justify="center"
			align="center"
			minH="calc(100vh - 200px)"
			py={20}
		>
			<Box _hover={{ transform: "scale(1.1)" }} transition="transform 0.2s">
				<WarningTwoIcon
					boxSize="100px"
					color={colorMode === "dark" ? "orange.300" : "orange.500"}
				/>
			</Box>

			<VStack spacing={4}>
				<Heading
					size="2xl"
					bgGradient={
						colorMode === "dark"
							? "linear(to-r, orange.200, pink.200)"
							: "linear(to-r, orange.500, pink.500)"
					}
					bgClip="text"
					letterSpacing="tight"
					lineHeight={"unset"}
				>
					404: Tool Not Found
				</Heading>
				<Text
					fontSize="lg"
					color={colorMode === "dark" ? "gray.400" : "gray.600"}
					textAlign="center"
				>
					Oops! The tool you're looking for seems to have vanished into the
					digital void.
				</Text>
			</VStack>

			<Button
				as={Link}
				to="/"
				size="lg"
				colorScheme="blue"
				_hover={{
					transform: "translateY(-2px)",
					boxShadow: "lg",
				}}
				transition="all 0.2s"
			>
				Return Home
			</Button>
		</VStack>
	);
};

export default ErrorPage;
