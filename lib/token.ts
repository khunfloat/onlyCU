// lib/token.ts
import { createHmac, timingSafeEqual } from "crypto";

const b64u = {
  encode: (buf: Buffer) =>
    buf
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, ""),
  decode: (str: string) =>
    Buffer.from(
      str.replace(/-/g, "+").replace(/_/g, "/") +
        "==".slice((2 - ((str.length * 3) % 4)) % 4),
      "base64"
    ),
};

export type Payload = { iat: number; exp: number };

export function signOpaqueToken(payload: Payload, secret: string) {
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64u.encode(Buffer.from(payloadStr));
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = b64u.encode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyOpaqueToken(
  token: string,
  secret: string
): { ok: true; payload: Payload } | { ok: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "format" };
  const [payloadB64, sigB64] = parts;
  try {
    const expectSig = createHmac("sha256", secret).update(payloadB64).digest();
    const gotSig = b64u.decode(sigB64);

    if (
      expectSig.length !== gotSig.length ||
      !timingSafeEqual(expectSig, gotSig)
    ) {
      return { ok: false, reason: "signature" };
    }

    const payload = JSON.parse(b64u.decode(payloadB64).toString()) as Payload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return { ok: false, reason: "expired" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "payload" };
  }
}
