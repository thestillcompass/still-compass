"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabaseClient } from "@/lib/supabaseClient";
import { trackEvent } from "@/lib/analytics";

type JournalEntry = {
  id: string;
  user_id: string;
  situation_slug: string;
  situation_title: string;
  reflection_1: string | null;
  reflection_2: string | null;
  reflection_3: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

type AnsweredPrayer = {
  id: string;
  user_id: string;
  journal_entry_id: string | null;
  situation_slug: string;
  situation_title: string;
  title: string | null;
  testimony: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
};

type DashboardStatus = "loading" | "signed-out" | "ready" | "error";

function formatDate(dateString: string | null) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function DashboardPage() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [answeredPrayers, setAnsweredPrayers] = useState<AnsweredPrayer[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  const [activeAnswerEntryId, setActiveAnswerEntryId] = useState<string | null>(
    null
  );
  const [answerTitle, setAnswerTitle] = useState("");
  const [answerTestimony, setAnswerTestimony] = useState("");
  const [answerDate, setAnswerDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [answerStatus, setAnswerStatus] = useState<
    "idle" | "loading" | "saved" | "error"
  >("idle");
  const [answerMessage, setAnswerMessage] = useState("");

  async function loadDashboard() {
    setStatus("loading");
    setErrorMessage("");

    const {
  data: { session },
  error: sessionError,
} = await supabaseClient.auth.getSession();

if (sessionError) {
  console.error(sessionError);
  setStatus("signed-out");
  return;
}

if (!session?.user) {
  setStatus("signed-out");
  return;
}

const user = session.user;

    setUserId(user.id);
    setEmail(user.email || "");

    const { data: journalData, error: journalError } = await supabaseClient
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (journalError) {
      console.error(journalError);
      setStatus("error");
      setErrorMessage("We could not load your saved reflections.");
      return;
    }

    const { data: answeredData, error: answeredError } = await supabaseClient
      .from("answered_prayers")
      .select("*")
      .eq("user_id", user.id)
      .order("answered_at", { ascending: false });

    if (answeredError) {
      console.error(answeredError);
      setStatus("error");
      setErrorMessage("We could not load your answered prayers.");
      return;
    }

    setJournalEntries(journalData || []);
    setAnsweredPrayers(answeredData || []);
    setStatus("ready");
  }
  

  useEffect(() => {
    loadDashboard();
  }, []);

  const answeredByJournalEntryId = useMemo(() => {
    const map = new Map<string, AnsweredPrayer>();

    answeredPrayers.forEach((answeredPrayer) => {
      if (answeredPrayer.journal_entry_id) {
        map.set(answeredPrayer.journal_entry_id, answeredPrayer);
      }
    });

    return map;
  }, [answeredPrayers]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, JournalEntry[]>();

    journalEntries.forEach((entry) => {
      const existing = groups.get(entry.situation_slug) || [];
      existing.push(entry);
      groups.set(entry.situation_slug, existing);
    });

    return Array.from(groups.entries()).map(([slug, entries]) => ({
      slug,
      title: entries[0]?.situation_title || "Saved situation",
      entries,
      latestUpdatedAt: entries[0]?.updated_at,
    }));
  }, [journalEntries]);

  async function handleSignOut() {
  await supabaseClient.auth.signOut();

  setStatus("signed-out");
  setEmail("");
  setUserId("");
  setJournalEntries([]);
  setAnsweredPrayers([]);
  setActiveAnswerEntryId(null);
}

  function openAnswerForm(entry: JournalEntry) {
    const existingAnswer = answeredByJournalEntryId.get(entry.id);

    setActiveAnswerEntryId(entry.id);
    setAnswerStatus("idle");
    setAnswerMessage("");

    if (existingAnswer) {
      setAnswerTitle(existingAnswer.title || "");
      setAnswerTestimony(existingAnswer.testimony || "");
      setAnswerDate(
        existingAnswer.answered_at || new Date().toISOString().slice(0, 10)
      );
    } else {
      setAnswerTitle("");
      setAnswerTestimony("");
      setAnswerDate(new Date().toISOString().slice(0, 10));
    }
  }

  function closeAnswerForm() {
    setActiveAnswerEntryId(null);
    setAnswerTitle("");
    setAnswerTestimony("");
    setAnswerDate(new Date().toISOString().slice(0, 10));
    setAnswerStatus("idle");
    setAnswerMessage("");
  }

  async function saveAnsweredPrayer(entry: JournalEntry) {
    if (!userId) {
      setAnswerStatus("error");
      setAnswerMessage("Please sign in again before saving.");
      return;
    }

    if (!answerTestimony.trim()) {
      setAnswerStatus("error");
      setAnswerMessage("Write a short note about what God has done.");
      return;
    }

    setAnswerStatus("loading");
    setAnswerMessage("");

    const payload = {
      user_id: userId,
      journal_entry_id: entry.id,
      situation_slug: entry.situation_slug,
      situation_title: entry.situation_title,
      title: answerTitle.trim() || "Answered prayer",
      testimony: answerTestimony.trim(),
      answered_at: answerDate,
      updated_at: new Date().toISOString(),
    };

    const existingAnswer = answeredByJournalEntryId.get(entry.id);

    if (existingAnswer) {
      const { error } = await supabaseClient
        .from("answered_prayers")
        .update(payload)
        .eq("id", existingAnswer.id)
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        setAnswerStatus("error");
        setAnswerMessage("This could not be saved. Please try again.");
        return;
      }
    } else {
      const { error } = await supabaseClient
        .from("answered_prayers")
        .insert(payload);

      if (error) {
        console.error(error);
        setAnswerStatus("error");
        setAnswerMessage("This could not be saved. Please try again.");
        return;
      }
    }

    setAnswerStatus("saved");
    setAnswerMessage(
      "Saved. This is now part of what God has brought you through."
    );

    await loadDashboard();

    setTimeout(() => {
      closeAnswerForm();
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            My Compass
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
                A quiet place to return to.
              </h1>

              <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
                Your saved reflections, the situations you are walking through,
                and the reminders of what God has already brought you through.
              </p>
            </div>

            {status === "ready" && (
  <button
    type="button"
    onClick={handleSignOut}
    className="rounded-full border border-[#2C3E50]/20 px-5 py-3 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#FFFDF9]"
  >
    Sign out
  </button>
)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        {status === "loading" && (
          <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-8 shadow-sm">
            <p className="text-lg leading-8 text-[#23303D]/75">
              Loading your compass...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-3xl border border-red-200 bg-[#FFFDF9] p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#2C3E50]">
              Something went wrong
            </h2>
            <p className="mt-3 leading-7 text-[#23303D]/75">
              {errorMessage}
            </p>
          </div>
        )}

        {status === "signed-out" && (
          <div className="rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
              Sign in needed
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
              Sign in from a saved reflection.
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#23303D]/75">
               My Compass is where your saved reflections and answered-prayer reminders
              appear. To begin, choose a situation, write a reflection, and save it with a
              private magic link.
            </p>

            <Link
              href="/situations"
              className="mt-7 inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Browse situations
            </Link>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-10">
            <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
                Signed in as
              </p>

              <p className="mt-2 text-lg text-[#23303D]/75">{email}</p>
            </div>

            {journalEntries.length === 0 ? (
              <div className="rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 shadow-sm md:p-10">
                <h2 className="text-3xl font-semibold text-[#2C3E50]">
                  Nothing saved yet.
                </h2>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#23303D]/75">
                  Start with the situation closest to what you are carrying.
                  When you write and save a reflection, it will appear here.
                </p>

                <Link
                  href="/situations"
                  className="mt-7 inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Choose a situation
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                      Reflections
                    </p>
                    <p className="mt-3 text-4xl font-semibold text-[#2C3E50]">
                      {journalEntries.length}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                      Situations
                    </p>
                    <p className="mt-3 text-4xl font-semibold text-[#2C3E50]">
                      {groupedEntries.length}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                      Answered
                    </p>
                    <p className="mt-3 text-4xl font-semibold text-[#2C3E50]">
                      {answeredPrayers.length}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                      Latest
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[#2C3E50]">
                      {formatDate(journalEntries[0].updated_at)}
                    </p>
                  </div>
                </div>

                {answeredPrayers.length > 0 && (
                  <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
                      What God has brought me through
                    </p>

                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2C3E50]">
                      Answered prayers and reminders
                    </h2>

                    <div className="mt-6 space-y-4">
                      {answeredPrayers.map((answeredPrayer) => (
                        <div
                          key={answeredPrayer.id}
                          className="rounded-3xl bg-[#FAF6F1] p-5"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-[#2C3E50]">
                                {answeredPrayer.title || "Answered prayer"}
                              </h3>

                              <p className="mt-1 text-sm text-[#23303D]/60">
                                {answeredPrayer.situation_title}
                                {answeredPrayer.answered_at
                                  ? ` · ${formatDate(
                                      answeredPrayer.answered_at
                                    )}`
                                  : ""}
                              </p>
                            </div>

                            <Link
                              href={`/situations/${answeredPrayer.situation_slug}`}
                              className="text-sm font-semibold text-[#2C3E50] underline-offset-4 hover:underline"
                            >
                              Revisit
                            </Link>
                          </div>

                          {answeredPrayer.testimony && (
                            <p className="mt-4 leading-7 text-[#23303D]/80">
                              {answeredPrayer.testimony}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
                        Saved reflections
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2C3E50]">
                        What you have been walking through
                      </h2>
                    </div>

                    <Link
                      href="/situations"
                      className="inline-flex rounded-full border border-[#C89B3C]/50 px-5 py-3 text-sm font-semibold text-[#2C3E50] transition hover:border-[#C89B3C]"
                    >
                      Add another reflection
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {groupedEntries.map((group) => (
                      <div
                        key={group.slug}
                        className="rounded-[2rem] border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm md:p-8"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-[#2C3E50]">
                              {group.title}
                            </h3>

                            <p className="mt-2 text-sm text-[#23303D]/60">
                              Last updated{" "}
                              {group.latestUpdatedAt
                                ? formatDate(group.latestUpdatedAt)
                                : ""}
                            </p>
                          </div>

                          <Link
                            href={`/situations/${group.slug}`}
                            className="inline-flex rounded-full bg-[#2C3E50] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            Revisit situation
                          </Link>
                        </div>

                        <div className="mt-6 space-y-4">
                          {group.entries.map((entry) => {
                            const answeredPrayer =
                              answeredByJournalEntryId.get(entry.id);
                            const isAnswerFormOpen =
                              activeAnswerEntryId === entry.id;

                            return (
                              <div
                                key={entry.id}
                                className="rounded-3xl bg-[#FAF6F1] p-5"
                              >
                                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                  <p className="text-sm font-semibold text-[#C89B3C]">
                                    {formatDate(entry.updated_at)}
                                  </p>

                                  <button
  type="button"
  onClick={() => openAnswerForm(entry)}
  className="rounded-full border border-[#C89B3C]/40 px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:border-[#C89B3C] hover:bg-[#FFFDF9]"
>
  {answeredPrayer ? "Edit answered prayer" : "Mark as answered"}
</button>
                                </div>

                                {entry.reflection_1 && (
                                  <p className="mb-3 leading-7 text-[#23303D]/80">
                                    {entry.reflection_1}
                                  </p>
                                )}

                                {entry.reflection_2 && (
                                  <p className="mb-3 leading-7 text-[#23303D]/80">
                                    {entry.reflection_2}
                                  </p>
                                )}

                                {entry.reflection_3 && (
                                  <p className="mb-3 leading-7 text-[#23303D]/80">
                                    {entry.reflection_3}
                                  </p>
                                )}

                                {entry.note && (
                                  <p className="leading-7 text-[#23303D]/80">
                                    {entry.note}
                                  </p>
                                )}

                                {isAnswerFormOpen && (
                                  <div className="mt-5 rounded-3xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-5">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                                      Remember this
                                    </p>

                                    <h4 className="mt-2 text-2xl font-semibold text-[#2C3E50]">
                                      What has God done here?
                                    </h4>

                                    <div className="mt-5 space-y-4">
                                      <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-[#2C3E50]">
                                          Title
                                        </span>
                                        <input
                                          type="text"
                                          value={answerTitle}
                                          onChange={(event) =>
                                            setAnswerTitle(event.target.value)
                                          }
                                          placeholder="Answered prayer"
                                          className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
                                        />
                                      </label>

                                      <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-[#2C3E50]">
                                          Date answered
                                        </span>
                                        <input
                                          type="date"
                                          value={answerDate}
                                          onChange={(event) =>
                                            setAnswerDate(event.target.value)
                                          }
                                          className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
                                        />
                                      </label>

                                      <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-[#2C3E50]">
                                          What changed? What do you want to
                                          remember?
                                        </span>
                                        <textarea
                                          value={answerTestimony}
                                          onChange={(event) =>
                                            setAnswerTestimony(
                                              event.target.value
                                            )
                                          }
                                          rows={5}
                                          placeholder="Write a few lines about what God did, what changed, or what you want your future self to remember."
                                          className="w-full rounded-2xl border border-[#2C3E50]/15 bg-white px-4 py-3 text-[#23303D] outline-none focus:border-[#C89B3C]"
                                        />
                                      </label>
                                    </div>

                                    {answerMessage && (
                                      <p className="mt-4 rounded-2xl bg-[#FAF6F1] px-4 py-3 text-sm text-[#23303D]/80">
                                        {answerMessage}
                                      </p>
                                    )}

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          saveAnsweredPrayer(entry)
                                        }
                                        disabled={answerStatus === "loading"}
                                        className="rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#23303D] disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {answerStatus === "loading"
                                          ? "Saving..."
                                          : "Save answered prayer"}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={closeAnswerForm}
                                        className="rounded-full border border-[#2C3E50]/20 px-6 py-3 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#FAF6F1]"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}