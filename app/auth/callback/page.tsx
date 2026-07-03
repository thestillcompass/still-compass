"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    async function completeSignIn() {
      const nextPath = searchParams.get("next") || "/";

      try {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error(error);
          setMessage("We could not complete your sign-in. Please try again.");
          return;
        }

        router.replace(nextPath);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while signing you in.");
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
      </div>
    </main>
  );
}