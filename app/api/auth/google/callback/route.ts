import { signOpaqueToken } from "@/lib/token";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const base = process.env.PUBLIC_BASE_URL ?? url.origin;

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  const savedNonce = cookieStore.get("oauth_nonce")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/?error=state", base));
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=exchange", base));
  }
  const tokenJson = await tokenRes.json();
  const rawIdToken = tokenJson.id_token as string | undefined;
  if (!rawIdToken) {
    return NextResponse.redirect(new URL("/?error=no_id", base));
  }

  const jwks = jose.createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs")
  );
  const { payload } = await jose.jwtVerify(rawIdToken, jwks, {
    issuer: "https://accounts.google.com",
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  if (payload.nonce !== savedNonce) {
    return NextResponse.redirect(new URL("/?error=nonce", base));
  }

  const email = String(payload.email ?? "");
  const emailVerified = Boolean(payload.email_verified);
  const allowed = (
    process.env.ALLOWED_DOMAIN ?? "student.chula.ac.th"
  ).toLowerCase();
  if (!emailVerified || !email.toLowerCase().endsWith("@" + allowed)) {
    return NextResponse.redirect(new URL("/?error=not_chula", base));
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(
    1,
    parseInt(process.env.TOKEN_TTL_SECONDS ?? "3600", 10)
  ); // default 1h
  const exp = now + ttl;
  const token = signOpaqueToken({ iat: now, exp }, process.env.TOKEN_SECRET!);

  const urlOut = new URL("/token", base);
  urlOut.hash = `token=${encodeURIComponent(token)}`;

  const res = NextResponse.redirect(urlOut, { status: 302 });
  res.cookies.set("oauth_state", "", { path: "/", expires: new Date(0) });
  res.cookies.set("oauth_nonce", "", { path: "/", expires: new Date(0) });

  return res;
}
