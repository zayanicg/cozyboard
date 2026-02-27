"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Meow_Script, Press_Start_2P } from "next/font/google";

const meow = Meow_Script({
  subsets: ["latin"],
  weight: "400",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);
  const [lastHour, setLastHour] = useState(time.getHours());
  const [hourChanged, setHourChanged] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now);
      setBlink((prev) => !prev);

      if (now.getHours() !== lastHour) {
        setHourChanged(true);
        setLastHour(now.getHours());

        setTimeout(() => setHourChanged(false), 700);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); 

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const subtitle = "Stay Cozy ✿";

  return (
    <main
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
        
        <h1
          className={`
            ${meow.className}
            absolute top-4 md:top-6 left-1/2
            text-6xl md:text-7xl
            text-[#86EFAC]
            animate-softFloat
            flex items-center
          `}
          style={{
            transform: "translateX(-50%)",
            textShadow:
              "0 2px 6px rgba(255,255,255,0.85), 0 0 12px rgba(134, 239, 172, 0.45)"
          }}
        >
          <span className="text-xl md:text-2xl text-rose-300 opacity-80 mr-2 -ml-1">
            ✿
          </span>
  
          CozyBoard 
  
          <span className="text-xl md:text-2xl text-rose-300 opacity-80 ml-2">
             ✿
          </span>
        </h1>
  
      </div>
  
      {/* Date + Clock Card */}
      <div className="absolute top-24 md:top-6 left-4 md:left-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md">
        <div className="flex flex-col text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-rose-300 leading-none">
            {dateString}
          </h2>
  
          <div
            className={`
              ${pixel.className}
              mt-2 px-4 py-2 rounded-lg
              bg-emerald-50/60
              text-emerald-300
              text-xs md:text-sm
              tracking-widest
              shadow-inner
              transition-all duration-700
              ${hourChanged ? "animate-hourPop" : ""}
              neon-glow
            `}
          >
            {hours}
            <span className={blink ? "opacity-100" : "opacity-20"}>:</span>
            {minutes}
            <span className={blink ? "opacity-100" : "opacity-20"}>:</span>
            {seconds}{" "}
            <span className="text-[8px] md:text-[10px] align-top">
              {ampm}
            </span>
          </div>
  
          <p className="mt-3 text-base md:text-lg font-semibold text-rose-300">
            {subtitle}
          </p>
        </div>
  
        <Image
          src="/lucky.jpg"
          alt="lucky charm"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
      </div>
  
    </main>
  );
}