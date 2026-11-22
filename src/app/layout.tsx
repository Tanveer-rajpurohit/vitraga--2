import type { Metadata } from "next";
import { Archivo, Fira_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/site/Loader";
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
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${archivo.variable} ${fira.variable}`}>
      <head>
        {/* Applies the saved theme before paint so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("vitraga-theme");if(t==="white")document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>
        <Loader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
