import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#C89B3C]/20 bg-[#FAF6F1]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-[#2C3E50]">
            The Still Compass
          </p>

          <p className="mt-3 max-w-md leading-7 text-[#23303D]/70">
            Biblical guidance for what you’re carrying right now.
          </p>

          <p className="mt-4 text-sm text-[#23303D]/55">
            Your saved reflections are private and only visible to you.
          </p>
        </div>

        <nav className="grid gap-3 text-sm text-[#23303D]/70 sm:grid-cols-2 md:text-right">
          <Link href="/" className="hover:text-[#23303D]">
            Home
          </Link>

          <Link href="/situations" className="hover:text-[#23303D]">
            Situations
          </Link>

          <Link href="/about" className="hover:text-[#23303D]">
            About
          </Link>

          <Link href="/dashboard" className="hover:text-[#23303D]">
            My Compass
          </Link>

          <Link href="/privacy" className="hover:text-[#23303D]">
            Privacy
          </Link>

          <Link href="/contact" className="hover:text-[#23303D]">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}