import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionModalContent = motion(ModalContent);

const ImageModal = ({ isOpen, onClose, image, title, description }) => {
  const { colorMode } = useColorMode();

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="4xl"
          isCentered
          motionPreset="none"
        >
          <ModalOverlay
            bg="blackAlpha.600"
            backdropFilter="blur(8px)"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <MotionModalContent
            bg={colorMode === "dark" ? "gray.800" : "white"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <ModalCloseButton zIndex={2} />
            <ModalBody p={0} position="relative">
              <VStack spacing={4} p={6}>
                <Image
                  src={image}
                  alt={title}
                  maxH="80vh"
                  objectFit="contain"
                  borderRadius="md"
                />
                {title && (
                  <Text fontSize="xl" fontWeight="bold">
                    {title}
                  </Text>
                )}
                {description && (
                  <Text
                    color={colorMode === "dark" ? "gray.400" : "gray.600"}
                    textAlign="center"
                  >
                    {description}
                  </Text>
                )}
              </VStack>
            </ModalBody>
          </MotionModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
