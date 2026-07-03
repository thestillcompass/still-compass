"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabaseClient } from "@/lib/supabaseClient";

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

type DashboardStatus = "loading" | "signed-out" | "ready" | "error";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function DashboardPage() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [email, setEmail] = useState("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setStatus("loading");
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError) {
        console.error(userError);
        setStatus("error");
        setErrorMessage("We could not load your account. Please try again.");
        return;
      }

      if (!user) {
        setStatus("signed-out");
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabaseClient
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error(error);
        setStatus("error");
        setErrorMessage("We could not load your saved reflections.");
        return;
      }

      setJournalEntries(data || []);
      setStatus("ready");
    }

    loadDashboard();
  }, []);

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
    setJournalEntries([]);
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
                and the reminders you may need again.
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
              Your saved reflections live here.
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#23303D]/75">
              Open any situation, write a reflection, and use the private magic
              link to save it. Once you are signed in, this page will show what
              you have saved.
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
                <div className="grid gap-4 md:grid-cols-3">
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
                      Latest
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[#2C3E50]">
                      {formatDate(journalEntries[0].updated_at)}
                    </p>
                  </div>
                </div>

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
                          {group.entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="rounded-3xl bg-[#FAF6F1] p-5"
                            >
                              <p className="mb-3 text-sm font-semibold text-[#C89B3C]">
                                {formatDate(entry.updated_at)}
                              </p>

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
                            </div>
                          ))}
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