import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getAllStories, getStoryBySlug } from "@/data/stories";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllStories().map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | The Still Compass",
      description:
        "Bible stories for what you are carrying, written with scripture, reflection, and one faithful next step.",
    };
  }

  const pageUrl = `https://thestillcompass.com/stories/${story.slug}`;

  return {
    title: story.metaTitle,
    description: story.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: story.metaTitle,
      description: story.metaDescription,
      url: pageUrl,
      siteName: "The Still Compass",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${story.title} | The Still Compass`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: story.metaTitle,
      description: story.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = getAllStories()
    .filter((item) => item.slug !== story.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/stories"
            className="text-sm font-semibold text-[#2C3E50] underline-offset-4 hover:underline"
          >
            ← Back to Bible Stories
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            {story.scriptureReference}
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            {story.title}
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            {story.metaDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {story.themeTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#C89B3C]/25 bg-[#FFFDF9] px-3 py-1 text-xs font-medium text-[#23303D]/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <section className="mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            The story, briefly
          </p>

          <div className="space-y-5 text-lg leading-8 text-[#23303D]/85">
            {story.storyBrief.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            Why this story, for this question
          </p>

          <div className="space-y-5 text-lg leading-8 text-[#23303D]/85">
            {story.whyThisStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            What this means for you
          </p>

          <div className="space-y-5 text-lg leading-8 text-[#23303D]/85">
            {story.whatThisMeans.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            Reflection questions
          </p>

          <div className="space-y-4">
            {story.reflectionQuestions.map((question, index) => (
              <div
                key={question}
                className="rounded-2xl border border-[#C89B3C]/15 bg-[#FAF6F1] p-4"
              >
                <p className="text-sm font-semibold text-[#C89B3C]">
                  Question {index + 1}
                </p>
                <p className="mt-2 leading-7 text-[#23303D]/80">{question}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-[#2C3E50]/10 bg-[#2C3E50] p-6 text-white md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            A gentle next step
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Stay with the story before rushing past it.
          </h2>

          <p className="mt-4 leading-8 text-white/80">
            Choose one reflection question and sit with it honestly. You do not
            need to force an answer. Let the story give you a place to begin.
          </p>
        </section>

        {relatedStories.length > 0 && (
          <section>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
              Other stories you may want to read
            </p>

            <div className="grid gap-4">
              {relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.slug}
                  href={`/stories/${relatedStory.slug}`}
                  className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-5 transition hover:border-[#C89B3C]/50"
                >
                  <p className="text-sm text-[#23303D]/60">
                    {relatedStory.scriptureReference}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#2C3E50]">
                    {relatedStory.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#23303D]/70">
                    {relatedStory.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </main>
  );
}