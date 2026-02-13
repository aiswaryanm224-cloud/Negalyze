import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());

// ---------- FILE UPLOAD SETUP ----------
const upload = multer({ dest: "uploads/" });

// ---------- OPENROUTER CONFIG ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Negalyze",
  },
});

// ---------- ROOT TEST ----------
app.get("/", (req, res) => {
  res.send("🚀 Negalyze Backend Running");
});

// ---------- ANALYZE ROUTE ----------
app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const text = req.body.text || "";
    const harshness = req.body.harshness || "normal";

    let tone = "";
    if (harshness === "normal") tone = "Give polite criticism.";
    else if (harshness === "medium") tone = "Be strict and highlight weaknesses.";
    else tone = "Reject harshly and list only problems.";

    let fileContent = "";

    if (req.file) {
      fileContent = `User uploaded a file named ${req.file.originalname}`;
      fs.unlinkSync(req.file.path); // cleanup uploaded file
    }

    const prompt = `
${tone}

Analyze this project and find weaknesses:

TEXT CONTENT:
${text}

FILE INFO:
${fileContent}
`;

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: "You are NEGALYZE AI. Only point out negatives. No praise.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      result: "⚠ Server error. Check backend console.",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
