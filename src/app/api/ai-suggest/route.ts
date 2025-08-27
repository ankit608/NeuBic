import { NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});





export async function POST(req: Request) {
  const { code, cursor } = await req.json(); // now receiving cursor info
  console.log("Cursor:", cursor, "\nCode:\n", code);

  const prompt = `
You are a code completion engine for JavaScript/React.

Here is the current file:
---
${code}
---

The cursor is at line ${cursor.line}, column ${cursor.column}.

Rules:
- ❌ Do NOT suggest "export default" if one already exists.
- ❌ Do NOT suggest "import React" (or any imports) if already present.
- ❌ Do NOT repeat function declarations already in the file.
- ✅ Only continue unfinished statements or props at the cursor.
- ✅ If nothing useful can be suggested, return an EMPTY string.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or gpt-4o for higher quality
    messages: [
      { role: "system", content: "You are an AI coding assistant. Only output code completions, no explanations." },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
    temperature: 0.2,
  });

  let suggestion = completion.choices[0]?.message?.content?.trim() || "";

  // 🚫 Hard filter on server-side
  suggestion = suggestion.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
  const disallowed = ["export default", "import React", "function App("];
  if (disallowed.some(d => code.includes(d) && suggestion.includes(d))) {
    suggestion = ""; // block duplicate
  }

  return NextResponse.json({ suggestion });
}
