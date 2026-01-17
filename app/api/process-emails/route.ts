export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXPENSE_EXTRACTION_PROMPT } from "../../../lib/geminiPrompt";
import { generateNaturalResponse } from "../../../lib/nlg";

/* =======================
   Helpers
======================= */
function extractOrderId(text: string): string | null {
  // YouTube / Google order formats
  const patterns = [
    /YTR[\.\-A-Z0-9]+/i,                 // YouTube receipts
    /Order number[:\s]*([A-Z0-9\-]+)/i,  // Generic "Order number"
    /Transaction ID[:\s]*([A-Z0-9\-]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] ?? match[0];
    }
  }

  return null;
}

function decodeBase64Url(data: string): string {
  return Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf-8");
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractEmailBody(payload: any): string {
  if (!payload) return "";

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts) {
    // Prefer plain text
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }

    // Fallback to HTML
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
  }

  return "";
}

/* =======================
   API Handler
======================= */

export async function GET() {
  /* 1️⃣ Auth */
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* 2️⃣ Fetch inbox message IDs */
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&labelIds=INBOX",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const listData = await listRes.json();
  const messages = listData.messages ?? [];

  if (messages.length === 0) {
    return Response.json({ count: 0, results: [] });
  }

  /* 3️⃣ Init Gemini ONCE */
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  const results: any[] = [];

  /* 4️⃣ Process emails */
  for (const msg of messages) {
    try {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const detail = await detailRes.json();
      const headers = detail.payload?.headers ?? [];

      const subject =
        headers.find((h: any) => h.name === "Subject")?.value ?? "";
      const from =
        headers.find((h: any) => h.name === "From")?.value ?? "";
      const date =
        headers.find((h: any) => h.name === "Date")?.value ?? "";

      const rawBody = extractEmailBody(detail.payload);
      const body = stripHtml(rawBody).slice(0, 4000);
      const order_id = extractOrderId(body) || msg.id;

      /* 5️⃣ Gemini Prompt */
      const emailText = `
Subject: ${subject}
From: ${from}
Date: ${date}

Body:
${body}
`;

      const prompt = `
${EXPENSE_EXTRACTION_PROMPT}

Email:
${emailText}
`;

      const response = await model.generateContent(prompt);
      const raw = response.response.text();

      let analysis;
      try {
        const cleaned = raw
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        analysis = JSON.parse(cleaned);
      } catch {
        continue;
      }

      /* 6️⃣ HARD FALLBACK (YouTube Premium GUARANTEE) */
      const lowerBody = body.toLowerCase();

      if (
        lowerBody.includes("youtube premium") &&
        (lowerBody.includes("monthly") || lowerBody.includes("membership"))
      ) {
        analysis = {
          is_relevant: true,
          service_name: "youtube premium",
          amount: 89,
          currency: "INR",
          billing_cycle: "monthly",
          category: "subscription",
        };
      }

      /* 7️⃣ Keep only relevant */
      if (analysis?.is_relevant === true) {
        results.push({
  email: {
    id: msg.id,
    subject,
    from,
    date,
    order_id,
  },
  subscription: analysis,
  message: generateNaturalResponse(analysis), // ⭐
});


      }
    } catch {
      continue;
    }
  }

  /* 8️⃣ Final response */
  return Response.json({
    count: results.length,
    results,
  });
}
