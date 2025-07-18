import {
	Box,
	HStack,
	Icon,
	Input,
	Spinner,
	Text,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import { useCallback, useState } from "react";

const DropZone = ({
	onImageUpload,
	isProcessing,
	acceptedFileTypes = ["image/*"],
	errorDuration = 3000,
	maxSize = 5,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState("");
	const { colorMode } = useColorMode();

	const validateFile = useCallback(
		(file) => {
			// Check if any file type is accepted
			if (acceptedFileTypes.includes("*/*")) {
				return true;
			}

			const isValidType = acceptedFileTypes.some((type) => {
				if (type === "image/*") {
					return file.type.startsWith("image/");
				}
				return file.type === type;
			});

			if (!isValidType) {
				setError("Invalid file type. Please upload a supported file.");
				setTimeout(() => setError(""), errorDuration);
				return false;
			}

			// Check file size
			if (file.size > maxSize * 1024 * 1024) {
				setError(`File size must be less than ${maxSize}MB`);
				setTimeout(() => setError(""), errorDuration);
				return false;
			}

			return true;
		},
		[acceptedFileTypes, errorDuration, maxSize],
	);

	const handleDrag = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDragIn = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	}, []);

	const handleDragOut = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				if (validateFile(file)) {
					onImageUpload(file);
				}
				e.dataTransfer.clearData();
			}
		},
		[onImageUpload, validateFile],
	);

	const handleFileSelect = useCallback(
		(e) => {
			const file = e.target.files[0];
			if (file && validateFile(file)) {
				onImageUpload(file);
			}
			// Reset input value to allow selecting the same file again
			e.target.value = "";
		},
		[onImageUpload, validateFile],
	);

	const formatAcceptedTypes = useCallback(() => {
		if (acceptedFileTypes.includes("*/*")) {
			return "all files";
		}
		return acceptedFileTypes
			.map((type) => {
				if (type === "*/*") return "all files";
				return `${type.split("/")[0]} files`;
			})
			.join(", ");
	}, [acceptedFileTypes]);

	return (
		<Box
			position="relative"
			h="200px"
			w="100%"
			borderWidth={2}
			borderRadius="lg"
			borderStyle="dashed"
			borderColor={
				error
					? "red.500"
					: isDragging
						? "blue.500"
						: colorMode === "dark"
							? "gray.600"
							: "gray.300"
			}
			bg={
				isDragging
					? colorMode === "dark"
						? "gray.700"
						: "gray.100"
					: colorMode === "dark"
						? "gray.800"
						: "gray.50"
			}
			transition="all 0.2s ease"
			_hover={{
				borderColor: error ? "red.500" : "blue.500",
				bg: colorMode === "dark" ? "gray.700" : "gray.100",
			}}
			onDragEnter={handleDragIn}
			onDragLeave={handleDragOut}
			onDragOver={handleDrag}
			onDrop={handleDrop}
		>
			<Input
				type="file"
				height="100%"
				width="100%"
				position="absolute"
				top="0"
				left="0"
				opacity="0"
				aria-hidden="true"
				accept={acceptedFileTypes.join(",")}
				onChange={handleFileSelect}
				disabled={isProcessing}
				sx={{
					"&:disabled": {
						opacity: 0,
						cursor: "not-allowed",
					},
				}}
			/>
			<VStack
				height="100%"
				width="100%"
				justify="center"
				spacing={2}
				color={
					error ? "red.500" : colorMode === "dark" ? "gray.400" : "gray.500"
				}
			>
				<Icon as={IconUpload} w={10} h={10} />
				<Text fontSize="lg" fontWeight="medium">
					{error ||
						(isDragging ? "Drop file here" : "Drop file or click to upload")}
				</Text>
				<Text fontSize="sm">
					{!isProcessing ? (
						`Supports ${formatAcceptedTypes()} (max ${maxSize}MB)`
					) : (
						<HStack spacing={2} justify="center">
							<Spinner size="sm" color="blue.500" />
							<Text>Processing...</Text>
						</HStack>
					)}
				</Text>
			</VStack>
		</Box>
	);
};

export default DropZone;
