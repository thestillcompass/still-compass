"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    async function completeSignIn() {
      const nextPath = searchParams.get("next") || "/";
      const code = searchParams.get("code");

      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (session?.user) {
          router.replace(nextPath);
          return;
        }

        if (!code) {
          setMessage("This sign-in link is missing its verification code.");
          setShowRetry(true);
          return;
        }

        const { error } = await supabaseClient.auth.exchangeCodeForSession(
          code
        );

        if (error) {
          console.error(error);
          setMessage(
            "We could not complete your sign-in. The link may have expired or already been used."
          );
          setShowRetry(true);
          return;
        }

        router.replace(nextPath);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while signing you in.");
        setShowRetry(true);
      }
    }

    completeSignIn();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6F1] px-6 text-[#23303D]">
      <div className="max-w-md rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-[#C89B3C]">
          The Still Compass
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
          {message}
        </h1>

        <p className="mt-4 leading-7 text-[#23303D]/70">
          You can return to your reflection in just a moment.
        </p>

        {showRetry && (
          <div className="mt-7">
            <Link
              href="/situations"
              className="inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Return to situations
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}