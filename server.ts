import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json());

  // Initialize Gemini AI client server-side
  // We must set the User-Agent header to 'aistudio-build' in httpOptions for telemetry.
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Endpoints FIRST
  app.post("/api/ai/fix-code", async (req, res) => {
    try {
      const { code, language, fileName } = req.body;
      if (!code) {
        return res.status(400).json({ error: "الرجاء إدخال الكود أولاً لتصليحه." });
      }

      const prompt = `You are a high-level, master-grade AI programming co-pilot and mentor in Arabic.
Analyze the following user's code written in "${language}" (File: ${fileName || "code"}).

Your job is to:
1. Identify all physical and syntax errors, logical bugs, runtime issues, typings problems (if TypeScript), or layout bugs.
2. Fix them precisely.

CRITICAL CONSTRAINTS FOR THE CORRECTED CODE (fixedCode):
- PRESERVE the user's exact logic, core functionality, existing functions, styling, classes, and surrounding codebase structures. DO NOT strip out features or replace their actual code with an over-simplified Hello World-style template!
- DO NOT truncate the output or use placeholder comments like "// rest of the code is the same...". The code must be complete, functional, and instantly copy-pasteable/applicable.
- Output 100% syntactically valid and runnable "${language}" code.

CRITICAL CONSTRAINTS FOR THE ARABIC EXPLANATION (explanation):
- Acknowledge and politely explain the root cause of the error first (e.g. "تم العثور على خطأ مادي في السطر X...").
- Detail the exact correction step (e.g. "قمنا بتصحيح دالة Y لتفادي Z...").
- Keep the language supportive, highly professional, educational, and encouraging in modern fluent Arabic.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + "\n\nHere is the user's code:\n" + code,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fixedCode: {
                type: Type.STRING,
                description: "The complete corrected and polished code"
              },
              explanation: {
                type: Type.STRING,
                description: "The detailed explanation of what errors were corrected and improvements made, in Arabic"
              }
            },
            required: ["fixedCode", "explanation"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("لم تنجح عملية توليد الإجابة من الذكاء الاصطناعي.");
      }

      const data = JSON.parse(responseText.trim());
      res.json(data);
    } catch (err: any) {
      console.error("AI Code Fix error:", err);
      res.status(500).json({ error: err.message || "فشلت عملية التصليح بالذكاء الاصطناعي." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
