import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  const snapshot = await db.collection("transactions").orderBy("date", "desc").get();

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return Response.json({
    success: true,
    total: data.length,
    data,
  });
}
