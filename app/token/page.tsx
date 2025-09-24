"use client";
import { useEffect, useState } from "react";

export default function TokenPage() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const t = params.get("token");
    if (t) {
      setToken(t);
      history.replaceState(null, "", "/token");
    }
  }, []);

  const onCopy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      // auto-dismiss after 1.5s
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback if clipboard API blocked
      try {
        const ta = document.createElement("textarea");
        ta.value = token;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // ignore
      }
    }
  };

  return (
    <main className="">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Your token</h1>

        {token ? (
          <div className="mt-6 space-y-4">
            <div className="relative rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <textarea
                className="w-full h-48 border rounded-lg p-3 font-mono text-sm"
                readOnly
                value={token}
              />

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-sm text-neutral-700">
                  This token contains only <code>iat</code> and <code>exp</code>
                  , and is HMAC-signed. Keep it safe; it remains valid until it
                  expires{" "}
                  <span className="whitespace-nowrap">
                    ({process.env.NEXT_PUBLIC_TOKEN_TTL ?? "default: 1 hour"}).
                  </span>
                </div>

                <button
                  onClick={onCopy}
                  className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:shadow-md active:scale-[0.99] transition"
                  aria-label="Copy token"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z" />
                  </svg>
                  Copy
                </button>
              </div>

              {/* Toast */}
              <div
                className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 transition-all ${
                  copied
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                }`}
                aria-live="polite"
              >
                <div className="rounded-full bg-black text-white px-3 py-1 text-xs shadow-md">
                  Copied
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/70 px-4 py-3 text-xs shadow-sm ring-1 ring-black/5">
              Tip: tokens are anonymous by design. If you need to prove
              validity, use the{" "}
              <a className="underline" href="/verify">
                Verifier
              </a>
              .
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <p>
              No token found. Start a new sign-in from{" "}
              <a className="underline" href="/">
                Home
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
