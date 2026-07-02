"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-[#2C3E50] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
    >
      Print / Save PDF
    </button>
  );
}