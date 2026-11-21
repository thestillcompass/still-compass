
"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { startGoogleSignIn } from "@/lib/googleSignIn";

type Props = {
  journeySlug: string;
  journeyTitle: string;
};

type EmailDraft = {
  text: string;
  email: string;
  createdAt: number;
};

type GoogleDraft = {
  text: string;
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
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [googleDraft, setGoogleDraft] =
    useState<GoogleDraft | null>(null);

  const requestVersion = useRef(0);
  const accountIdRef = useRef<string | null>(null);

  const emailPendingKey =
    `still-compass-journey-${journeySlug}-pending-v2`;

  const googlePendingKey =
    `still-compass-google-draft-${journeySlug}-v1`;

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

    if (error) throw error;
  }

  useEffect(() => {
    let active = true;
    const version = ++requestVersion.current;

    function isCurrent() {
      return (
        active &&
        requestVersion.current === version
      );
    }

    async function initialize() {
      try {
        // Discard older drafts that were not
        // associated with an account.
        localStorage.removeItem(legacyDraftKey);
        localStorage.removeItem(legacyPendingKey);

        const {
          data: { user },
          error: authError,
        } = await supabaseClient.auth.getUser();

        if (!isCurrent()) return;

        if (authError || !user) {
          accountIdRef.current = null;
          setUserId(null);
          setUserEmail("");
          setReflection("");
          setGoogleDraft(null);
          return;
        }

        accountIdRef.current = user.id;
        setUserId(user.id);
        setUserEmail(user.email || "");

        // Google drafts are kept in sessionStorage
        // for this browser tab, not localStorage.
        const googleRaw =
          sessionStorage.getItem(googlePendingKey);

        let pendingGoogle: GoogleDraft | null = null;

        if (googleRaw) {
          try {
            const parsed = JSON.parse(googleRaw);

            if (
              typeof parsed?.text === "string" &&
              typeof parsed?.createdAt === "number" &&
              parsed.createdAt <= Date.now() &&
              Date.now() - parsed.createdAt <
                DRAFT_LIFETIME_MS
            ) {
              pendingGoogle = parsed;
            } else {
              sessionStorage.removeItem(
                googlePendingKey
              );
            }
          } catch {
            sessionStorage.removeItem(
              googlePendingKey
            );
          }
        }

        // Restore the user's existing saved entry.
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

        // A pending Google draft is never
        // automatically written to Supabase.
        if (pendingGoogle) {
          setReflection(
            existing?.reflection_text ?? ""
          );
          setGoogleDraft(pendingGoogle);
          setMessage(
            "Google sign-in completed. Review your draft before saving it."
          );
          return;
        }

        const emailRaw =
          localStorage.getItem(emailPendingKey);

        let pendingEmail: EmailDraft | null = null;

        if (emailRaw) {
          try {
            const parsed = JSON.parse(emailRaw);

            const isValid =
              typeof parsed?.text === "string" &&
              typeof parsed?.email === "string" &&
              typeof parsed?.createdAt === "number" &&
              parsed.createdAt <= Date.now() &&
              Date.now() - parsed.createdAt <
                DRAFT_LIFETIME_MS &&
              normalizeEmail(parsed.email) ===
                normalizeEmail(user.email || "");

            if (isValid) {
              pendingEmail = parsed;
            } else {
              localStorage.removeItem(
                emailPendingKey
              );
            }
          } catch {
            localStorage.removeItem(
              emailPendingKey
            );
          }
        }

        if (pendingEmail) {
          // Preserve the previously tested
          // email magic-link save behavior.
          await saveReflection(
            user.id,
            pendingEmail.text
          );

          if (!isCurrent()) return;

          localStorage.removeItem(
            emailPendingKey
          );

          setReflection(pendingEmail.text);
          setMessage(
            "Your reflection has been saved privately."
          );
        } else {
          setReflection(
            existing?.reflection_text ?? ""
          );
        }
      } catch (error) {
        console.error(
          "Journey initialization failed:",
          error
        );

        if (isCurrent()) {
          setMessage(
            "We could not load your reflection. Please refresh and try again."
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
          if (event === "SIGNED_OUT") {
            requestVersion.current += 1;
            accountIdRef.current = null;

            localStorage.removeItem(
              emailPendingKey
            );
            localStorage.removeItem(
              legacyDraftKey
            );
            localStorage.removeItem(
              legacyPendingKey
            );
            sessionStorage.removeItem(
              googlePendingKey
            );

            setUserId(null);
            setUserEmail("");
            setReflection("");
            setGoogleDraft(null);
            setEmail("");
            setShowSignIn(false);
            setMessage("");
            setBusy(false);
          }

          if (
            event === "SIGNED_IN" &&
            session?.user &&
            accountIdRef.current !== null &&
            session.user.id !==
              accountIdRef.current
          ) {
            requestVersion.current += 1;
            accountIdRef.current = null;
            setUserId(null);
            setUserEmail("");
            setReflection("");
            setGoogleDraft(null);
            setBusy(true);

            window.location.reload();
          }
        }
      );

    return () => {
      active = false;
      requestVersion.current += 1;
      authListener.subscription.unsubscribe();
    };
    // This effect initializes the current journey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    journeySlug,
    journeyTitle,
    emailPendingKey,
    googlePendingKey,
  ]);

  async function handleSave() {
    if (googleDraft) {
      setMessage(
        "Choose Restore draft or Discard draft before saving."
      );
      return;
    }

    if (!reflection.trim()) {
      setMessage(
        "Write a reflection before saving."
      );
      return;
    }

    setMessage("");

    if (!userId) {
      setShowSignIn(true);
      return;
    }

    setBusy(true);

    try {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (
        error ||
        !user ||
        user.id !== userId
      ) {
        setReflection("");
        setUserId(null);
        setUserEmail("");
        setMessage(
          "Your account session changed. Please sign in again."
        );
        return;
      }

      await saveReflection(
        user.id,
        reflection
      );

      setMessage(
        "Your reflection has been saved privately."
      );
    } catch (error) {
      console.error(
        "Journey save failed:",
        error
      );

      setMessage(
        "Saving failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!reflection.trim()) {
      setMessage(
        "Write a reflection before continuing."
      );
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const draft: GoogleDraft = {
        text: reflection,
        createdAt: Date.now(),
      };

      // A Google login must not accidentally
      // trigger a previous email-draft save.
      localStorage.removeItem(emailPendingKey);

      sessionStorage.setItem(
        googlePendingKey,
        JSON.stringify(draft)
      );

      const returnPath =
        `${window.location.pathname}` +
        `${window.location.search}`;

      await startGoogleSignIn(returnPath);
    } catch (error) {
      console.error(
        "Google sign-in failed:",
        error
      );

      sessionStorage.removeItem(
        googlePendingKey
      );

      setMessage(
        "Google sign-in could not start. You can try again or use email."
      );
      setBusy(false);
    }
  }

  async function sendMagicLink() {
    const targetEmail =
      normalizeEmail(email);

    if (
      !targetEmail ||
      !reflection.trim()
    ) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const pending: EmailDraft = {
        text: reflection,
        email: targetEmail,
        createdAt: Date.now(),
      };

      // Do not mix Google and email drafts.
      sessionStorage.removeItem(
        googlePendingKey
      );

      localStorage.setItem(
        emailPendingKey,
        JSON.stringify(pending)
      );

      const nextPath =
        `${window.location.pathname}` +
        `${window.location.search}`;

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

      if (error) throw error;

      setShowSignIn(false);
      setMessage(
        "Check your email. Open the sign-in link in this browser."
      );
    } catch (error) {
      console.error(
        "Magic-link request failed:",
        error
      );

      localStorage.removeItem(
        emailPendingKey
      );

      setMessage(
        "We could not send the link. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  function restoreGoogleDraft() {
    if (!googleDraft || !userId) return;

    setReflection(googleDraft.text);
    setGoogleDraft(null);

    sessionStorage.removeItem(
      googlePendingKey
    );

    setMessage(
      "Draft restored. Review it, then click Save this reflection to save it to your account."
    );
  }

  function discardGoogleDraft() {
    setGoogleDraft(null);

    sessionStorage.removeItem(
      googlePendingKey
    );

    setMessage(
      "Draft discarded. Your existing saved reflection remains unchanged."
    );
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
        Write freely. You only need to
        sign in when you choose to save.
      </p>

      {googleDraft && userId && (
        <div className="mt-6 rounded-2xl border border-[#C89B3C]/40 bg-[#FAF6F1] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
            Review your draft
          </p>

          <h3 className="mt-3 text-xl font-semibold text-[#2C3E50]">
            Confirm your account before saving
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#23303D]/75">
            You signed in as:
          </p>

          <p className="mt-1 break-all font-semibold text-[#2C3E50]">
            {userEmail}
          </p>

          <p className="mt-4 text-sm leading-7 text-[#23303D]/75">
            Your draft has not been saved to this
            account yet. Restoring it will replace
            the text currently shown in the editor.
            You can review it before saving.
          </p>

          <div className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-[#C89B3C]/20 bg-white p-4 text-sm leading-7 text-[#23303D]/80">
            {googleDraft.text}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={restoreGoogleDraft}
              className="rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white"
            >
              Restore draft
            </button>

            <button
              type="button"
              onClick={discardGoogleDraft}
              className="rounded-full border border-[#C89B3C]/40 px-5 py-3 text-sm font-semibold text-[#2C3E50]"
            >
              Discard draft
            </button>
          </div>
        </div>
      )}

      <textarea
        value={reflection}
        onChange={(event) => {
          setReflection(event.target.value);
          setMessage("");
        }}
        rows={7}
        disabled={busy || Boolean(googleDraft)}
        placeholder="Lord, this is what I am walking through right now..."
        className="mt-6 w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-4 leading-7 text-[#23303D] outline-none focus:border-[#C89B3C]"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={busy || Boolean(googleDraft)}
        className="mt-4 rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy
          ? "Please wait..."
          : "Save this reflection"}
      </button>

      <p className="mt-3 text-sm leading-6 text-[#23303D]/65">
        Saved reflections are private to your
        account. You can read freely and choose
        when something is worth saving.
      </p>

      {!userId && showSignIn && (
        <div className="mt-6 rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-5">
          <h3 className="text-xl font-semibold text-[#2C3E50]">
            Save your reflection
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#23303D]/75">
            Choose how you would like to sign in.
            Your reflection will stay available
            while you complete the process.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="mt-6 w-full rounded-full border border-[#C89B3C]/40 bg-white px-6 py-3 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#FAF6F1] disabled:opacity-50"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#C89B3C]/20" />
            <span className="text-xs text-[#23303D]/60">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-[#C89B3C]/20" />
          </div>

          <label
            htmlFor="journey-email"
            className="block text-sm font-semibold text-[#2C3E50]"
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
            onClick={sendMagicLink}
            disabled={busy || !email.trim()}
            className="mt-4 w-full rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send my sign-in link
          </button>

          <p className="mt-4 text-xs leading-6 text-[#23303D]/60">
            No password required. Email sign-in
            works with Gmail, Outlook, Yahoo,
            iCloud, and other email providers.
          </p>
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
