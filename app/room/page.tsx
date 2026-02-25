"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [timeString, setTimeString] = useState("");
  const [currentHour, setCurrentHour] = useState<number | null>(null);
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

    const updateTime = () => {
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setTimeString(`${hours}:${minutes}:${seconds}`);

      if (currentHour !== null && now.getHours() !== currentHour) {
        setHourChanged(true);
        setTimeout(() => setHourChanged(false), 600);
      }

      setCurrentHour(now.getHours());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [currentHour]);

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

          <span
            className={`mt-2 px-4 py-1 rounded-md bg-green-100/60 backdrop-blur-sm text-emerald-400 font-mono tracking-widest text-base shadow-inner transition-all duration-500 ${
              hourChanged ? "animate-hourPop" : ""
            }`}
          >
            {timeString}
          </span>
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