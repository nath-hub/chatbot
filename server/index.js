require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("Missing OPENAI_API_KEY in env");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // expects array {role, content}
    if (!messages) return res.status(400).json({ error: "messages required" });

    // Transform to OpenAI format
    const openaiMessages = messages.map(m => ({
      role: m.role === "user" ? "user" : (m.role === "assistant" ? "assistant" : "system"),
      content: m.content
    }));

    // Example using Chat Completions (GPT-4/3.5)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // ou "gpt-4" / "gpt-3.5-turbo" selon ton accès
        messages: openaiMessages,
        temperature: 0.2,
        max_tokens: 800
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const assistantMsg = response.data.choices?.[0]?.message?.content || "";
    return res.json({ assistant: assistantMsg, raw: response.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: "OpenAI request failed", detail: err?.response?.data || err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
