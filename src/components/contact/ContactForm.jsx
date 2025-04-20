import { useState, useEffect } from "react";
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
      // Verify captcha
      const isValid = await verifyHCaptcha(captchaToken);
      if (!isValid) {
        setErrors((prev) => ({ ...prev, captcha: "Invalid captcha" }));
        return;
      }

      // Send message via webhook
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

      // Reset form after successful submission
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
      bg={colorMode === "dark" ? "gray.800" : "white"}
      p={8}
      borderRadius="lg"
      shadow="base"
    >
      <VStack spacing={6}>
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.subject} isRequired>
          <FormLabel>Subject</FormLabel>
          <Input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Message subject"
          />
          <FormErrorMessage>{errors.subject}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.message} isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your message"
            minHeight="200px"
          />
          <FormErrorMessage>{errors.message}</FormErrorMessage>
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
          />
          <FormErrorMessage>{errors.captcha}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={isSubmitting}
          loadingText="Sending..."
        >
          Send Message
        </Button>
      </VStack>
    </Box>
  );
};

export default ContactForm;