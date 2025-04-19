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
  const theme = colorMode === "dark" ? themes.vsDark : themes.nightOwlLight;

  return (
    <Box
      position="absolute"
      fontFamily="monospace"
      fontSize={fontSize}
      minH={minH}
      w="100%"
      borderRadius="0.375rem"
      overflow="hidden"
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
