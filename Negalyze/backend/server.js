import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Negalyze",
  },
});

// Test route (prevents 404 on root)
app.get("/", (req, res) => {
  res.send("🚀 Negalyze Backend Running");
});

// Main API route
app.post("/analyze", async (req, res) => {
  try {
    const { text, harshness } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ result: "No project text provided." });
    }

    let tone = "";
    if (harshness === "normal") {
      tone = "Give polite criticism.";
    } else if (harshness === "medium") {
      tone = "Be strict and clearly highlight weaknesses.";
    } else {
      tone = "Reject the project harshly and list only mistakes.";
    }

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",  // Safe OpenRouter model
      messages: [
        {
          role: "system",
          content:
            "You are NEGALYZE AI. You ONLY point out negatives and problems. Never praise.",
        },
        {
          role: "user",
          content: `${tone}\n\nAnalyze this project:\n${text}`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      result: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({
      result: "⚠ OpenRouter error. Check API key or credits.",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
