"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
};

export default function AuthModal({
  isOpen,
  onClose,
  redirectTo,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleMagicLinkSubmit(event: React.FormEvent) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const currentPath = `${window.location.pathname}${window.location.search}`;

const callbackUrl =
  redirectTo ||
  `${window.location.origin}/auth/callback?next=${encodeURIComponent(
    currentPath
  )}`;

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
      return;
    }

    setStatus("sent");
    setMessage("Check your email. Your private sign-in link is on its way.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#23303D]/40 px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#C89B3C]">
              Save your reflection
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2C3E50]">
              Come back to this anytime.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-xl text-[#2C3E50]/70 hover:bg-[#FAF6F1]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {status !== "sent" ? (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <p className="leading-7 text-[#23303D]/80">
              Enter your email and we’ll send you a private sign-in link. No
              password needed.
            </p>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2C3E50]">
                Email address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
              />
            </label>

            {message && (
              <p className="rounded-2xl bg-[#FAF6F1] px-4 py-3 text-sm text-[#23303D]/80">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#23303D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send private link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="rounded-2xl bg-[#FAF6F1] px-4 py-4 leading-7 text-[#23303D]/85">
              {message}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-[#2C3E50]/20 px-5 py-3 text-sm font-semibold text-[#2C3E50] hover:bg-[#FAF6F1]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}