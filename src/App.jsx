import { lazy, Suspense } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToolsProvider } from "./contexts/ToolsContext";
import RootLayout from "./components/layout/RootLayout";
import theme from "./theme";

// Lazy load pages and tool components
const HomePage = lazy(() => import("./pages/HomePage"));
const Base64Tool = lazy(() => import("./components/tools/Base64Tool"));
const ColorPickerTool = lazy(
  () => import("./components/tools/ColorPickerTool"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "tools/base64",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Base64Tool />
          </Suspense>
        ),
      },
      {
        path: "tools/color-picker",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ColorPickerTool />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ThemeProvider>
        <ToolsProvider>
          <RouterProvider router={router} />
        </ToolsProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
