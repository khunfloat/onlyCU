import { verifyOpaqueToken } from "@/lib/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token;
    if (!token)
      return NextResponse.json(
        { ok: false, reason: "no_token" },
        { status: 400 }
      );

    const result = verifyOpaqueToken(String(token), process.env.TOKEN_SECRET!);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json({ ok: true, payload: result.payload });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_request" },
      { status: 400 }
    );
  }
}
