import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JournalPrompt from "@/components/JournalPrompt";
import { getAllSituations, getSituationBySlug } from "@/data/situations";
import SituationAnalytics from "@/components/SituationAnalytics";

type SituationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const situations = getAllSituations();

  return situations.map((situation) => ({
    slug: situation.slug,
  }));
}

export async function generateMetadata({
  params,
}: SituationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const situation = getSituationBySlug(slug);

  if (!situation) {
    return {
      title: "Situation Not Found | The Still Compass",
      description:
        "Biblical guidance for real-life situations through scripture, reflection, and one faithful next step.",
    };
  }

  const pageUrl = `https://thestillcompass.com/situations/${situation.slug}`;

  return {
    title: situation.metaTitle,
    description: situation.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: situation.metaTitle,
      description: situation.metaDescription,
      url: pageUrl,
      siteName: "The Still Compass",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${situation.title} | The Still Compass`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: situation.metaTitle,
      description: situation.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

function TextBlock({ text }: { text: string }) {
  return (
    <div className="space-y-5">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph} className="text-lg leading-8 text-[#23303D]/85">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function SituationPage({ params }: SituationPageProps) {
  const { slug } = await params;
  const situation = getSituationBySlug(slug);

  if (!situation) {
    notFound();
  }

  const relatedSituations = situation.relatedSituations
    .map((relatedSlug) => getSituationBySlug(relatedSlug))
    .filter((relatedSituation) => relatedSituation !== undefined);

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />
      <SituationAnalytics
        situationSlug={situation.slug}
        situationTitle={situation.title}
      />

      {/* Hero */}
      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            {situation.category}
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            {situation.title}
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            {situation.summary}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#reflection"
              className="rounded-full bg-[#2C3E50] px-6 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Write your reflection
            </a>

            <Link
              href="/situations"
              className="rounded-full border border-[#C89B3C]/50 px-6 py-3 text-center text-sm font-semibold text-[#23303D] transition hover:border-[#C89B3C]"
            >
              Browse other situations
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        {/* Real Problem */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">
            The real problem
          </h2>

          <TextBlock text={situation.realProblem} />
        </section>

        {/* Bible Passages */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">
            What the Bible actually says
          </h2>

          <div className="space-y-6">
            {situation.passages.map((passage) => (
              <div
                key={passage.reference}
                className="rounded-3xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-6 shadow-sm md:p-8"
              >
                <h3 className="mb-4 text-2xl font-semibold text-[#2C3E50]">
                  {passage.reference}
                </h3>

                <TextBlock text={passage.explanation} />
              </div>
            ))}
          </div>
        </section>

        {/* Action Step */}
        <section className="mb-16 rounded-3xl bg-[#2C3E50] p-6 text-white md:p-8">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">
            What to actually do this week
          </h2>

          <div className="space-y-5">
            {situation.actionStep.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-white/85">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Reflection / Journal */}
        <section id="reflection" className="mb-16 scroll-mt-24">
          <JournalPrompt
            situationSlug={situation.slug}
            situationTitle={situation.title}
            reflectionQuestions={situation.reflectionQuestions}
          />
        </section>

        {/* Related Situations */}
        {relatedSituations.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight">
              Related situations
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {relatedSituations.map((relatedSituation) => (
                <Link
                  key={relatedSituation.slug}
                  href={`/situations/${relatedSituation.slug}`}
                  className="rounded-2xl border border-[#C89B3C]/20 bg-[#FFFDF9] p-5 transition hover:-translate-y-1 hover:border-[#C89B3C]/50"
                >
                  <p className="mb-2 text-sm font-semibold text-[#C89B3C]">
                    {relatedSituation.category}
                  </p>

                  <h3 className="text-xl font-semibold">
                    {relatedSituation.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#23303D]/70">
                    {relatedSituation.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Final Word */}
        <section className="border-t border-[#C89B3C]/20 pt-10">
          <p className="max-w-2xl text-2xl font-semibold leading-10">
            You do not have to solve your whole life today.
          </p>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#23303D]/75">
            Name the loudest worry. Bring that one thing to God. Take the next
            faithful step in front of you.
          </p>

          <p className="mt-6 font-semibold text-[#2C3E50]">
            Be still. Then know which way to go.
          </p>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
