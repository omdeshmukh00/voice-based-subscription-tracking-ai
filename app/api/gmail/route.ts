import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 1. Fetch message IDs
  const listRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=payment OR invoice OR subscription&maxResults=10",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const listData = await listRes.json();

  // 2. Fetch details for each message
  const emails = await Promise.all(
    listData.messages.map(async (msg: any) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const detail = await detailRes.json();

      const headers = detail.payload.headers;

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
