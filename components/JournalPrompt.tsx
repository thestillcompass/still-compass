"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AuthModal from "@/components/AuthModal";
import { supabaseClient } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

type JournalDraft = {
  reflection1: string;
  reflection2: string;
  reflection3: string;
  note: string;
};

type JournalPromptProps = {
  situationSlug: string;
  situationTitle: string;
  reflectionQuestions: string[];
};

export default function JournalPrompt({
  situationSlug,
  situationTitle,
  reflectionQuestions,
}: JournalPromptProps) {
  const [reflection1, setReflection1] = useState("");
  const [reflection2, setReflection2] = useState("");
  const [reflection3, setReflection3] = useState("");
  const [note, setNote] = useState("");
  const [hasTrackedReflectionStart, setHasTrackedReflectionStart] =
    useState(false);

  const [journalEntryId, setJournalEntryId] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [status, setStatus] = useState<
    "idle" | "loading" | "saved" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const hasHandledDraftAfterLogin = useRef(false);

  const draftStorageKey = useMemo(
    () => `still-compass-journal-draft-${situationSlug}`,
    [situationSlug]
  );

  function trackReflectionStarted() {
    if (hasTrackedReflectionStart) return;

    trackEvent("reflection_started", {
      situation_slug: situationSlug,
      situation_title: situationTitle,
    });

    setHasTrackedReflectionStart(true);
  }

  function getCurrentDraft(): JournalDraft {
    return {
      reflection1,
      reflection2,
      reflection3,
      note,
    };
  }

  function applyDraftToState(draft: JournalDraft) {
    setReflection1(draft.reflection1 || "");
    setReflection2(draft.reflection2 || "");
    setReflection3(draft.reflection3 || "");
    setNote(draft.note || "");
  }

  function saveDraftLocally() {
    if (typeof window === "undefined") return;

    const draft = getCurrentDraft();

    localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }

  function getLocalDraft(): JournalDraft | null {
    if (typeof window === "undefined") return null;

    const savedDraft = localStorage.getItem(draftStorageKey);

    if (!savedDraft) return null;

    try {
      return JSON.parse(savedDraft) as JournalDraft;
    } catch {
      localStorage.removeItem(draftStorageKey);
      return null;
    }
  }

  function clearLocalDraft() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(draftStorageKey);
  }

  async function saveJournalEntry(userId: string, draft: JournalDraft) {
    const payload = {
      user_id: userId,
      situation_slug: situationSlug,
      situation_title: situationTitle,
      reflection_1: draft.reflection1,
      reflection_2: draft.reflection2,
      reflection_3: draft.reflection3,
      note: draft.note,
      updated_at: new Date().toISOString(),
    };

    if (journalEntryId) {
      const { error } = await supabaseClient
        .from("journal_entries")
        .update(payload)
        .eq("id", journalEntryId)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      return journalEntryId;
    }

    const { data, error } = await supabaseClient
      .from("journal_entries")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data.id as string;
  }

  useEffect(() => {
    async function loadUserAndEntry() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        setIsSignedIn(false);

        const localDraft = getLocalDraft();

        if (localDraft) {
          applyDraftToState(localDraft);
          setMessage(
            "Your unsaved reflection is still here. Sign in to save it privately."
          );
        }

        return;
      }

      setIsSignedIn(true);

      const { data, error } = await supabaseClient
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("situation_slug", situationSlug)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        setStatus("error");
        setMessage("We could not load your saved reflection.");
        return;
      }

      if (data) {
        setJournalEntryId(data.id);
        setReflection1(data.reflection_1 || "");
        setReflection2(data.reflection_2 || "");
        setReflection3(data.reflection_3 || "");
        setNote(data.note || "");
      }

      const localDraft = getLocalDraft();

      if (localDraft && !hasHandledDraftAfterLogin.current) {
        hasHandledDraftAfterLogin.current = true;

        applyDraftToState(localDraft);

        try {
          setStatus("loading");
          setMessage("Saving your reflection...");

          const savedId = await saveJournalEntry(user.id, localDraft);

          setJournalEntryId(savedId);
          clearLocalDraft();

          setStatus("saved");
          setMessage("Saved. You can come back to this in My Compass.");
        } catch (saveError) {
          console.error(saveError);
          setStatus("error");
          setMessage(
            "You are signed in, but your reflection could not be saved. Please try again."
          );
        }
      }
    }

    loadUserAndEntry();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      loadUserAndEntry();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [draftStorageKey, situationSlug, situationTitle]);

  async function handleSave() {
    setStatus("idle");
    setMessage("");

    const draft = getCurrentDraft();

    const hasAnyWriting =
      draft.reflection1.trim() ||
      draft.reflection2.trim() ||
      draft.reflection3.trim() ||
      draft.note.trim();

    if (!hasAnyWriting) {
      setStatus("error");
      setMessage("Write a reflection first, then save it.");
      return;
    }

    trackEvent("reflection_save_clicked", {
      situation_slug: situationSlug,
      situation_title: situationTitle,
      signed_in: isSignedIn,
    });

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      saveDraftLocally();
      trackEvent("magic_link_prompt_shown", {
        situation_slug: situationSlug,
        situation_title: situationTitle,
      });
      setAuthModalOpen(true);
      setMessage(
        "Your reflection is held safely on this device. Sign in to save it privately."
      );
      return;
    }

    setIsSignedIn(true);
    setStatus("loading");

    try {
      const savedId = await saveJournalEntry(user.id, draft);

      setJournalEntryId(savedId);
      clearLocalDraft();

      setStatus("saved");
      setMessage("Saved. You can come back to this in My Compass.");
      trackEvent("reflection_saved", {
        situation_slug: situationSlug,
        situation_title: situationTitle,
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Your reflection could not be saved. Please try again.");
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.22em] text-[#C89B3C]">
          Reflection space
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-[#2C3E50]">
          Write what you are noticing.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#23303D]/75">
          You can answer these privately here. Save them only if you want to
          come back to them later.
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block font-medium text-[#2C3E50]">
            {reflectionQuestions[0] || "What are you carrying right now?"}
          </span>
          <textarea
            value={reflection1}
            onChange={(event) => {
              trackReflectionStarted();
              setReflection1(event.target.value);
            }}
            rows={4}
            className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium text-[#2C3E50]">
            {reflectionQuestions[1] || "What truth do you need to remember?"}
          </span>
          <textarea
            value={reflection2}
            onChange={(event) => {
              trackReflectionStarted();
              setReflection2(event.target.value);
            }}
            rows={4}
            className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium text-[#2C3E50]">
            {reflectionQuestions[2] || "What is one faithful next step?"}
          </span>
          <textarea
            value={reflection3}
            onChange={(event) => {
              trackReflectionStarted();
              setReflection3(event.target.value);
            }}
            rows={4}
            className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-medium text-[#2C3E50]">
            Anything else you want to write down?
          </span>
          <textarea
            value={note}
            onChange={(event) => {
              trackReflectionStarted();
              setNote(event.target.value);
            }}
            rows={5}
            className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "loading"}
          className="rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#23303D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading"
            ? "Saving..."
            : isSignedIn
              ? "Save reflection"
              : "Save this reflection"}
        </button>

        {!isSignedIn && (
          <div className="space-y-1 text-sm leading-6 text-[#23303D]/65">
            <p>No password needed. We’ll send you a private sign-in link.</p>
            <p>Your reflection stays private — visible only to you.</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-[#23303D]/60">
        Your reflection stays private — visible only to you.
      </p>

      {message && (
        <p className="mt-4 rounded-2xl bg-[#FAF6F1] px-4 py-3 text-sm text-[#23303D]/80">
          {message}
        </p>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </section>
  );
}
