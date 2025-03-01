"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAtom } from "jotai";
import { usernameAtom } from "@/lib/username_atom";

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
        <p className="text-7xl">Headout</p>
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
