import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { sendDiscordWebhook, verifyHCaptcha } from "../../utils/webhookUtils";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  useToast,
  useColorMode,
} from "@chakra-ui/react";

const ContactForm = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!captchaToken) {
      setErrors((prev) => ({ ...prev, captcha: "Please complete the captcha" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await verifyHCaptcha(captchaToken);
      if (!isValid) {
        setErrors((prev) => ({ ...prev, captcha: "Invalid captcha" }));
        return;
      }

      await sendDiscordWebhook(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      borderWidth="1px"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      borderRadius="md"
      p={{ base: 4, md: 6 }}
    >
      <VStack spacing={5} align="stretch">
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel fontSize="sm">Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            size="md"
            variant="filled"
            _focus={{
              borderColor: colorMode === "dark" ? "blue.400" : "blue.600",
              bg: colorMode === "dark" ? "gray.800" : "white",
            }}
          />
          <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel fontSize="sm">Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            size="md"
            variant="filled"
            _focus={{
              borderColor: colorMode === "dark" ? "blue.400" : "blue.600",
              bg: colorMode === "dark" ? "gray.800" : "white",
            }}
          />
          <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.subject} isRequired>
          <FormLabel fontSize="sm">Subject</FormLabel>
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Message subject"
            size="md"
            variant="filled"
            _focus={{
              borderColor: colorMode === "dark" ? "blue.400" : "blue.600",
              bg: colorMode === "dark" ? "gray.800" : "white",
            }}
          />
          <FormErrorMessage fontSize="xs">{errors.subject}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.message} isRequired>
          <FormLabel fontSize="sm">Message</FormLabel>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your message"
            minH="150px"
            size="md"
            variant="filled"
            _focus={{
              borderColor: colorMode === "dark" ? "blue.400" : "blue.600",
              bg: colorMode === "dark" ? "gray.800" : "white",
            }}
          />
          <FormErrorMessage fontSize="xs">{errors.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.captcha}>
          <HCaptcha
            sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
            onVerify={(token) => {
              setCaptchaToken(token);
              if (errors.captcha) {
                setErrors((prev) => ({ ...prev, captcha: undefined }));
              }
            }}
            theme={colorMode}
          />
          <FormErrorMessage fontSize="xs">{errors.captcha}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          width="full"
          isLoading={isSubmitting}
          loadingText="Sending..."
          mt={2}
        >
          Send Message
        </Button>
      </VStack>
    </Box>
  );
};

export default ContactForm;