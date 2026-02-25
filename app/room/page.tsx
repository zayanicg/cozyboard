"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

function getOrdinal(day: number) {
  if (day > 3 && day < 21) return day + "th";
  switch (day % 10) {
    case 1: return day + "st";
    case 2: return day + "nd";
    case 3: return day + "rd";
    default: return day + "th";
  }
}

const subtitles = [
  "A soft day to begin again.",
  "Small steps still count.",
];

export default function Room() {
  const [dateString, setDateString] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // ✅ Clock state (additive only)
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [ampm, setAmpm] = useState("");
  const [blink, setBlink] = useState(true);
  const [lastHour, setLastHour] = useState<number | null>(null);
  const [hourChanged, setHourChanged] = useState(false);

  useEffect(() => {
    const today = new Date();

    const weekday = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const month = today.toLocaleDateString("en-US", {
      month: "long",
    });

    const day = today.getDate();
    const suffix = getOrdinal(day);

    setDateString(`${weekday}, ${month} ${suffix}`);

    const randomSubtitle =
      subtitles[Math.floor(Math.random() * subtitles.length)];

    setSubtitle(randomSubtitle);

    // ✅ Clock logic
    const updateTime = () => {
      const now = new Date();

      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");

      const period = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;

      const formattedHours = String(h).padStart(2, "0");

      setHours(formattedHours);
      setMinutes(m);
      setSeconds(s);
      setAmpm(period);

      setBlink((prev) => !prev);

      if (lastHour !== null && now.getHours() !== lastHour) {
        setHourChanged(true);
        setTimeout(() => setHourChanged(false), 800);
      }

      setLastHour(now.getHours());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);

  }, []); // ✅ stays empty (no structural changes)

  return (
    <main
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >

      {/* Top Left Date Card */}
      <div className="absolute top-6 left-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md">

        <div className="flex flex-col text-left">
          <h1 className="text-2xl md:text-3xl font-semibold text-rose-300 leading-none">
            {dateString}
          </h1>

          {/* ✅ Retro Neon Digital Clock */}
          <div
            className={`
              ${pixel.className}
              mt-2 px-4 py-2 rounded-lg
              bg-emerald-100/50
              text-emerald-400
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

        </div>

        <Image
          src="/lucky.jpg"
          alt="lucky charm"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

      </div>

      {/* Center Quote */}
      <p className="mt-3 text-lg text-pink-600">
        {subtitle}
      </p>

    </main>
  );
}