import {
	Badge,
	Box,
	Button,
	Code,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	SimpleGrid,
	Stack,
	Text,
	Textarea,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { parseUserAgent } from "../../utils/userAgentUtils";

// Helper component to display a key-value pair
const InfoItem = ({ label, value, isCode = false }) => (
	<Flex justify="space-between" align="baseline">
		<Text fontSize="sm" fontWeight="bold" mr={2}>
			{label}
		</Text>
		{isCode ? (
			<Code fontSize="sm" wordBreak="break-all" whiteSpace="pre-wrap">
				{value || "N/A"}
			</Code>
		) : (
			<Text fontSize="sm" textAlign="right">
				{value || "N/A"}
			</Text>
		)}
	</Flex>
);

// Helper component for a section card
const InfoCard = ({ title, children }) => {
	const { colorMode } = useColorMode();
	return (
		<Box
			borderWidth="1px"
			borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
			borderRadius="md"
			p={4}
			bg={colorMode === "dark" ? "gray.800" : "white"}
			height="100%" // Ensure cards have same height in grid
		>
			<Heading size="sm" mb={3} borderBottomWidth="1px" pb={2}>
				{title}
			</Heading>
			<Stack spacing={2}>{children}</Stack>
		</Box>
	);
};

const UserAgentParser = () => {
	const { colorMode } = useColorMode();
	const [userAgentInput, setUserAgentInput] = useState("");
	const [parsedResult, setParsedResult] = useState(null);

	const handleInputChange = (event) => {
		setUserAgentInput(event.target.value);
	};

	const handleParseClick = () => {
		if (!userAgentInput) {
			setParsedResult(null);
			return;
		}
		const result = parseUserAgent(userAgentInput);
		console.log(result);
		setParsedResult(result);
	};

	const handleParseCurrentUserAgent = () => {
		const currentUA = navigator.userAgent;
		const result = parseUserAgent(currentUA);
		setParsedResult(result);
		setUserAgentInput(currentUA); // Set input to current UA as well
	};

	return (
		<Box>
			<Heading size="lg" mb={6}>
				User Agent Parser
			</Heading>
			<VStack spacing={6} align="stretch">
				<VStack spacing={4} align="stretch">
					<FormControl>
						<Textarea
							value={userAgentInput}
							onChange={handleInputChange}
							placeholder="Paste user agent string here or use the button below"
							size="md"
							minH="100px"
							bg={colorMode === "dark" ? "gray.800" : "gray.50"}
							fontFamily="monospace"
						/>
					</FormControl>
					<HStack spacing={4} justify="flex-start">
						<Button
							colorScheme="blue"
							size="md"
							onClick={handleParseClick}
							isDisabled={!userAgentInput}
						>
							Parse Entered User Agent
						</Button>
						<Button
							colorScheme="teal"
							size="md"
							onClick={handleParseCurrentUserAgent}
						>
							Parse Current Browser UA
						</Button>
					</HStack>
				</VStack>

				{parsedResult && (
					<Box mt={4}>
						<Box
							bg={colorMode === "dark" ? "blue.800" : "blue.500"}
							color="white"
							p={4}
							borderRadius="md"
							mb={6}
							textAlign="center"
						>
							<Heading size="md">
								{parsedResult.browser.name || "Unknown Browser"}{" "}
								{parsedResult.browser.version || ""}
								{" on "}
								{parsedResult.os.name || "Unknown OS"}{" "}
								{parsedResult.os.version || ""}
							</Heading>
							{parsedResult.device.vendor && parsedResult.device.model && (
								<Text fontSize="sm" mt={1}>
									({parsedResult.device.vendor} {parsedResult.device.model})
								</Text>
							)}
						</Box>

						<Heading as="h2" size="md" mb={4}>
							<HStack spacing={1} align="center" justify="space-between">
								<Text>Detailed Analysis</Text>
								<Badge
									colorScheme={parsedResult.isBot ? "red" : "green"}
									variant="subtle"
									fontSize="sm"
									px={[3, 2]}
									py={1}
									borderRadius="md"
								>
									{parsedResult.isBot
										? "Identified as Bot"
										: "Not Identified as Bot"}
								</Badge>
							</HStack>
						</Heading>
						{parsedResult.isBot ? (
							// Display only Miscellaneous card when it's a bot
							<SimpleGrid columns={1} spacing={5}>
								<InfoCard title="Bot Details">
									<InfoItem
										label="Is Bot (Standard)"
										value={parsedResult.isBot ? "Yes" : "No"}
									/>
									<InfoItem
										label="Is Bot (Naive)"
										value={parsedResult.isBotNaive ? "Yes" : "No"}
									/>
									<InfoItem
										label="Matched Substring"
										value={parsedResult.matchedSubstring}
									/>
									{parsedResult.allMatchedSubstrings &&
										parsedResult.allMatchedSubstrings.length > 0 && (
											<InfoItem
												label="All Matched Substrings"
												value={parsedResult.allMatchedSubstrings.join(", ")}
											/>
										)}
									<InfoItem
										label="Pattern String Match"
										value={parsedResult.patternStringMatch}
										isCode={true}
									/>
								</InfoCard>
							</SimpleGrid>
						) : (
							// Display Software, OS, and Hardware cards when it's not a bot
							<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
								<InfoCard title="Software">
									<InfoItem
										label="Browser Name"
										value={parsedResult.browser.name}
									/>
									<InfoItem
										label="Browser Version (Full)"
										value={parsedResult.browser.version}
									/>
									<InfoItem
										label="Browser Version (Major)"
										value={parsedResult.browser.major}
									/>
									<InfoItem
										label="Layout Engine Name"
										value={parsedResult.engine.name}
									/>
									<InfoItem
										label="Engine Version"
										value={parsedResult.engine.version}
									/>
								</InfoCard>

								<InfoCard title="Operating System">
									<InfoItem label="OS Name" value={parsedResult.os.name} />
									<InfoItem
										label="OS Version"
										value={parsedResult.os.version}
									/>
								</InfoCard>

								<InfoCard title="Hardware">
									<InfoItem
										label="Device Vendor"
										value={parsedResult.device.vendor}
									/>
									<InfoItem
										label="Device Model"
										value={parsedResult.device.model}
									/>
									<InfoItem
										label="Device Type"
										value={parsedResult.device.type}
									/>
									<InfoItem
										label="CPU Architecture"
										value={parsedResult.cpu.architecture}
									/>
								</InfoCard>
							</SimpleGrid>
						)}
					</Box>
				)}
			</VStack>
		</Box>
	);
};

export default UserAgentParser;
