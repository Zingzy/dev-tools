import { Box, useColorMode } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";

const SyntaxHighlighter = ({
	code,
	language,
	minH = "300px",
	maxH = "300px",
	fontSize = "sm",
	...props
}) => {
	const { colorMode } = useColorMode();
	const theme =
		colorMode === "dark" ? themes.oceanicNext : themes.nightOwlLight;
	const bgColor = colorMode === "dark" ? "gray.800" : "gray.50";

	return (
		<Box
			position="absolute"
			fontFamily="monospace"
			fontSize={fontSize}
			minH={minH}
			w="100%"
			borderRadius="0.375rem"
			overflow="hidden"
			bg={bgColor}
			border={"1px"}
			borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
			{...props}
		>
			<Highlight theme={theme} code={code} language={language}>
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<Box
						as="pre"
						className={className}
						style={{
							...style,
							margin: 0,
							padding: "1rem",
							minHeight: minH,
							maxHeight: maxH,
							overflow: "auto",
							backgroundColor: "transparent",
						}}
					>
						{tokens.map((line, i) => (
							<div key={i} {...getLineProps({ line, key: i })}>
								{line.map((token, key) => (
									<span key={key} {...getTokenProps({ token, key })} />
								))}
							</div>
						))}
					</Box>
				)}
			</Highlight>
		</Box>
	);
};

export default SyntaxHighlighter;
