"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { stories } from "@/data/stories";

type MatchResult = {
  slug: string;
  title: string;
  scriptureReference: string;
  metaDescription: string;
  score: number;
};

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function scoreStory(question: string, story: (typeof stories)[number]) {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) return 0;

  let score = 0;

  for (const keyword of story.matchKeywords) {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedKeyword && normalizedQuestion.includes(normalizedKeyword)) {
      score += normalizedKeyword.split(" ").length > 1 ? 3 : 2;
    }
  }

  for (const tag of story.themeTags) {
    const normalizedTag = normalizeText(tag);

    if (normalizedTag && normalizedQuestion.includes(normalizedTag)) {
      score += 2;
    }
  }

  for (const exampleQuestion of story.exampleQuestions) {
    const exampleWords = normalizeText(exampleQuestion)
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter((word) => word.length > 3);

    for (const word of exampleWords) {
      if (normalizedQuestion.includes(word)) {
        score += 1;
      }
    }
  }

  return score;
}

export default function StoryMatcher() {
  const [question, setQuestion] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const matches = useMemo<MatchResult[]>(() => {
    if (!hasSearched) return [];

    return stories
      .map((story) => ({
        slug: story.slug,
        title: story.title,
        scriptureReference: story.scriptureReference,
        metaDescription: story.metaDescription,
        score: scoreStory(question, story),
      }))
      .filter((story) => story.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [question, hasSearched]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
  }

  const hasQuestion = question.trim().length > 0;
  const topMatch = matches[0];
  const otherMatches = matches.slice(1);

  return (
    <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
        Not sure which story to read?
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
        Write what you are carrying.
      </h2>

      <p className="mt-4 max-w-2xl leading-7 text-[#23303D]/70">
        Use your own words. We will suggest a pre-written Bible story that may
        help you begin. This does not generate a new answer live.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="story-question"
          className="text-sm font-semibold text-[#2C3E50]"
        >
          What question or feeling are you bringing?
        </label>

        <textarea
          id="story-question"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            if (hasSearched) {
              setHasSearched(false);
            }
          }}
          rows={4}
          placeholder="Example: I feel like God does not see me, or I feel like I failed too badly."
          className="mt-3 w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] px-4 py-3 leading-7 text-[#23303D] outline-none transition placeholder:text-[#23303D]/40 focus:border-[#C89B3C]"
        />

        <button
          type="submit"
          disabled={!hasQuestion}
          className="mt-4 rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find a story
        </button>
      </form>

      {hasSearched && matches.length > 0 && topMatch && (
        <div className="mt-8 border-t border-[#C89B3C]/20 pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            A story that may speak to this
          </p>

          <Link
            href={`/stories/${topMatch.slug}`}
            className="mt-4 block rounded-[2rem] border border-[#C89B3C]/25 bg-[#FAF6F1] p-5 transition hover:border-[#C89B3C]/60"
          >
            <p className="text-sm font-semibold text-[#C89B3C]">
              {topMatch.scriptureReference}
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-[#2C3E50]">
              {topMatch.title}
            </h3>

            <p className="mt-3 leading-7 text-[#23303D]/75">
              {topMatch.metaDescription}
            </p>

            <p className="mt-4 text-sm font-semibold text-[#2C3E50]">
              Read this story →
            </p>
          </Link>

          {otherMatches.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-[#23303D]/65">
                You may also want to read:
              </p>

              <div className="mt-3 grid gap-3">
                {otherMatches.map((match) => (
                  <Link
                    key={match.slug}
                    href={`/stories/${match.slug}`}
                    className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
                  >
                    <p className="text-sm text-[#23303D]/60">
                      {match.scriptureReference}
                    </p>
                    <p className="mt-1 font-semibold text-[#2C3E50]">
                      {match.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasSearched && matches.length === 0 && (
        <div className="mt-8 rounded-[2rem] border border-[#C89B3C]/20 bg-[#FAF6F1] p-5">
          <p className="text-lg font-semibold text-[#2C3E50]">
            I am not sure which story fits best yet.
          </p>

          <p className="mt-3 leading-7 text-[#23303D]/70">
            Try one of these starting places instead:
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/stories/woman-at-the-well"
              className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
            >
              I feel ashamed or not enough → The woman at the well
            </Link>

            <Link
              href="/stories/peter-restored"
              className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
            >
              I feel like I failed too badly → Peter restored
            </Link>

            <Link
              href="/stories/elijah-under-the-broom-tree"
              className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
            >
              I feel exhausted and want to give up → Elijah under the broom tree
            </Link>

            <Link
              href="/stories/hagar-in-the-wilderness"
              className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
            >
              I feel unseen or forgotten → Hagar in the wilderness
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}