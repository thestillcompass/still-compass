
"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type Props = {
  journeySlug: string;
  journeyTitle: string;
};

type Draft = {
  text: string;
};

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

  const draftKey = `still-compass-journey-${journeySlug}`;
  const pendingKey = `${draftKey}-pending`;

  async function saveReflection(userIdToSave: string, text: string) {
    const { error } = await supabaseClient
      .from("journey_reflections")
      .upsert(
        {
          user_id: userIdToSave,
          journey_slug: journeySlug,
          journey_title: journeyTitle,
          reflection_text: text,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,journey_slug" }
      );

    if (error) throw error;
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const stored = localStorage.getItem(draftKey);
        const draft: Draft | null = stored
          ? JSON.parse(stored)
          : null;

        const pending = localStorage.getItem(pendingKey) === "true";

        const { data } = await supabaseClient.auth.getUser();
        const user = data.user;

        if (!active) return;

        if (user) {
          setUserId(user.id);

          if (pending && draft?.text.trim()) {
            await saveReflection(user.id, draft.text);

            if (!active) return;

            setReflection(draft.text);
            localStorage.removeItem(pendingKey);
            localStorage.removeItem(draftKey);
            setMessage("Your reflection has been saved privately.");
          } else {
            const { data: existing, error } = await supabaseClient
              .from("journey_reflections")
              .select("reflection_text")
              .eq("user_id", user.id)
              .eq("journey_slug", journeySlug)
              .maybeSingle();

            if (error) throw error;
            if (!active) return;

            setReflection(
              existing?.reflection_text ?? draft?.text ?? ""
            );
          }
        } else {
          setReflection(draft?.text ?? "");
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setMessage(
            "We could not load or save your reflection. Your draft may still be available in this browser."
          );
        }
      } finally {
        if (active) setBusy(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
    // Initialization belongs to this journey instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeySlug, journeyTitle, draftKey, pendingKey]);

  function updateReflection(value: string) {
    setReflection(value);
    setMessage("");

    localStorage.setItem(
      draftKey,
      JSON.stringify({ text: value })
    );
  }

  async function handleSave() {
    if (!reflection.trim()) {
      setMessage("Write a reflection before saving.");
      return;
    }

    localStorage.setItem(
      draftKey,
      JSON.stringify({ text: reflection })
    );

    if (!userId) {
      setShowSignIn(true);
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      await saveReflection(userId, reflection);
      localStorage.removeItem(draftKey);
      localStorage.removeItem(pendingKey);
      setMessage("Your reflection has been saved privately.");
    } catch (error) {
      console.error(error);
      setMessage("Saving failed. Your draft is still in this browser.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMagicLink() {
    if (!email.trim()) return;

    setBusy(true);
    setMessage("");

    try {
      const nextPath =
        `${window.location.pathname}${window.location.search}`;

      const callbackUrl =
        `${window.location.origin}/auth/callback?next=` +
        encodeURIComponent(nextPath);

      const { error } = await supabaseClient.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callbackUrl,
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      localStorage.setItem(pendingKey, "true");

      setMessage(
        "Check your email for your sign-in link. Open it in this browser to return to your reflection."
      );
    } catch (error) {
      console.error(error);
      setMessage("We could not send the link. Please try again.");
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
        You can begin writing without signing in. Take your
        time and reflect on whichever question spoke to you.
      </p>

      <textarea
        value={reflection}
        onChange={(event) => updateReflection(event.target.value)}
        rows={7}
        disabled={busy}
        placeholder="Lord, this is what I am walking through right now..."
        className="mt-6 w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-4 leading-7 text-[#23303D] outline-none focus:border-[#C89B3C]"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="mt-4 rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Please wait..." : "Save this reflection"}
      </button>

      <p className="mt-3 text-sm leading-6 text-[#23303D]/65">
        Your saved reflection is private to your account.
        No one else using The Still Compass can see it.
      </p>

      {!userId && (
        <p className="mt-2 text-sm leading-6 text-[#23303D]/65">
          No password needed. We will send you a private
          email sign-in link when you choose to save.
        </p>
      )}

      {showSignIn && !userId && (
        <div className="mt-6 rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-5">
          <h3 className="text-xl font-semibold text-[#2C3E50]">
            Save your reflection privately
          </h3>

          <label
            htmlFor="journey-email"
            className="mt-4 block text-sm font-semibold text-[#2C3E50]"
          >
            Email address
          </label>

          <input
            id="journey-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-[#C89B3C]/25 bg-white px-4 py-3 outline-none"
          />

          <button
            type="button"
            onClick={sendMagicLink}
            disabled={busy || !email.trim()}
            className="mt-4 rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send my sign-in link
          </button>
        </div>
      )}

      {message && (
        <p role="status" className="mt-4 text-sm leading-7 text-[#2C3E50]">
          {message}
        </p>
      )}
    </section>
  );
}
