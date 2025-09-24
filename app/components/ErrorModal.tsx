"use client";

import { useEffect } from "react";

/** error → message mapping */
const ERROR_COPY: Record<
  string,
  { title: string; desc: string; hint?: string }
> = {
  state: {
    title: "Invalid state",
    desc: "The request is expired or unsafe (state mismatch).",
    hint: "Start again from the “Continue with Google” button.",
  },
  exchange: {
    title: "Token exchange failed",
    desc: "Failed to exchange the authorization code for a token.",
    hint: "This may be a network issue. Please try again.",
  },
  no_id: {
    title: "Missing ID token",
    desc: "No ID token was received from Google.",
    hint: "Check your Google account permissions and retry.",
  },
  nonce: {
    title: "Invalid nonce",
    desc: "Replay protection (nonce) did not match.",
    hint: "Refresh the page and sign in again.",
  },
  not_chula: {
    title: "Not a Chula student email",
    desc: "The email is not @student.chula.ac.th or has not been verified.",
    hint: "Use your Chula student email and ensure it is verified with Google.",
  },
};

function getCopy(code: string | null) {
  if (!code) return null;
  return (
    ERROR_COPY[code] ?? {
      title: "Sign-in error",
      desc: `An error occurred (${code}).`,
      hint: "Try starting a new session.",
    }
  );
}

export function ErrorModal({
  errorCode,
  onClose,
}: {
  errorCode: string | null;
  onClose: () => void;
}) {
  const copy = getCopy(errorCode);
  if (!copy) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="error-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/10">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M12 2 1 21h22L12 2Zm0 4.8L19 19H5l7-12.2ZM11 10h2v5h-2v-5Zm0 6h2v2h-2v-2Z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 id="error-title" className="text-base font-semibold">
              {copy.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-700">{copy.desc}</p>
            {copy.hint && (
              <p className="mt-2 text-xs text-neutral-600">Hint: {copy.hint}</p>
            )}
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-neutral-100 active:scale-[0.98]"
          >
            {/* X icon (plain SVG) */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium hover:shadow-sm"
          >
            Close
          </button>
          <a
            href="/api/auth/google/start"
            className="inline-flex items-center rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Retry Sign-in
          </a>
        </div>
      </div>
    </div>
  );
}
