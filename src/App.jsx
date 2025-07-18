import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorLayout from "./components/layout/ErrorLayout";
import RootLayout from "./components/layout/RootLayout";
import { generateToolRoutes } from "./config/tools.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToolsProvider } from "./contexts/ToolsContext";
import ErrorPage from "./pages/ErrorPage";
import theme from "./theme";

// Lazy load pages
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
	{
		path: "*",
		element: (
			<ErrorLayout>
				<ErrorPage />
			</ErrorLayout>
		),
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
