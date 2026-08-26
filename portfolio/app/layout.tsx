import type { Metadata } from "next";
import { Noto_Serif_Ethiopic, Noto_Sans_Ethiopic, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { getProfile } from "@/lib/data";

const display = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: profile.seo_title || `${profile.full_name} — ${profile.headline}`,
    description: profile.seo_description || profile.bio
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <html lang="am" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen flex-col">
            <SiteChrome name={profile.full_name} profile={profile}>
              {children}
            </SiteChrome>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
