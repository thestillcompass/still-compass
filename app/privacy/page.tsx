import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Privacy Policy | The Still Compass",
  description:
    "How The Still Compass handles reflections, account information, and personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F1] text-[#23303D]">
      <SiteHeader />

      <section className="border-b border-[#C89B3C]/20">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#C89B3C]">
            Privacy Policy
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#23303D] md:text-6xl">
            Your reflections are private.
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#23303D]/75">
            The Still Compass is built to help you reflect honestly before God.
            This page explains what is stored, why it is stored, and how your
            information is handled.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <div className="space-y-10 text-lg leading-8 text-[#23303D]/85">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              What we collect
            </h2>

            <p>
              If you choose to save a reflection, The Still Compass stores your
              email address, the situation you reflected on, your written
              reflections, notes, and any answered-prayer reminders you choose
              to save.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              Why we collect it
            </h2>

            <p>
              We collect this information so you can return to your saved
              reflections, revisit what you were praying through, and remember
              what God has brought you through.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              Who can see your reflections
            </h2>

            <p>
              Your saved reflections are private to your account. They are not
              public, and other users cannot see them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              How sign-in works
            </h2>

            <p>
              The Still Compass uses email magic links for sign-in. This means
              you do not need to create or remember a password. When you enter
              your email, a private sign-in link is sent to you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              How your data is stored
            </h2>

            <p>
              Account and reflection data is stored using Supabase. Access rules
              are used so saved reflections are connected to the account that
              created them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              What we do not do
            </h2>

            <ul className="list-disc space-y-3 pl-6">
              <li>We do not make your reflections public.</li>
              <li>We do not sell your personal reflections.</li>
              <li>We do not ask for a password.</li>
              <li>
                We do not use your reflections as a replacement for pastoral
                care, counseling, or trusted Christian community.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              Deleting your data
            </h2>

            <p>
              If you want your saved reflections or account data deleted, you
              can contact us and request deletion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-[#2C3E50]">
              Contact
            </h2>

            <p>
              For privacy questions or deletion requests, contact us at{" "}
              <a
                href="mailto:info.mymj@gmail.com"
                className="font-semibold text-[#2C3E50] underline-offset-4 hover:underline"
              >
                info.mymj@gmail.com
              </a>
              .
            </p>
          </section>

          <p className="border-t border-[#C89B3C]/20 pt-8 text-sm leading-6 text-[#23303D]/60">
            Last updated: July 2026
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}