import { Box, useColorMode } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";

const SyntaxHighlighter = ({
  code,
  language,
  minH = "300px",
  fontSize = "sm",
  ...props
}) => {
  const { colorMode } = useColorMode();
  const theme = colorMode === "dark" ? themes.nightOwl : themes.nightOwlLight;

  return (
    <Box
      position="relative"
      fontFamily="monospace"
      fontSize={fontSize}
      minH={minH}
      {...props}
    >
      <Highlight
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box
            as="pre"
            className={className}
            style={{
              ...style,
              margin: 0,
              padding: "1rem",
              minHeight: minH,
              borderRadius: "0.375rem",
              overflow: "scroll",
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