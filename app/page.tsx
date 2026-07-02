import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getFeaturedSituations } from "@/data/situations";

export default function HomePage() {
  const featuredSituations = getFeaturedSituations();

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
              Biblical guidance for what you’re carrying
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-[#23303D] md:text-7xl">
              Start with what you’re carrying.
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
              The Still Compass helps you find biblical guidance for the real
              situations you’re facing — anxiety, burnout, hard decisions,
              conflict, grief, money fear, doubt, and dry seasons with God.
            </p>

            <p className="mt-6 text-xl font-semibold text-[#2C3E50]">
              Be still. Then know which way to go.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/situations"
                className="rounded-full bg-[#2C3E50] px-6 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Find guidance for your situation
              </Link>

              <a
                href="#how-it-works"
                className="rounded-full border border-[#C89B3C]/50 px-6 py-3 text-center text-sm font-semibold text-[#23303D] transition hover:border-[#C89B3C]"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Compass Card */}
<div className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 shadow-sm">
  <div className="mb-8 flex h-56 items-center justify-center rounded-[1.5rem] border border-[#C89B3C]/20 bg-[#111111] p-6">
    <Image
      src="/still-compass-logo.png"
      alt="The Still Compass logo"
      width={220}
      height={220}
      priority
      className="h-auto w-44 md:w-52"
    />
  </div>

  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
    The core rhythm
  </p>

  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
    Settle first. Then move.
  </h2>

  <p className="mt-4 leading-7 text-[#23303D]/70">
    Choose the situation closest to what you are carrying. Read carefully
    curated scripture guidance. Take one concrete step this week.
  </p>
</div>
        </div>
      </section>

      {/* Featured Situations */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Situation Library
          </p>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            What are you facing right now?
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#23303D]/70">
            You do not need to know the perfect verse, the right book of the
            Bible, or where to begin. Start with the thing that is actually
            weighing on you.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredSituations.map((situation) => (
            <Link
              key={situation.slug}
              href={`/situations/${situation.slug}`}
              className="group rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#C89B3C]/50 hover:shadow-md"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#C89B3C]">
                {situation.category}
              </p>

              <h3 className="text-2xl font-semibold tracking-tight text-[#23303D]">
                {situation.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-[#23303D]/70">
                {situation.summary}
              </p>

              <p className="mt-6 text-sm font-semibold text-[#2C3E50]">
                Read guidance <span>→</span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/situations"
            className="inline-flex rounded-full border border-[#C89B3C]/50 px-6 py-3 text-sm font-semibold text-[#23303D] transition hover:border-[#C89B3C]"
          >
            Browse all situations
          </Link>
        </div>
      </section>

      {/* Not Another Bible App */}
      <section className="border-y border-[#C89B3C]/20 bg-[#FFFDF9]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
                Why this exists
              </p>

              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Not another Bible app.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-[#23303D]/75">
              <p>
                Most Bible apps begin with the text: book, chapter, verse, plan.
              </p>

              <p>
                The Still Compass begins with the moment you are actually in.
                You may be anxious at 2am, stuck on a decision, exhausted from
                carrying everyone, afraid about money, numb in prayer, or angry
                after another conversation that went badly.
              </p>

              <p>
                This is not here to replace your Bible app, your church, wise
                counsel, or prayer. It is here to help you begin when life feels
                heavy and you do not know where to start looking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            How it works
          </p>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Begin gently. Move faithfully.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: "Choose what you’re facing",
              text: "Start with a real situation, not a reading plan.",
            },
            {
              title: "Read scripture guidance",
              text: "Each guide gives you a few relevant passages explained plainly.",
            },
            {
              title: "Take one concrete step",
              text: "Not vague advice. One practical action step for this week.",
            },
            {
              title: "Reflect honestly",
              text: "Use simple questions to name what is happening in your life.",
            },
            {
              title: "Keep the plan",
              text: "Download a printable application plan you can return to.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6"
            >
              <p className="mb-4 text-sm font-semibold text-[#C89B3C]">
                {index + 1}
              </p>

              <h3 className="text-xl font-semibold tracking-tight">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#23303D]/70">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hard Nights */}
      <section className="border-t border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Built for the hard nights
          </p>

          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            For the person who still believes, but feels overwhelmed.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#23303D]/75">
            The person who wants scripture, but does not want a shallow answer.
            The person who has already heard “just pray about it,” but still
            needs help knowing what to do next.
          </p>

          <div className="mt-9">
            <Link
              href="/situations"
              className="inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Begin with one situation
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
