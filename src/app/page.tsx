"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleClick = () => {
    setIsFullScreen(true);
    setTimeout(() => {
      router.push("/rule");
    }, 300); // Adjust the timeout duration as needed
  };
  return (
    <section 
      className="min-h-screen w-full relative flex items-center justify-center text-white"
      style={{
        backgroundImage: "url('/skyclear.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 text-center flex flex-col gap-4">
        <p className="text-7xl">Headout</p>
        <Button className="rounded-4xl p-6" onClick={handleClick}>
          Get Started
        </Button>
      </div>
      {/* White swipe overlay */}
      <div
        className={`fixed inset-0 bg-white transition-transform duration-300 ${
          isFullScreen ? "translate-x-0" : "translate-x-full"
        }`}
      ></div>
    </section>
  );
}
