"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getStoryBySlug } from "@/data/stories";
import { guidanceThemes } from "@/data/guidanceThemes";

type ThemeMatch = {
  slug: string;
  title: string;
  shortDescription: string;
  bridgeCopy: string;
  primaryStorySlug: string;
  secondaryStorySlugs: string[];
  relatedSituationSlug?: string;
  score: number;
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreTheme(question: string, theme: (typeof guidanceThemes)[number]) {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) return 0;

  let score = 0;

  for (const phrase of theme.userPhrases) {
    const normalizedPhrase = normalizeText(phrase);

    if (normalizedPhrase && normalizedQuestion.includes(normalizedPhrase)) {
      score += normalizedPhrase.split(" ").length > 2 ? 6 : 4;
    }
  }

  for (const keyword of theme.keywords) {
    const normalizedKeyword = normalizeText(keyword);

    if (normalizedKeyword && normalizedQuestion.includes(normalizedKeyword)) {
      score += normalizedKeyword.split(" ").length > 1 ? 4 : 2;
    }
  }

  const questionWords = normalizedQuestion
    .split(" ")
    .filter((word) => word.length > 3);

  for (const keyword of theme.keywords) {
    const keywordWords = normalizeText(keyword)
      .split(" ")
      .filter((word) => word.length > 3);

    for (const word of keywordWords) {
      if (questionWords.includes(word)) {
        score += 1;
      }
    }
  }

  return score;
}

function getSituationTitle(slug?: string) {
  if (!slug) return "";

  const titles: Record<string, string> = {
    "cant-stop-worrying": "When you can’t stop worrying",
    "hard-decision": "When you have a hard decision to make",
    burnout: "When you are burned out",
    "job-loss-financial-fear": "When job loss or financial fear is weighing on you",
    "conflict-with-someone-you-love": "When there is conflict with someone you love",
    "feeling-distant-from-god": "When you feel distant from God",
  };

  return titles[slug] || "Related situation guide";
}

export default function StoryMatcher() {
  const [question, setQuestion] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const matches = useMemo<ThemeMatch[]>(() => {
    if (!hasSearched) return [];

    return guidanceThemes
      .map((theme) => ({
        slug: theme.slug,
        title: theme.title,
        shortDescription: theme.shortDescription,
        bridgeCopy: theme.bridgeCopy,
        primaryStorySlug: theme.primaryStorySlug,
        secondaryStorySlugs: theme.secondaryStorySlugs,
        relatedSituationSlug: theme.relatedSituationSlug,
        score: scoreTheme(question, theme),
      }))
      .filter((theme) => theme.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [question, hasSearched]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSearched(true);
  }

  const hasQuestion = question.trim().length > 0;
  const topMatch = matches[0];
  const primaryStory = topMatch ? getStoryBySlug(topMatch.primaryStorySlug) : null;

  const secondaryStories = topMatch
    ? topMatch.secondaryStorySlugs
        .map((slug) => getStoryBySlug(slug))
        .filter(Boolean)
    : [];

  return (
    <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
        Not sure where to begin?
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
        Write what you are carrying.
      </h2>

      <p className="mt-4 max-w-2xl leading-7 text-[#23303D]/70">
        Use your own words. The Still Compass will point you to a pre-written
        Bible story or situation guide that may help you begin. It does not
        generate a new answer live.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <label
          htmlFor="story-question"
          className="text-sm font-semibold text-[#2C3E50]"
        >
          What question, feeling, or situation are you bringing?
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
          placeholder="Example: I hate myself, or if God loved me why did I have to go through this?"
          className="mt-3 w-full rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] px-4 py-3 leading-7 text-[#23303D] outline-none transition placeholder:text-[#23303D]/40 focus:border-[#C89B3C]"
        />

        <button
          type="submit"
          disabled={!hasQuestion}
          className="mt-4 rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find a biblical place to begin
        </button>
      </form>

      {hasSearched && topMatch && primaryStory && (
        <div className="mt-8 border-t border-[#C89B3C]/20 pt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            This sounds close to
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-[#2C3E50]">
            {topMatch.title}
          </h3>

          <p className="mt-3 leading-7 text-[#23303D]/75">
            {topMatch.bridgeCopy}
          </p>

          <Link
            href={`/stories/${primaryStory.slug}`}
            className="mt-6 block rounded-[2rem] border border-[#C89B3C]/25 bg-[#FAF6F1] p-5 transition hover:border-[#C89B3C]/60"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
              Bible story to begin with
            </p>

            <p className="mt-3 text-sm font-semibold text-[#C89B3C]">
              {primaryStory.scriptureReference}
            </p>

            <h4 className="mt-2 text-2xl font-semibold text-[#2C3E50]">
              {primaryStory.title}
            </h4>

            <p className="mt-3 leading-7 text-[#23303D]/75">
              {primaryStory.metaDescription}
            </p>

            <p className="mt-4 text-sm font-semibold text-[#2C3E50]">
              Read this story →
            </p>
          </Link>

          <div className="mt-5 grid gap-3">
            {secondaryStories.map((story) =>
              story ? (
                <Link
                  key={story.slug}
                  href={`/stories/${story.slug}`}
                  className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
                >
                  <p className="text-sm text-[#23303D]/60">
                    Another story you may want to read
                  </p>
                  <p className="mt-1 font-semibold text-[#2C3E50]">
                    {story.title}
                  </p>
                </Link>
              ) : null
            )}

            {topMatch.relatedSituationSlug && (
              <Link
                href={`/situations/${topMatch.relatedSituationSlug}`}
                className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 transition hover:border-[#C89B3C]/50"
              >
                <p className="text-sm text-[#23303D]/60">
                  Related situation guide
                </p>
                <p className="mt-1 font-semibold text-[#2C3E50]">
                  {getSituationTitle(topMatch.relatedSituationSlug)}
                </p>
              </Link>
            )}
          </div>
        </div>
      )}

      {hasSearched && !topMatch && (
        <div className="mt-8 rounded-[2rem] border border-[#C89B3C]/20 bg-[#FAF6F1] p-5">
          <p className="text-lg font-semibold text-[#2C3E50]">
            I do not have an exact match for this yet, but you are not without a
            place to begin.
          </p>

          <p className="mt-3 leading-7 text-[#23303D]/70">
            Try one of these starting places. As the library grows, Still
            Compass will keep adding more biblical pathways for real questions
            people are carrying.
          </p>

          <div className="mt-4 grid gap-3">
            <Link
              href="/situations"
              className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-4 font-semibold text-[#2C3E50] transition hover:border-[#C89B3C]/50"
            >
              Browse situation guides →
            </Link>

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