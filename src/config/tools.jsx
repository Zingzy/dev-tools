import {
	IconArrowsExchange,
	IconBraces,
	IconCalculator,
	IconDeviceMobileMessage,
	IconEyeCheck,
	IconKey,
	IconLink,
	IconPalette,
	IconPhoto,
	IconTypography,
} from "@tabler/icons-react";
import { lazy, Suspense } from "react";

// Configuration for all available developer tools.
export const tools = [
	{
		name: "Base64 Encoder/Decoder",
		description:
			"Encode and decode text to/from Base64 format. Useful for handling binary data in text format.",
		path: "/tools/base64",
		icon: <IconArrowsExchange size={20} />,
		component: lazy(() => import("../components/tools/Base64Tool")),
	},
	{
		name: "Base64 Image Encoder/Decoder",
		description:
			"Encode and decode images to/from Base64 format. Supports drag and drop or pasting Base64 data.",
		path: "/tools/base64-image",
		icon: <IconPhoto size={20} />,
		component: lazy(() => import("../components/tools/Base64ImageTool")),
	},
	{
		name: "JWT Decoder",
		description:
			"Decode and inspect JSON Web Tokens (JWT). Visualize header, payload, and validate token expiration.",
		path: "/tools/jwt-decoder",
		icon: <IconKey size={20} />,
		component: lazy(() => import("../components/tools/JWTDecoderTool")),
	},
	{
		name: "JSON Formatter",
		description:
			"Format and beautify JSON with custom indentation. Features include property sorting, syntax validation, and error highlighting.",
		path: "/tools/json-formatter",
		icon: <IconBraces size={20} />,
		component: lazy(() => import("../components/tools/JSONFormatterTool")),
	},
	{
		name: "Image Palette",
		description:
			"Extract color palettes from images. Features dominant color detection and customizable palette size up to 8 colors.",
		path: "/tools/image-palette",
		icon: <IconPhoto size={20} />,
		component: lazy(() => import("../components/tools/ImagePaletteTool")),
	},
	{
		name: "Color Blindness Simulator",
		description:
			"Simulate different types of color blindness on images to help design for accessibility. Includes common vision deficiencies.",
		path: "/tools/color-blindness",
		icon: <IconEyeCheck size={20} />,
		component: lazy(
			() => import("../components/tools/ColorBlindnessSimulator"),
		),
	},
	{
		name: "User Agent Parser",
		description:
			"Parse user agent strings to get detailed information about the browser, OS, and device.",
		path: "/tools/user-agent-parser",
		icon: <IconDeviceMobileMessage size={20} />,
		component: lazy(() => import("../components/tools/UserAgentParser")),
	},
	{
		name: "URL Encoder/Decoder",
		description:
			"Encode and decode URL strings. Convert special characters to/from URL-safe format for web applications.",
		path: "/tools/url-encoder",
		icon: <IconLink size={20} />,
		component: lazy(() => import("../components/tools/URLEncoderTool")),
	},
	{
		name: "Lorem Ipsum Generator",
		description:
			"Generate random Lorem Ipsum text in words, sentences, or paragraphs. Customize length and structure for placeholder text.",
		path: "/tools/lorem-ipsum",
		icon: <IconTypography size={20} />,
		component: lazy(() => import("../components/tools/LoremIpsumTool")),
	},
	{
		name: "Color Picker",
		description:
			"Pick colors and convert between different formats (HEX, RGB, HSL). Includes color palette generation.",
		path: "/tools/color-picker",
		icon: <IconPalette size={20} />,
		component: lazy(() => import("../components/tools/ColorPickerTool")),
	},
	{
		name: "Checksum Generator",
		description:
			"Generate checksums for files using various algorithms (MD5, SHA1, SHA256, etc). Verify file integrity with cryptographic hashes.",
		path: "/tools/checksum-generator",
		icon: <IconCalculator size={20} />,
		component: lazy(() => import("../components/tools/ChecksumGeneratorTool")),
	},
];

// Generate route configurations for all tools.
export const generateToolRoutes = (
	LoadingComponent = <div>Loading...</div>,
) => {
	return tools.map((tool) => ({
		path: tool.path.slice(1), // Remove leading slash for react-router
		element: (
			<Suspense fallback={LoadingComponent}>
				<tool.component />
			</Suspense>
		),
	}));
};
