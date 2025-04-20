// Send a message to Discord via webhook
export const sendDiscordWebhook = async (name, email, subject, message) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Discord webhook URL is not configured");
  }

  const data = {
    embeds: [
      {
        title: "New Contact Form Submission ✉️",
        fields: [
          {
            name: "Subject",
            value: `\`\`\`${subject}\`\`\``,
          },
          {
            name: "Message",
            value: `\`\`\`${message}\`\`\``,
          },
        ],
        author: {
          name: `${name} (${email})`,
        },
        color: 0x0099ff, // Blue color
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`);
  }
};

// Verify hCaptcha token
export const verifyHCaptcha = async (token) => {
  const secret = import.meta.env.VITE_HCAPTCHA_SECRET;
  if (!secret) {
    throw new Error("hCaptcha secret is not configured");
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  // proxy to hCaptcha verification endpoint, proxy is configured in vite.config.js
  const response = await fetch("/api/verify-captcha", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`hCaptcha verification failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    const errors = data['error-codes'] || ['Unknown error'];
    console.error('hCaptcha verification failed:', errors);
    throw new Error(`Failed to verify hCaptcha response: ${errors.join(', ')}`);
  }

  return data.success;
};