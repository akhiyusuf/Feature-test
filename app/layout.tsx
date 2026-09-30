import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Recite After Me',
  description: 'An AI-powered Quran recitation correction tool.',
  openGraph: {
    title: 'Recite After Me',
    description: 'An AI-powered Quran recitation correction tool.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recite After Me',
    description: 'An AI-powered Quran recitation correction tool.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" onLoad={() => {(window as any).eruda.init()}} />
      </body>
    </html>
  );
}
