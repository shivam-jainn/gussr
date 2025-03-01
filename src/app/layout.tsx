import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/lib/sound-context";
import MuteButton from "@/components/custom/MuteButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Gussr - The City Guessing Game" />
        <meta property="og:description" content="Test your knowledge of cities around the world in this fun guessing game!" />
        <meta property="og:image" content="https://gussr.vercel.app/wa-share.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full`}
        style={{
          backgroundImage: "url('/skyclear.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <SoundProvider>
          <MuteButton />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
