import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    message: "Gmail + Gemini API workspace prepared",
  });
}
