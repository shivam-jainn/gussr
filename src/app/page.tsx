"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAtom } from "jotai";
import { usernameAtom } from "@/lib/username_atom";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [username, setUsername] = useState("");
  const [, setGlobalUsername] = useAtom(usernameAtom);

  const handleClick = () => {
    if (username.trim()) {
      setGlobalUsername(username);
      setIsFullScreen(true);
      setTimeout(() => {
        router.push("/rule");
      }, 300);
    }
  };

  return (
    <section 
      className="min-h-screen w-full relative flex items-center justify-center text-white"
    >
      <div className="z-10 text-center flex flex-col gap-4">
        <div className="relative group">
          <p className="text-7xl font-bold relative font-[var(--font-silkscreen)]">Headout</p>
          <Image
            src="/blimp.png"
            alt="Blimp"
            width={96}
            height={96}
            className="absolute w-24 h-24 transition-all duration-300 cursor-pointer hover:scale-110 z-50"
            style={{
              top: '-3rem',
              right: '-3rem',
              transform: 'translate(0, 0)',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
              position: 'absolute'
            }}
            onMouseMove={(e) => {
              const img = e.currentTarget;
              const rect = img.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const mouseY = e.clientY - rect.top;
              const speed = 0.1;
              
              requestAnimationFrame(() => {
                img.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
              });
            }}
            onClick={(e) => {
              const img = e.currentTarget;
              document.body.style.cursor = `url(${img.src}), auto`;
              document.body.classList.add('custom-cursor');
            }}
          />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 border-2 border-white"
          />
          <Button 
            className="rounded-4xl p-6" 
            onClick={handleClick}
            disabled={!username.trim()}
          >
            Get Started
          </Button>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-white transition-transform duration-300 ${
          isFullScreen ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>
    </section>
  );
}
