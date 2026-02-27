"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Meow_Script, Press_Start_2P } from "next/font/google";

const meow = Meow_Script({
  subsets: ["latin"],
  weight: "400",
});
import { Festive } from "next/font/google";

const festive = Festive({
  subsets: ["latin"],
  weight: "400",
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);
  const [blink, setBlink] = useState(true);
  const [lastHour, setLastHour] = useState(0);
  const [hourChanged, setHourChanged] = useState(false);

  const [photo, setPhoto] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 300, y: 300 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setTime(new Date());
  }, []);

  useEffect(() => {
    if (!time) return;

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
  }, [time, lastHour]);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("cozyPhoto");
    const savedPosition = localStorage.getItem("cozyPhotoPosition");
    if (savedPhoto) setPhoto(savedPhoto);
    if (savedPosition) setPosition(JSON.parse(savedPosition));
  }, []);

  useEffect(() => {
    if (photo) {
      localStorage.setItem("cozyPhoto", photo);
    } else {
      localStorage.removeItem("cozyPhoto");
    }
  }, [photo]);

  useEffect(() => {
    localStorage.setItem("cozyPhotoPosition", JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  if (!time) return null;

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
            ✿</span>
          CozyBoard
          <span className="text-xl md:text-2xl text-rose-300 opacity-80 ml-2">
             ✿</span>
        </h1>
      </div>

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

      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: dragging ? "grabbing" : "grab",
        }}
        className="w-64"
      >
        <div className="bg-[repeating-linear-gradient(45deg,#ffe4e6,#ffe4e6_10px,#fecdd3_10px,#fecdd3_20px)] p-4 pb-10 rounded-sm shadow-xl rotate-[-3deg] relative border border-rose-300">
          {photo ? (
            <>
              <img
                src={photo}
                alt="User upload"
                className="w-full h-40 object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPhoto(null);
                }}
                className="absolute -top-3 -right-3 bg-rose-400 text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-rose-500 transition"
              >
                ✕
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer text-gray-400 text-sm border-2 border-dashed border-gray-200">
              Click to add photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhoto(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          )}

<p className={`${festive.className} absolute bottom-2 left-1/2 -translate-x-1/2 text-lg text-black`}>
  Little Memory ✿
</p>
        </div>
      </div>
    </main>
  );
}