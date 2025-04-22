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

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    params.append("sitekey", import.meta.env.VITE_HCAPTCHA_SITE_KEY);

    // proxy to hCaptcha verification endpoint, proxy is configured in vite.config.js
    const response = await fetch("/api/verify-captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      console.error("Response status:", response.status);
      console.error(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );
      const errorText = await response.text();
      console.error("Response body:", errorText);

      throw new Error(
        `hCaptcha verification failed with status ${response.status}. Error: ${errorText}`,
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      throw new Error("Invalid response from hCaptcha verification service");
    }

    if (!data.success) {
      const errors = data["error-codes"] || ["Unknown error"];
      console.error("hCaptcha verification failed:", errors);
      throw new Error(
        `Failed to verify hCaptcha response: ${errors.join(", ")}`,
      );
    }

    return data.success;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    throw error;
  }
};
