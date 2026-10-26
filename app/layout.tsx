import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  variable: "--font-jakarta",
  display: "swap",
  src: [
    { path: "./fonts/plus-jakarta-sans-normal-latin.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-normal-latin-ext.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/plus-jakarta-sans-italic-latin.woff2", weight: "200 800", style: "italic" },
    { path: "./fonts/plus-jakarta-sans-italic-latin-ext.woff2", weight: "200 800", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Websensial",
  description: "Websensial digital studio and template marketplace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{var l=location.pathname.split('/')[1];if(l==='id'||l==='en')document.documentElement.lang=l;var t=localStorage.getItem('ws-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--ws-bg)] text-ink">{children}</body>
    </html>
  );
}
