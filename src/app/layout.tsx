import type { Metadata } from "next";
import { Archivo, Fira_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-space-grotesk", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const fira = Fira_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-fira-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Vitraga | Production software at 10x speed",
  description:
    "Vitraga is a software studio. Senior engineers and AI-assisted workflows ship secure, tested web apps, backends and infrastructure.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${archivo.variable} ${fira.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
