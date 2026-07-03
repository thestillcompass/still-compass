import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Contact | The Still Compass",
  description:
    "Contact The Still Compass for questions, privacy requests, or support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Contact
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            Have a question or request?
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            If you have a question about The Still Compass, your saved
            reflections, or your account, you can reach out by email.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="rounded-[2rem] border border-[#C89B3C]/25 bg-[#FFFDF9] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C89B3C]">
            Email
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#2C3E50]">
            info.mymj@gmail.com
          </h2>

          <p className="mt-4 leading-8 text-[#23303D]/75">
            You can use this email for support, privacy questions, deletion
            requests, or general feedback about The Still Compass.
          </p>

          <a
            href="mailto:info.mymj@gmail.com"
            className="mt-7 inline-flex rounded-full bg-[#2C3E50] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Send email
          </a>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#C89B3C]/20 bg-[#FAF6F1] p-6">
          <h2 className="text-2xl font-semibold text-[#2C3E50]">
            A note about urgent situations
          </h2>

          <p className="mt-4 leading-8 text-[#23303D]/75">
            The Still Compass is not an emergency service. If you are in
            immediate danger, at risk of harming yourself, or need urgent help,
            please contact local emergency services or someone you trust right
            away.
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}