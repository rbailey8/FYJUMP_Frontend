import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FYJUMP Hiring — Tech Jobs at Top Companies",
    template: "%s | FYJUMP Hiring",
  },
  description:
    "Search full-time, internship, and apprenticeship tech roles at FAANG, Fortune 500, and startup companies. Updated daily from company career boards.",
  openGraph: {
    siteName: "FYJUMP Hiring",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="wrap">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
