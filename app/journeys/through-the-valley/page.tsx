
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Through the Valley | The Still Compass",
  description:
    "A Scripture and worship journey through Psalm 23 for seasons of fear, uncertainty, and difficulty.",
  alternates: {
    canonical: "https://thestillcompass.com/journeys/through-the-valley",
  },
  openGraph: {
    title: "Through the Valley | The Still Compass",
    description:
      "When the road ahead feels uncertain, begin with Psalm 23 and the presence of the Shepherd.",
    url: "https://thestillcompass.com/journeys/through-the-valley",
    siteName: "The Still Compass",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Still Compass",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Through the Valley | The Still Compass",
    description:
      "A Scripture and worship journey through Psalm 23.",
    images: ["/og-image.png"],
  },
};

const reflectionQuestions = [
  "What does the valley represent in your life right now?",
  "Where have you been measuring God's presence by how quickly your circumstances change?",
  "What is one faithful step you can take today, even without knowing the whole way forward?",
];

export default function ThroughTheValleyPage() {
  const youtubeUrl =
    process.env.NEXT_PUBLIC_THROUGH_THE_VALLEY_YOUTUBE_URL;

  const videoLink =
    youtubeUrl &&
    /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(youtubeUrl)
      ? youtubeUrl
      : null;

  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C89B3C]">
            Scripture & Worship Journey 01
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#2C3E50] md:text-6xl">
            Through the Valley
          </h1>

          <p className="mt-5 text-xl leading-8 text-[#23303D]/75">
            When you are afraid of what lies ahead, or when life
            feels darker than you expected, there is a place in
            Scripture to begin.
          </p>

          <p className="mt-6 text-sm font-semibold text-[#2C3E50]">
            Scripture anchor: Psalm 23:4
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-[#2C3E50]">
            Begin with Scripture
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#23303D]/80">
            Psalm 23 describes the Lord as a shepherd who
            provides, guides, protects, and remains with his
            people. The psalm does not promise that the
            shepherd's path will avoid every valley.
            Instead, it describes confidence in God's presence
            even in the darkest places.
          </p>

          <p className="mt-5 text-lg leading-8 text-[#23303D]/80">
            Before reading this explanation further, take a
            moment to read the whole psalm. Notice how the
            shepherd's care is described both in peaceful
            places and in frightening ones.
          </p>

          <a
            href="https://www.biblegateway.com/passage/?search=Psalm+23&version=NIV"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Read Psalm 23 in the Bible
          </a>
        </section>

        <section className="mb-14 rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            Understanding the passage
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#2C3E50]">
            The valley is real. So is the Shepherd.
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-8 text-[#23303D]/80">
            <p>
              Psalm 23 is traditionally attributed to David,
              who knew what it meant to care for sheep and
              who also experienced danger, opposition, and
              uncertainty.
            </p>

            <p>
              The image of a shepherd helps us understand
              something important about the Lord's care.
              Sheep depend on a shepherd for direction,
              protection, and provision. Their safety does
              not come from knowing the entire path ahead.
            </p>

            <p>
              In verse four, the scene changes from peaceful
              pastures to a dark valley. Yet the psalmist's
              confidence continues. He speaks of the Lord
              being with him.
            </p>

            <p>
              Notice what the passage does not say. It does
              not suggest that faithful people never
              experience danger or suffering. Nor does it
              promise that every difficult season will end
              immediately.
            </p>

            <p>
              Its comfort is grounded in the character and
              presence of the Shepherd.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-[#2C3E50]">
            Why this matters when life feels uncertain
          </h2>

          <div className="mt-6 space-y-5 text-lg leading-8 text-[#23303D]/80">
            <p>
              Perhaps you are carrying a financial burden,
              waiting for medical news, grieving a loss, or
              facing a future you cannot predict.
            </p>

            <p>
              Sometimes fear is not irrational. Sometimes
              there really is something difficult ahead.
              Scripture does not require you to deny that
              reality.
            </p>

            <p>
              Psalm 23 invites you to consider a different
              source of confidence. Instead of asking you
              to prove that nothing bad can happen, it
              directs your attention to the Shepherd who
              remains present.
            </p>

            <p>
              Christians also read this picture of the
              Shepherd alongside Jesus' words in John 10,
              where he identifies himself as the good
              shepherd who cares for his sheep.
            </p>

            <p>
              That does not mean we understand everything
              God permits. It means uncertainty is not the
              same thing as being abandoned.
            </p>
          </div>

          <a
            href="https://www.biblegateway.com/passage/?search=John+10%3A11-18&version=NIV"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-semibold text-[#2C3E50] underline underline-offset-4"
          >
            Read Jesus' words about the Good Shepherd — John 10
          </a>
        </section>

        <section className="mb-14 rounded-[2rem] bg-[#2C3E50] p-6 text-white md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E4C681]">
            One faithful next step
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            You do not need to solve the entire journey today.
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/85">
            Identify one concern that is weighing on you.
            Name it honestly before God. Then consider one
            responsible action available to you today —
            perhaps asking for help, having a necessary
            conversation, seeking wise counsel, or completing
            one small task you have been avoiding.
          </p>

          <p className="mt-5 leading-8 text-white/85">
            Faith does not require pretending the valley
            is harmless. It invites you to walk faithfully,
            trusting the Shepherd as you go.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-[#2C3E50]">
            Take a moment to reflect
          </h2>

          <p className="mt-4 leading-8 text-[#23303D]/75">
            You do not have to answer every question.
            Choose the one closest to what you are carrying.
          </p>

          <div className="mt-6 space-y-4">
            {reflectionQuestions.map((question, index) => (
              <div
                key={question}
                className="rounded-2xl border border-[#C89B3C]/25 bg-[#FFFDF9] p-5"
              >
                <p className="text-sm font-semibold text-[#C89B3C]">
                  Reflection {index + 1}
                </p>
                <p className="mt-2 text-lg leading-8">
                  {question}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-[#23303D]/65">
            If you would like to write and save a private
            reflection today, you can use the existing
            reflection space in our worry guide.
          </p>

          <Link
            href="/situations/cant-stop-worrying#reflection"
            className="mt-4 inline-block text-sm font-semibold text-[#2C3E50] underline underline-offset-4"
          >
            Open the private reflection space
          </Link>
        </section>

        <section className="mb-14 rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            Continue in worship
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#2C3E50]">
            Through the Valley
          </h2>

          <p className="mt-5 leading-8 text-[#23303D]/80">
            This original Still Compass worship song was
            created around the comfort of Psalm 23:4.
            If it would help you reflect, take a few
            minutes to listen and return your attention
            to the Scripture you have just read.
          </p>

          {videoLink ? (
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Listen on YouTube
            </a>
          ) : (
            <p className="mt-5 text-sm leading-7 text-[#23303D]/60">
              The worship video link will be added here.
            </p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-[#2C3E50]">
            A simple prayer
          </h2>

          <p className="mt-5 text-lg italic leading-9 text-[#23303D]/80">
            Lord, you know the valley I am walking through.
            You know what frightens me and what I cannot see
            ahead. Help me trust your presence without
            pretending that this is easy. Give me wisdom
            for the next faithful step and courage to
            receive the help I need. Keep my heart turned
            toward Jesus, my Good Shepherd. Amen.
          </p>
        </section>

        <div className="border-t border-[#C89B3C]/20 pt-8">
          <Link
            href="/stories"
            className="text-sm font-semibold text-[#2C3E50] underline underline-offset-4"
          >
            Explore more Bible stories
          </Link>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
