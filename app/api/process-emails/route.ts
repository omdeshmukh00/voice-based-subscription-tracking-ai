import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

function analyzeEmail(body: string, subject: string) {
  const text = `${subject}\n${body}`.toLowerCase();

  // 1️⃣ Strong billing indicators
  const billingKeywords = [
    "subscription",
    "billing",
    "charged",
    "payment",
    "invoice",
    "renewal",
    "auto-renew",
    "trial",
    "expires",
    "upgrade",
    "paid",
  ];

  // 2️⃣ Known subscription services
  const services = [
    "netflix",
    "spotify",
    "amazon prime",
    "google cloud",
    "youtube premium",
    "coursera",
    "notion",
    "chatgpt",
    "openai",
    "github",
    "figma",
    "canva",
  ];

  // 3️⃣ Advertisement / noise blockers
  const noiseKeywords = [
    "hiring",
    "internship",
    "job",
    "ppis",
    "win",
    "resume",
    "opportunity",
    "contest",
    "sale",
    "offer",
    "discount",
    "security alert",
    "new sign-in",
    "invited you",
    "invitation",
  ];

  // ❌ Block obvious noise
  if (noiseKeywords.some(k => text.includes(k))) {
    return {
      is_relevant: false,
      service: null,
      amount: null,
    };
  }

  // ✅ Must have billing intent
  const hasBilling = billingKeywords.some(k => text.includes(k));

  // ✅ Must mention known service
  const service = services.find(s => text.includes(s)) || null;

  if (!hasBilling || !service) {
    return {
      is_relevant: false,
      service: null,
      amount: null,
    };
  }

  // 💰 Extract amount (₹ or $)
  const amountMatch = text.match(/₹\s?\d+|\$\s?\d+/);

  return {
    is_relevant: true,
    service,
    amount: amountMatch ? amountMatch[0] : null,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20",
      {
        cache: "no-store",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );
    
    if (!listRes.ok) {
      const errorText = await listRes.text();
      console.error("Gmail List API Error (Process):", listRes.status, errorText);
       // Throw to catch block or handle gracefully
       throw new Error(`Gmail API returned ${listRes.status}: ${errorText}`);
    }

    const listData = await listRes.json();
    const messages = listData.messages || [];

    if (messages.length === 0) {
      return Response.json({ count: 0, results: [] });
    }

    const results = await Promise.all(
      messages.map(async (msg: any) => {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
          {
            cache: "no-store",
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );

        if (!detailRes.ok) {
           return {
             id: msg.id,
             snippet: "",
             subject: "Error fetching",
             from: "",
             analysis: { is_relevant: false, service: null, amount: null }
           };
        }

        const detail = await detailRes.json();
        const headers = detail.payload?.headers || [];
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const snippet = detail.snippet || "";

        const analysis = analyzeEmail(snippet, subject);

        return {
          id: msg.id,
          snippet,
          subject,
          from,
          analysis,
        };
      })
    );

    const subscriptions = results.filter((r) => r.analysis.is_relevant);
    console.log(`Processed ${results.length} emails. Found ${subscriptions.length} subscriptions.`);

    return Response.json({
      count: subscriptions.length,
      results: subscriptions,
    });
  } catch (error) {
    console.error("Error processing emails:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

