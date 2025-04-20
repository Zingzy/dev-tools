import { lazy, Suspense } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToolsProvider } from "./contexts/ToolsContext";
import RootLayout from "./components/layout/RootLayout";
import theme from "./theme";
import { generateToolRoutes } from "./config/tools.jsx";

// Lazy load homepage
const HomePage = lazy(() => import("./pages/HomePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Create router configuration
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
        path: "contact",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ContactPage />
          </Suspense>
        ),
      },
      // Automatically generate all other tools
      ...generateToolRoutes(<div>Loading...</div>),
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
