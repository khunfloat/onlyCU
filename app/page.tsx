"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ErrorModal } from "./components/ErrorModal";

export default function LoginPage() {
  const auditRepo = process.env.NEXT_PUBLIC_AUDIT_REPO || "#";

  const router = useRouter();
  const sp = useSearchParams();
  const errorCode = sp.get("error");

  const closeModal = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    const next =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams}` : "") +
      url.hash;
    router.replace(next);
  }, [router]);

  return (
    <main className="">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Stateless | Anonymous | Auditable
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            OnlyCU — Keep It Chula. Keep It Anonymous.
          </h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-neutral-700">
            We verify your{" "}
            <span className="font-medium">@student.chula.ac.th</span> email via
            Google and issue a short-lived token that contains{" "}
            <em>no personal data</em>. No databases. No tracking. Just
            cryptographic receipts.
          </p>

          <div className="mt-6">
            <a
              href="/api/auth/google/start"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow-md active:scale-[0.99] transition"
            >
              <svg aria-hidden className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v2.9h5.3c-.23 1.5-1.8 4.4-5.3 4.4a6.1 6.1 0 1 1 0-12.2 5.3 5.3 0 0 1 3.76 1.48l2-1.93A8.6 8.6 0 1 0 12 20.6c4.95 0 8.2-3.47 8.2-8.36 0-.56-.06-1.1-.17-1.6Z"
                />
              </svg>
              Continue with Google
            </a>
          </div>

          <p className="text-xs text-neutral-600 mt-3">
            By continuing, you agree to receive a short-lived, anonymous token.
            No user records are stored.
          </p>
        </header>

        {/* Feature grid */}
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Anonymous by design"
            desc="Tokens include only issue/expiry timestamps — no email, no subject, no identifiers."
            icon={<ShieldIcon />}
          />
          <FeatureCard
            title="Chula-only gate"
            desc="Access requires a verified @student.chula.ac.th email via Google OpenID Connect."
            icon={<KeyIcon />}
          />
          <FeatureCard
            title="Stateless & simple"
            desc="No database, no sessions. Each token is HMAC-signed and expires quickly."
            icon={<BoltIcon />}
          />
          <FeatureCard
            title="Open source & auditable"
            desc={
              <>
                Browse the code and verify the claims yourself.{" "}
                <a
                  href={auditRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  GitHub (Audit)
                </a>
              </>
            }
            icon={<CodeIcon />}
          />
        </section>

        {/* How it works */}
        <section className="mt-12 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-3 space-y-2 text-sm text-neutral-700 list-decimal list-inside">
            <li>
              Click “Continue with Google.” You’re redirected to Google’s
              consent screen.
            </li>
            <li>
              Google returns an ID token; we verify its signature and email
              domain.
            </li>
            <li>
              We issue a short-lived token containing only <code>iat</code> and{" "}
              <code>exp</code>.
            </li>
            <li>
              You can present that token to services that trust this verifier.
            </li>
          </ol>
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#F6D9E1] px-3 py-1 text-xs">
            <span className="font-medium">Privacy note:</span> we do not store
            any user data.
          </div>
        </section>
      </div>

      {/* Error Modal */}
      {errorCode && <ErrorModal errorCode={errorCode} onClose={closeModal} />}
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-neutral-700">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2 4 6v6c0 5 3.8 9.4 8 10 4.2-.6 8-5 8-10V6l-8-4Zm0 18c-2.9-.6-6-3.9-6-8V7.2L12 4l6 3.2V12c0 4.1-3.1 7.4-6 8Z"
      />
      <path
        fill="currentColor"
        d="M10.3 14.7 8.6 13l-1.2 1.2 2.9 2.9 5.3-5.3-1.2-1.2-4 4Z"
      />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 3a7 7 0 1 0 6.9 8.2l1.7-1.7-1.4-1.4-1 1A7 7 0 0 0 14 3Zm0 2a5 5 0 1 1-4.9 6h2.4l1.5 1.5 1.4-1.4L13 11V9h-2v2H8.1A5 5 0 0 1 14 5Z"
      />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="m8.6 7.4-1.2-1.2L2.6 11l4.8 4.8 1.2-1.2L5 11l3.6-3.6Zm6.8 0L19 11l-3.6 3.6 1.2 1.2L21.4 11l-4.8-4.8-1.2 1.2ZM14 3l-4 18h2l4-18h-2Z"
      />
    </svg>
  );
}
