import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getAllSituations } from "@/data/situations";

export const metadata = {
  title: "Situation Library | The Still Compass",
  description:
    "Browse biblical guidance by real-life situation — anxiety, burnout, hard decisions, conflict, grief, money fear, doubt, and more.",
};

export default function SituationsPage() {
  const situations = getAllSituations();

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Situation Library
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            Where do you need God’s guidance today?
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            Choose the situation closest to what you are facing. Each guide brings together scripture, plain-language reflection, and one faithful next step.
          </p>
          <p className="mt-4 text-sm font-medium text-[#2C3E50]/70">
              New situations are being added regularly.
          </p>
        </div>
      </section>

      {/* Situation Cards */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            What are you facing right now?
          </h2>

          <p className="mt-4 text-lg leading-8 text-[#23303D]/70">
            Choose the situation that feels closest. Each guide gives you
            scripture references, plain-language explanation, one practical next
            step, and reflection questions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {situations.map((situation) => (
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
                Read guidance{" "}
                <span className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}