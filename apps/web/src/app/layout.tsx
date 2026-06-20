import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";

import "../index.css";

const sans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const description =
  "A focus app that drops you into one task with the timer already running. Do it, mark it, next. Keep your streak alive. Discipline, made visible.";

export const metadata: Metadata = {
  title: "LockedIn — Stop scrolling. Start executing.",
  description,
  openGraph: {
    title: "LockedIn — Stop scrolling. Start executing.",
    description,
    siteName: "LockedIn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LockedIn — Stop scrolling. Start executing.",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
