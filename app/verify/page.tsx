"use client";
import { useState } from "react";

type VerifyOk = { ok: true; payload: { iat: number; exp: number } };
type VerifyErr = { ok: false; error: string };
type VerifyResponse = VerifyOk | VerifyErr;

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const [res, setRes] = useState<VerifyResponse | null>(null); // ✅ no any
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data: VerifyResponse = await r.json(); // ✅ typed
      setRes(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Verify Token</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Paste a token to verify its signature and expiry. No data is stored.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <label className="text-sm font-medium">Token</label>
            <textarea
              className="mt-2 h-48 w-full rounded-lg border p-3 font-mono text-sm"
              value={token}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setToken(e.target.value)
              } // ✅ typed event (optional butดี)
              placeholder="paste your token here"
            />
            <button
              onClick={check}
              disabled={loading || !token.trim()}
              className="mt-3 inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? "Checking…" : "Check"}
            </button>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <label className="text-sm font-medium">Result</label>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg border p-3 text-sm">
              {res ? JSON.stringify(res, null, 2) : "—"}
            </pre>
            <div className="mt-2 text-xs text-neutral-600">
              Expected: <code>{`{ ok: true, payload: { iat, exp } }`}</code> if
              valid and unexpired.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
