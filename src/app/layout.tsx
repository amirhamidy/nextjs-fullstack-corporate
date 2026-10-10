
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXORA | راهکارهای نرم‌افزاری",
  description:
    "توسعه نرم‌افزار، طراحی محصولات دیجیتال و ارائه راهکارهای سازمانی.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#08070d] text-white [font-family:var(--font-vazirmatn)]">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}