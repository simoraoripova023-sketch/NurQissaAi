import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HardcoverOrderModal from "@/components/HardcoverOrderModal";
import PricingModal from "@/components/PricingModal";
import FloatingContactSupport from "@/components/FloatingContactSupport";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "NurQissa AI - Farzandingiz Bosh Qahramon Bo'lgan Sehrli & Ibratli Ertaklar",
  description: "Bolangiz surati va qiziqishlariga asoslangan, mehr, sabr, saxovat va shukronalik kabi oliyjanob qadriyatlarni singdiruvchi shaxsiylashtirilgan ertak kitoblar platformasi.",
  keywords: ["ertak", "bolalar uchun ertaklar", "AI storybook", "Islamic bedtime stories", "personalized story", "NurQissa", "bolalar kitobi", "uzbek ertaklar"],
  authors: [{ name: "NurQissa AI Team" }],
  openGraph: {
    title: "NurQissa AI - Sehrli & Ibratli Ertaklar",
    description: "Farzandingiz bosh qahramon bo'lgan 3D Pixar uslubidagi shaxsiylashtirilgan ertak kitoblari.",
    type: "website",
    locale: "uz_UZ",
    siteName: "NurQissa AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "NurQissa AI - Bolalar uchun Ibratli Ertaklar",
    description: "Har bir oqshomni ibratli va nurli ertak bilan bezang.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-[#0B0E1B] text-[#1E1B4B] dark:text-slate-100 antialiased selection:bg-amber-200 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <HardcoverOrderModal />
          <PricingModal />
          <FloatingContactSupport />
        </ThemeProvider>
      </body>
    </html>
  );
}
