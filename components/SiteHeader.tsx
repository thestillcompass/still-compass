import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#C89B3C]/20 bg-[#FAF6F1]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/still-compass-logo.png"
            alt="The Still Compass logo"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />

          <span className="text-lg font-semibold tracking-tight text-[#23303D]">
            The Still Compass
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-[#23303D]/75">
          <Link href="/" className="hover:text-[#23303D]">
            Home
          </Link>

          <Link href="/situations" className="hover:text-[#23303D]">
            Situations
          </Link>

          <Link href="/stories" className="hover:text-[#23303D]">
            Stories
          </Link>

          <Link href="/about" className="hover:text-[#23303D]">
            About
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#C89B3C]/40 px-4 py-2 font-semibold text-[#2C3E50] transition hover:border-[#C89B3C] hover:bg-[#FFFDF9]"
          >
            My Compass
          </Link>
        </nav>
      </div>
    </header>
  );
}
