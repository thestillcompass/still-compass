import { Suspense } from "react";
import AuthCallbackClient from "../../../components/AuthCallbackClient";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAF6F1] px-6 text-[#23303D]">
          <div className="max-w-md rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.22em] text-[#C89B3C]">
              The Still Compass
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
              Signing you in...
            </h1>

            <p className="mt-4 leading-7 text-[#23303D]/70">
              You can return to your reflection in just a moment.
            </p>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}