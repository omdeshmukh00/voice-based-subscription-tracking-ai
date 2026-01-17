import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 1. Fetch message IDs
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!listRes.ok) {
    const errorText = await listRes.text();
    console.error("Gmail List API Error:", listRes.status, errorText);
    return new Response(`Gmail API Error: ${listRes.status} ${errorText}`, {
      status: listRes.status,
    });
  }

  const listData = await listRes.json();
  console.log("Gmail List Data:", JSON.stringify(listData, null, 2));

  const messages = listData.messages ?? [];
  console.log("Message Count:", messages.length);

if (messages.length === 0) {
  return Response.json([]);
}

const emails = await Promise.all(
  messages.map(async (msg: any) => {
    const detailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const detail = await detailRes.json();
    const headers = detail.payload?.headers || [];

    const subject = headers.find((h: any) => h.name === "Subject")?.value;
    const from = headers.find((h: any) => h.name === "From")?.value;
    const date = headers.find((h: any) => h.name === "Date")?.value;

    return {
      id: msg.id,
      subject,
      from,
      date,
      snippet: detail.snippet,
    };
  })
);



  return Response.json(emails);
}
