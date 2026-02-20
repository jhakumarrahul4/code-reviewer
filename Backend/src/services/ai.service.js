require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.OPENROUTER_API_KEY;

async function generateContent(prompt) {
  try {
    const response = await axios({
      url: "https://openrouter.ai/api/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "AI Code Reviewer",
      },
      data: {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: `You are a senior code reviewer.

Give concise, bullet-point feedback.

Limit explanation to max 8–10 points.

Provide improved code only if necessary.`,
          },
          { role: "user", content: prompt },
        ],
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("🔥 AI ERROR:", error.response?.data || error.message);
    return "AI request failed — check your API key or internet.";
  }
}

module.exports = generateContent;
