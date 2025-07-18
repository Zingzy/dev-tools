import { extendTheme } from "@chakra-ui/react";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	styles: {
		global: (props) => ({
			body: {
				bg: props.colorMode === "dark" ? "gray.900" : "white",
				color: props.colorMode === "dark" ? "white" : "gray.800",
			},
		}),
	},
	colors: {
		blue: {
			50: "#e6f4ff",
			100: "#bae0ff",
			200: "#91caff",
			300: "#69b1ff",
			400: "#4096ff",
			500: "#1677ff",
			600: "#0958d9",
			700: "#003eb3",
			800: "#002c8c",
			900: "#001d66",
		},
	},
	components: {
		Button: {
			defaultProps: {
				colorScheme: "blue",
			},
			variants: {
				solid: (props) => ({
					bg: props.colorMode === "dark" ? "blue.600" : "blue.500",
					color: "white",
					_hover: {
						bg: props.colorMode === "dark" ? "blue.700" : "blue.600",
					},
				}),
			},
		},
	},
});

export default theme;
