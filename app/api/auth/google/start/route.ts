import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const state = crypto.randomBytes(24).toString("base64url");
  const nonce = crypto.randomBytes(24).toString("base64url");

  const redirectUri = process.env.GOOGLE_REDIRECT_URL!;
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const scope = encodeURIComponent("openid email");

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&nonce=${nonce}`;

  const res = NextResponse.redirect(authUrl, { status: 302 });
  const exp = new Date(Date.now() + 10 * 60 * 1000);
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp,
    path: "/",
  });
  res.cookies.set("oauth_nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: exp,
    path: "/",
  });

  return res;
}
