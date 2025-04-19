import { lazy, Suspense } from "react";

// Configuration for all available developer tools.
export const tools = [
  {
    name: "Base64 Encoder/Decoder",
    description:
      "Encode and decode text to/from Base64 format. Useful for handling binary data in text format.",
    path: "/tools/base64",
    icon: "🔄",
    component: lazy(() => import("../components/tools/Base64Tool")),
  },
  {
    name: "Color Picker",
    description:
      "Pick colors and convert between different formats (HEX, RGB, HSL). Includes color palette generation.",
    path: "/tools/color-picker",
    icon: "🎨",
    component: lazy(() => import("../components/tools/ColorPickerTool")),
  },
  {
    name: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens (JWT). Visualize header, payload, and validate token expiration.",
    path: "/tools/jwt-decoder",
    icon: "🔑",
    component: lazy(() => import("../components/tools/JWTDecoderTool")),
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
