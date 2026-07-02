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

          <span className="text-lg font-semibold tracking-tight">
            The Still Compass
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-[#23303D]/75">
          <Link href="/situations" className="hover:text-[#23303D]">
            Situations
          </Link>

          <Link href="/" className="hover:text-[#23303D]">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}