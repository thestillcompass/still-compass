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
              I didn&apos;t grow up planning to build something like this.
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-8 text-[#23303D]/80">
              <p>
                For over 13 years, smoking and drinking were just part of my
                life, not a dramatic rock-bottom story, just a long, ordinary
                habit I didn&apos;t think I&apos;d ever actually put down.
              </p>

              <p>
                In 2012, I became a Christian, and something I still don&apos;t
                fully know how to explain happened: I was able to walk away from
                both without a single withdrawal symptom. I&apos;m not saying
                that to make a point about willpower. I don&apos;t think it was
                mine.
              </p>

              <p>
                That wasn&apos;t the end of anything hard, though. If anything,
                it was the start of a season where I needed scripture in a way I
                never had before.
              </p>

              <p>
                In the years after, I went through a friend&apos;s betrayal I
                didn&apos;t see coming, a real loss in business, and a police
                case I had no way out of on my own. I also carried a lot of
                extra weight physically. I went from 105 kilos down to 85, which
                sounds like a footnote next to everything else, but it
                wasn&apos;t one at the time.
              </p>

              <p>
                I&apos;m not sharing any of this because I&apos;ve got it all
                figured out now. I&apos;m sharing it because in every one of
                those seasons, there was a specific passage, a specific moment
                of clarity, a specific next step that scripture gave me, not a
                vague feeling, an actual place to stand.
              </p>

              <p>
                That&apos;s the whole idea behind The Still Compass. Not another
                Bible app to read cover to cover. A place to land when
                you&apos;re in the middle of something anxious, burned out,
                betrayed, afraid, stuck and you need to know where to look,
                the way I needed to know, more than once.
              </p>

              <p className="font-semibold text-[#2C3E50]">
                If you&apos;re in one of those seasons right now, I built this
                for you.
              </p>
            </div>
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