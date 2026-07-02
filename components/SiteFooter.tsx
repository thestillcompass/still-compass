import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#C89B3C]/20 bg-[#FAF6F1]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">
            The Still Compass
          </p>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#23303D]/60">
            Biblical guidance for what you’re carrying right now.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-[#23303D]/65">
          <Link href="/" className="hover:text-[#23303D]">
            Home
          </Link>

          <Link href="/situations" className="hover:text-[#23303D]">
            Situations
          </Link>
        </div>
      </div>
    </footer>
  );
}