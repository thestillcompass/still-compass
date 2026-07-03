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
    "Biblical guidance for what you’re carrying right now. Start with your real-life situation and find scripture, reflection, and one faithful next step.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "The Still Compass",
    description:
      "Biblical guidance for what you’re carrying right now. Start with your real-life situation and find scripture, reflection, and one faithful next step.",
    url: "https://thestillcompass.com",
    siteName: "The Still Compass",
    images: [
      {
        url: "https://thestillcompass.com/still-compass-logo.png",
        width: 1200,
        height: 630,
        alt: "The Still Compass",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Still Compass",
    description: "Biblical guidance for what you’re carrying right now.",
    images: ["https://thestillcompass.com/still-compass-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}