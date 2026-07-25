import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Only POST is allowed." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { code, language, fileName, filename } = body;
    const targetFile = fileName || filename || "code";

    if (!code) {
      return res.status(400).json({ error: "الرجاء إدخال الكود أولاً لتصليحه." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح GEMINI_API_KEY غير مضاف في متغيرات البيئة (Environment Variables) على Vercel. يرجى إضافته في إعدادات Vercel Project Settings -> Environment Variables ثم عمل Redeploy."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are a high-level, master-grade AI programming co-pilot and mentor in Arabic.
Analyze the following user's code written in "${language}" (File: ${targetFile}).

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
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("AI Code Fix error:", err);
    return res.status(500).json({ error: err.message || "فشلت عملية التصليح بالذكاء الاصطناعي." });
  }
}

