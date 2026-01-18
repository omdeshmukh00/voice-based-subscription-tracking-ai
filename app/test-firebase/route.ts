import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  await db.collection("test").add({
    message: "Firebase connected",
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
