import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getAllStories } from "@/data/stories";

export const metadata = {
  title: "Bible Stories | The Still Compass",
  description:
    "Find a Bible story that speaks to what you are carrying: shame, failure, burnout, feeling unseen, and more.",
};

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Bible Stories
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            Find yourself in the story.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            Sometimes a story gives you a place to stand when a single verse
            feels hard to hold. Begin with a Bible story that speaks to what you
            are carrying.
          </p>

          <p className="mt-4 text-sm font-medium text-[#2C3E50]/70">
            New stories are being added regularly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-8 rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            What are you carrying?
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#2C3E50]">
            Start with the story that sounds closest.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-[#23303D]/70">
            This is not a test, and it is not an AI-generated answer. Each story
            has been written in advance to help you return to scripture with
            more context and clarity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group rounded-[2rem] border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#C89B3C]/50"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
                {story.scriptureReference}
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
                {story.title}
              </h2>

              <p className="mt-4 leading-7 text-[#23303D]/70">
                {story.metaDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {story.themeTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#C89B3C]/25 bg-[#FAF6F1] px-3 py-1 text-xs font-medium text-[#23303D]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold text-[#2C3E50] group-hover:underline">
                Read this story →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}