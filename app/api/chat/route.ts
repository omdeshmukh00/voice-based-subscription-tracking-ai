export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const lastMessage = messages[messages.length - 1];
    
    // Construct a focused prompt with context
    const prompt = `
    You are STAM (Subscription Tracking Assistant Manager), a helpful AI financial assistant.
    
    Here is the user's current subscription data:
    ${JSON.stringify(context, null, 2)}
    
    User Question: "${lastMessage.content}"
    
    Instructions:
    - Answer based ONLY on the provided subscription data.
    - If the user asks about something not in the data, politely say you don't see that subscription.
    - Be concise, friendly, and helpful.
    - Use Indian Rupee (₹) for all currency values if not specified.
    - If asked for "total", calculate it from the data.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ role: "assistant", content: text });
  } catch (error: any) {
    console.error("Chat API Error Details:", error);
    return Response.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
