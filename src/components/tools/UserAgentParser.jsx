import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  VStack,
  Textarea,
  Heading,
  Text,
  Divider,
  useColorMode,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { parseUserAgent } from "../../utils/userAgentUtils";

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
    setParsedResult(result);
  };

  const handleParseCurrentUserAgent = () => {
    const result = parseUserAgent(navigator.userAgent);
    setParsedResult(result);
    setUserAgentInput(navigator.userAgent); // Set input to current UA as well
  };

  // Optional: Parse current user agent on mount
  // useEffect(() => {
  //   handleParseCurrentUserAgent();
  // }, []);

  return (
    <Box>
      <Heading size="lg" mb={6}>
        User Agent Parser
      </Heading>
      <VStack spacing={6} align="stretch">
        <Box>
          <FormControl>
            <FormLabel fontSize="md">Enter User Agent String</FormLabel>
            <Textarea
              value={userAgentInput}
              onChange={handleInputChange}
              placeholder="Paste user agent string here"
              size="md"
              minH="80px" // Adjusted height for textarea
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              _focus={{
                borderColor: colorMode === "dark" ? "blue.400" : "blue.600",
                bg: colorMode === "dark" ? "gray.800" : "white",
              }}
            />
          </FormControl>
        </Box>

        <HStack spacing={4} justify="center">
          <Button
            colorScheme="blue"
            size="md"
            onClick={handleParseClick}
            isDisabled={!userAgentInput} // Disable if input is empty
          >
            Parse User Agent
          </Button>
          <Button
            colorScheme="teal"
            size="md"
            onClick={handleParseCurrentUserAgent}
          >
            Parse Current User Agent
          </Button>
        </HStack>

        {parsedResult && (
          <Box mt={6}>
            <Heading as="h2" size="md" mb={4}>Analysis Result</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}> {/* Adjusted columns for larger screens */}

              {/* Browser Info */}
              <Card variant="outline" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
                <CardHeader>
                  <Heading size="sm">Browser</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={2}>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Name:</Text> {parsedResult.browser.name || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Version:</Text> {parsedResult.browser.version || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Major:</Text> {parsedResult.browser.major || 'N/A'}</Text>
                  </Stack>
                </CardBody>
              </Card>

              {/* OS Info */}
              <Card variant="outline" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
                <CardHeader>
                  <Heading size="sm">Operating System</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={2}>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Name:</Text> {parsedResult.os.name || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Version:</Text> {parsedResult.os.version || 'N/A'}</Text>
                  </Stack>
                </CardBody>
              </Card>

              {/* Device Info */}
              <Card variant="outline" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
                <CardHeader>
                  <Heading size="sm">Device</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={2}>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Vendor:</Text> {parsedResult.device.vendor || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Model:</Text> {parsedResult.device.model || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Type:</Text> {parsedResult.device.type || 'N/A'}</Text>
                  </Stack>
                </CardBody>
              </Card>

              {/* Engine Info */}
              <Card variant="outline" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
                <CardHeader>
                  <Heading size="sm">Engine</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={2}>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Name:</Text> {parsedResult.engine.name || 'N/A'}</Text>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold">Version:</Text> {parsedResult.engine.version || 'N/A'}</Text>
                  </Stack>
                </CardBody>
              </Card>

               {/* CPU Info */}
               <Card variant="outline" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
                <CardHeader>
                  <Heading size="sm">CPU</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={2}>
                    <Text fontSize="sm"><Text as="span" fontWeight="bold"> Architecture:</Text> {parsedResult.cpu.architecture || 'N/A'}</Text>
                  </Stack>
                </CardBody>
              </Card>


            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default UserAgentParser;