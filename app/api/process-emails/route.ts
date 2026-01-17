import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXPENSE_EXTRACTION_PROMPT } from "../../../lib/geminiPrompt";



export async function GET() {
  /* =======================
     1. Get user session
  ======================= */
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /* =======================
     2. Fetch inbox email IDs
  ======================= */
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&labelIds=INBOX",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const listData = await listRes.json();
  const messages = listData.messages ?? [];

  if (messages.length === 0) {
    return Response.json({
      message: "No emails found",
      debug: listData,
    });
  }

  /* =======================
     3. Fetch ONE email (metadata)
  ======================= */
  const msgId = messages[0].id;

  const detailRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}?format=metadata`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const detail = await detailRes.json();
  const headers = detail.payload?.headers ?? [];

  const subject =
    headers.find((h: any) => h.name === "Subject")?.value ?? null;
  const from =
    headers.find((h: any) => h.name === "From")?.value ?? null;
  const date =
    headers.find((h: any) => h.name === "Date")?.value ?? null;
  const snippet = detail.snippet ?? "";

  /* =======================
     4. Prepare email text
  ======================= */
  const emailText = `
Subject: ${subject}
From: ${from}
Date: ${date}

Content:
${snippet}
`;

  /* =======================
     5. Call Gemini (CORRECT MODEL)
  ======================= */
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  const prompt = `
${EXPENSE_EXTRACTION_PROMPT}

Email:
${emailText}
`;

  const result = await model.generateContent(prompt);
  const rawOutput = result.response.text();

  /* =======================
     6. Safe JSON parsing
  ======================= */
  let analysis;
  try {
    analysis = JSON.parse(rawOutput);
  } catch {
    analysis = {
      parse_error: true,
      raw_output: rawOutput,
    };
  }

  /* =======================
     7. Final response
  ======================= */
  return Response.json({
    email: {
      subject,
      from,
      date,
      snippet,
    },
    analysis,
  });
}