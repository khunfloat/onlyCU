import { Suspense } from "react";
import LoginPage from "./LoginPage.client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-neutral-500">Loading…</div>}
    >
      <LoginPage />
    </Suspense>
  );
}
