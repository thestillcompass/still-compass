import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { getAllSituations, getSituationBySlug } from "@/data/situations";

type ApplicationPlanPageProps = {
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

export async function generateMetadata({ params }: ApplicationPlanPageProps) {
  const { slug } = await params;
  const situation = getSituationBySlug(slug);

  if (!situation) {
    return {
      title: "Application Plan Not Found | The Still Compass",
    };
  }

  return {
    title: `${situation.title} Application Plan | The Still Compass`,
    description: `A printable application plan for ${situation.title.toLowerCase()}.`,
  };
}

function PrintableTextBlock({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph} className="text-base leading-7 text-[#23303D]/85">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default async function ApplicationPlanPage({
  params,
}: ApplicationPlanPageProps) {
  const { slug } = await params;
  const situation = getSituationBySlug(slug);

  if (!situation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF6F1] px-6 py-8 text-[#23303D] print:bg-white print:px-0 print:py-0">
      {/* Screen-only top bar */}
      <div className="mx-auto mb-8 flex max-w-4xl items-center justify-between print:hidden">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          The Still Compass
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/situations/${situation.slug}`}
            className="rounded-full border border-[#C89B3C]/40 px-4 py-2 text-sm font-semibold hover:border-[#C89B3C]"
          >
            Back to guide
          </Link>

          <PrintButton />
        </div>
      </div>

      {/* Printable document */}
      <article className="mx-auto max-w-4xl rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-8 shadow-sm print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-10 print:shadow-none">
        {/* Header */}
        <header className="border-b border-[#C89B3C]/25 pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#C89B3C]">
            The Still Compass
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-[#23303D] print:text-3xl">
            {situation.title}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#23303D]/75 print:text-base print:leading-7">
            {situation.summary}
          </p>

          <p className="mt-5 font-semibold text-[#2C3E50]">
            Be still. Then know which way to go.
          </p>
        </header>

        {/* Scripture references */}
        <section className="border-b border-[#C89B3C]/20 py-8">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Scripture references
          </h2>

          <div className="space-y-4">
            {situation.passages.map((passage) => (
              <div
                key={passage.reference}
                className="rounded-2xl border border-[#C89B3C]/20 bg-[#FAF6F1] p-5 print:border-[#C89B3C]/30 print:bg-white"
              >
                <h3 className="mb-2 text-lg font-semibold text-[#2C3E50]">
                  {passage.reference}
                </h3>

                <PrintableTextBlock text={passage.explanation} />
              </div>
            ))}
          </div>
        </section>

        {/* Practice */}
        <section className="border-b border-[#C89B3C]/20 py-8">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            What to practice this week
          </h2>

          <PrintableTextBlock text={situation.actionStep} />
        </section>

        {/* Reflection */}
        <section className="border-b border-[#C89B3C]/20 py-8">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Reflection questions
          </h2>

          <div className="space-y-6">
            {situation.reflectionQuestions.map((question, index) => (
              <div key={question}>
                <p className="mb-3 text-base font-semibold leading-7">
                  {index + 1}. {question}
                </p>

                <div className="h-24 rounded-2xl border border-[#C89B3C]/25 bg-white print:h-28" />
              </div>
            ))}
          </div>
        </section>

        {/* Seven-day space */}
        <section className="border-b border-[#C89B3C]/20 py-8">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Seven-day practice space
          </h2>

          <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#C89B3C]/25 bg-white p-4"
              >
                <p className="mb-3 font-semibold text-[#2C3E50]">
                  Day {index + 1}
                </p>

                <div className="h-20 border-t border-[#C89B3C]/20 pt-3 text-sm text-[#23303D]/50">
                  Write one honest sentence here.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prayer prompt */}
        <section className="py-8">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Simple prayer prompt
          </h2>

          <div className="rounded-2xl border border-[#C89B3C]/25 bg-[#FAF6F1] p-5 print:bg-white">
            <p className="text-base leading-7 text-[#23303D]/85">
              God, I am bringing you what I am carrying today. Help me name it
              honestly, receive your care, and take the next faithful step in
              front of me. Teach me to be still, and then to know which way to
              go.
            </p>
          </div>
        </section>

        <footer className="border-t border-[#C89B3C]/20 pt-6 text-sm text-[#23303D]/55">
          <p>The Still Compass — Biblical guidance for what you’re carrying right now.</p>
        </footer>
      </article>
    </main>
  );
}