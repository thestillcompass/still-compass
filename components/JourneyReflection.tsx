
"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type Props = {
  journeySlug: string;
  journeyTitle: string;
};

type PendingDraft = {
  text: string;
  email: string;
  createdAt: number;
};

const DRAFT_LIFETIME_MS = 30 * 60 * 1000;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export default function JourneyReflection({
  journeySlug,
  journeyTitle,
}: Props) {
  const [reflection, setReflection] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  const requestVersion = useRef(0);
  const accountIdRef = useRef<string | null>(null);

  const pendingKey =
    `still-compass-journey-${journeySlug}-pending-v2`;

  // Remove the older, unscoped browser drafts.
  const legacyDraftKey =
    `still-compass-journey-${journeySlug}`;

  const legacyPendingKey =
    `${legacyDraftKey}-pending`;

  async function saveReflection(
    ownerId: string,
    text: string
  ) {
    const { error } = await supabaseClient
      .from("journey_reflections")
      .upsert(
        {
          user_id: ownerId,
          journey_slug: journeySlug,
          journey_title: journeyTitle,
          reflection_text: text,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,journey_slug",
        }
      );

    if (error) {
      throw error;
    }
  }

  useEffect(() => {
    let active = true;
    const version = ++requestVersion.current;

    function isCurrent() {
      return active && requestVersion.current === version;
    }

    async function initialize() {
      try {
        // These keys came from the older implementation,
        // where browser drafts were not account-specific.
        // We intentionally do not restore them.
        localStorage.removeItem(legacyDraftKey);
        localStorage.removeItem(legacyPendingKey);

        const {
          data: { user },
          error: authError,
        } = await supabaseClient.auth.getUser();

        if (!isCurrent()) return;

        if (authError || !user) {
          setUserId(null);
          accountIdRef.current = null;
          setReflection("");
          setBusy(false);
          return;
        }
        accountIdRef.current = user.id;
        setUserId(user.id);

        const pendingRaw = localStorage.getItem(pendingKey);

        let pending: PendingDraft | null = null;

        if (pendingRaw) {
          try {
            pending = JSON.parse(pendingRaw) as PendingDraft;
          } catch {
            localStorage.removeItem(pendingKey);
          }
        }

        const pendingIsValid =
          pending !== null &&
          typeof pending.text === "string" &&
          typeof pending.email === "string" &&
          typeof pending.createdAt === "number" &&
          pending.createdAt <= Date.now() &&
          Date.now() - pending.createdAt <
            DRAFT_LIFETIME_MS &&
          normalizeEmail(pending.email) ===
            normalizeEmail(user.email || "");

        if (pending && !pendingIsValid) {
          localStorage.removeItem(pendingKey);
          pending = null;
        }

        if (pending && pendingIsValid) {
          await saveReflection(user.id, pending.text);

          if (!isCurrent()) return;

          setReflection(pending.text);
          localStorage.removeItem(pendingKey);
          setMessage(
            "Your reflection has been saved privately."
          );
        } else {
          const {
            data: existing,
            error: loadError,
          } = await supabaseClient
            .from("journey_reflections")
            .select("reflection_text")
            .eq("user_id", user.id)
            .eq("journey_slug", journeySlug)
            .maybeSingle();

          if (loadError) throw loadError;
          if (!isCurrent()) return;

          setReflection(existing?.reflection_text ?? "");
        }
      } catch (error) {
        console.error("Journey initialization failed:", error);

        if (isCurrent()) {
          setMessage(
            "We could not load or save your reflection. Please try refreshing."
          );
        }
      } finally {
        if (isCurrent()) {
          setBusy(false);
        }
      }
    }

    void initialize();

    const { data: authListener } =
      supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          // Do not make awaited Supabase calls inside
          // this callback.
          if (event === "SIGNED_OUT") {
            requestVersion.current += 1;
            accountIdRef.current = null;

            localStorage.removeItem(pendingKey);
            localStorage.removeItem(legacyDraftKey);
            localStorage.removeItem(legacyPendingKey);

            setUserId(null);
            setReflection("");
            setEmail("");
            setShowSignIn(false);
            setMessage("");
            setBusy(false);
          }

          if (
            event === "SIGNED_IN" &&
            session?.user &&
            accountIdRef.current !== null &&
            session.user.id !== accountIdRef.current
          ) {
            // Do not display an earlier account's text
            // when the authenticated account changes.
            requestVersion.current += 1;
            setUserId(null);
            setReflection("");
            setBusy(true);

            // Reinitialize the component with a reload.
            window.location.reload();
          }
        }
      );

    return () => {
      active = false;
      requestVersion.current += 1;
      authListener.subscription.unsubscribe();
    };
    // Initialization is associated with this journey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeySlug, journeyTitle, pendingKey]);

  async function handleSave() {
    if (!reflection.trim()) {
      setMessage("Write a reflection before saving.");
      return;
    }

    setMessage("");

    if (!userId) {
      setShowSignIn(true);
      return;
    }

    setBusy(true);

    try {
      // Verify that the authenticated account has not
      // changed since the reflection was loaded.
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();

      if (
        authError ||
        !user ||
        user.id !== userId
      ) {
        setReflection("");
        setUserId(null);
        setShowSignIn(false);
        setMessage(
          "Your account session changed. Please sign in again before saving."
        );
        return;
      }

      await saveReflection(user.id, reflection);

      setMessage(
        "Your reflection has been saved privately."
      );
    } catch (error) {
      console.error("Journey save failed:", error);

      setMessage(
        "We could not save your reflection. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendMagicLink() {
    const targetEmail = normalizeEmail(email);

    if (!targetEmail || !reflection.trim()) return;

    setBusy(true);
    setMessage("");

    try {
      const pending: PendingDraft = {
        text: reflection,
        email: targetEmail,
        createdAt: Date.now(),
      };

      // If browser storage is unavailable, stop before
      // sending the email rather than losing the draft.
      localStorage.setItem(
        pendingKey,
        JSON.stringify(pending)
      );

      const nextPath =
        `${window.location.pathname}${window.location.search}`;

      const callbackUrl =
        `${window.location.origin}/auth/callback?next=` +
        encodeURIComponent(nextPath);

      const { error } =
        await supabaseClient.auth.signInWithOtp({
          email: targetEmail,
          options: {
            emailRedirectTo: callbackUrl,
            shouldCreateUser: true,
          },
        });

      if (error) {
        localStorage.removeItem(pendingKey);
        throw error;
      }

      setShowSignIn(false);

      setMessage(
        "Check your email. Open the sign-in link in this browser to return to your reflection."
      );
    } catch (error) {
      console.error("Magic-link request failed:", error);

      setMessage(
        "We could not prepare your sign-in link. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
        Your private reflection
      </p>

      <h2 className="mt-4 text-3xl font-semibold text-[#2C3E50]">
        What are you carrying through this valley?
      </h2>

      <p className="mt-4 leading-8 text-[#23303D]/75">
        Write freely. You only need to sign in when
        you choose to save.
      </p>

      <textarea
        value={reflection}
        onChange={(event) => {
          setReflection(event.target.value);
          setMessage("");
        }}
        rows={7}
        disabled={busy}
        placeholder="Lord, this is what I am walking through right now..."
        className="mt-6 w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-4 leading-7 text-[#23303D] outline-none focus:border-[#C89B3C]"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="mt-4 rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Please wait..." : "Save this reflection"}
      </button>

      <p className="mt-3 text-sm leading-6 text-[#23303D]/65">
        Saved reflections are private to your account.
        Unsaved text is not stored permanently.
      </p>

      {!userId && (
        <p className="mt-2 text-sm leading-6 text-[#23303D]/65">
          No password needed. A private sign-in link
          will be sent to your email.
        </p>
      )}

      {showSignIn && !userId && (
        <div className="mt-6 rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-5">
          <h3 className="text-xl font-semibold text-[#2C3E50]">
            Save your reflection
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#23303D]/70">
            Your reflection will be temporarily kept
            in this browser while you complete sign-in.
            Use the same browser to open your email link.
          </p>

          <label
            htmlFor="journey-email"
            className="mt-4 block text-sm font-semibold text-[#2C3E50]"
          >
            Email address
          </label>

          <input
            id="journey-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-[#C89B3C]/25 bg-white px-4 py-3 outline-none"
          />

          <button
            type="button"
            disabled={busy || !email.trim()}
            onClick={sendMagicLink}
            className="mt-4 rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Send my sign-in link
          </button>
        </div>
      )}

      {message && (
        <p
          role="status"
          className="mt-4 text-sm leading-7 text-[#2C3E50]"
        >
          {message}
        </p>
      )}
    </section>
  );
}
