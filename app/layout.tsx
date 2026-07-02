import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "The Still Compass",
  description:
    "Biblical guidance for what you’re carrying right now. Start with your real-life situation and find scripture, reflection, and one concrete next step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.variable} font-serif antialiased`}>
        {children}
      </body>
    </html>
  );
}