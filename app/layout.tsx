import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import Footer from "./Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sans",
});

export const metadata: Metadata = {
  title: "Tax research with the source in view · GAIN Tax",
  description: "AI-assisted UK tax research for professionals. Clear answers, connected to legislation and HMRC guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={dmSans.className}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
