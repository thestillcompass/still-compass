import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "About | The Still Compass",
  description:
    "The Still Compass is a quiet biblical guidance space for Christians carrying worry, decisions, grief, burnout, conflict, and hard seasons.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            About The Still Compass
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            A quiet place to bring what feels heavy.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            The Still Compass was built for Christians who need biblical
            guidance for real-life situations, not more noise, pressure, or
            generic advice.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="space-y-8 text-lg leading-8 text-[#23303D]/85">
          <p>
            Sometimes you do not need a full Bible reading plan. You need help
            naming what you are carrying and finding one faithful next step.
          </p>

          <p>
            The Still Compass begins with real situations: worry, hard
            decisions, burnout, financial fear, conflict, grief, distance from
            God, and the kinds of moments people often face quietly.
          </p>

          <p>
            Each guide brings together scripture references, plain-language
            reflection, and a simple next step. The goal is not to replace
            prayer, church community, pastoral care, counseling, or deep Bible
            study. The goal is to help you pause, get your bearings, and return
            to what is true.
          </p>

          <p>
            If you choose to save a reflection, it is stored privately in your
            own account so you can come back to it later. Your reflections are
            not public.
          </p>

          <section className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 md:p-8">
  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
    Who is behind this?
  </p>

  <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
    Built by Sydney and Leland Lea as a quiet biblical guidance project.
  </h2>

  <p className="mt-5 leading-8 text-[#23303D]/80">
    The Still Compass is being built by Sydney and Leland Lea, Christian creators and strategists
    who wanted to make scripture easier to return to in real-life moments of
    worry, decision, burnout, conflict, and spiritual dryness.
  </p>

  <p className="mt-4 leading-8 text-[#23303D]/80">
    This project came from a simple conviction: sometimes people do not need
    louder advice. They need space to be still, name what they are carrying,
    return to scripture, and take one faithful next step.
  </p>

  <p className="mt-4 leading-8 text-[#23303D]/80">
    The Still Compass is not meant to replace scripture, prayer, church
    community, pastoral care, counseling, or trusted Christian support. It is
    meant to be a quiet companion when you need help getting your bearings.
  </p>
</section>

          <p className="font-semibold text-[#2C3E50]">
            Be still. Then know which way to go.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
