import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import MuteButton from "@/components/custom/MuteButton";
import { SoundProvider } from '@/lib/sound-context';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: '400',
  subsets: ['latin'],
  variable: "--font-silkscreen",
});

export const metadata = {
  title: 'Gussr',
  description: 'A fun city guessing game',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} font-sans antialiased min-h-screen w-full`}
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
