"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Meow_Script, Press_Start_2P, Festive } from "next/font/google";

const meow = Meow_Script({ subsets: ["latin"], weight: "400" });
const festive = Festive({ subsets: ["latin"], weight: "400" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });

export default function Home() {
  // ---------- Clock ----------
  const [time, setTime] = useState<Date | null>(null);
  const [blink, setBlink] = useState(true);
  const [lastHour, setLastHour] = useState(0);
  const [hourChanged, setHourChanged] = useState(false);

  // ---------- Polaroid ----------
  const [photo, setPhoto] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 800, y: 50 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // ---------- Nameplate ----------
  const [userName, setUserName] = useState("");
  const [namePosition, setNamePosition] = useState({ x: 20, y: 500 });
  const [draggingName, setDraggingName] = useState(false);
  const nameOffset = useRef({ x: 0, y: 0 });

  // ---------- Moods ----------
  const [mood, setMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});
  const [effect, setEffect] = useState<string | null>(null);

  // ---------- Quotes ----------
  const [quote, setQuote] = useState("");

  // ---------- Favorite Links ----------
  const [favLinks, setFavLinks] = useState<{ name: string; url: string }[]>([]);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkURL, setNewLinkURL] = useState("");

  const quotes: Record<string, string[]> = {
    excited: ["Your happiness is contagious ✨", "Celebrate every small win 🎉", "Joy looks good on you 🌈"],
    sad: ["Even the darkest clouds pass ☁️", "Storms pass, cozy stays 🌙", "Rest. Tomorrow will feel softer 🌙"],
    angry: ["Breathe in... breathe out 🌿", "Your feelings are valid ❤️", "Storms always calm eventually 🌧️"],
    chill: ["Peace is powerful ✨", "Stay cozy and present 🌿", "Calm mind, warm heart ☁️"],
  };

  // ---------- Load data ----------
  useEffect(() => {
    setTime(new Date());
    const savedPhoto = localStorage.getItem("cozyPhoto");
    if (savedPhoto) setPhoto(savedPhoto);

    const savedName = localStorage.getItem("cozyUserName");
    if (savedName) setUserName(savedName);

    const savedLinks = localStorage.getItem("cozyFavLinks");
    if (savedLinks) setFavLinks(JSON.parse(savedLinks));

    const savedMood = localStorage.getItem("cozyMoodHistory");
    if (savedMood) setMoodHistory(JSON.parse(savedMood));

    setNamePosition({ x: 20, y: window.innerHeight - 120 });
  }, []);

  // ---------- Save data ----------
  useEffect(() => {
    if (photo) localStorage.setItem("cozyPhoto", photo);
    else localStorage.removeItem("cozyPhoto");
  }, [photo]);

  useEffect(() => {
    localStorage.setItem("cozyUserName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("cozyFavLinks", JSON.stringify(favLinks));
  }, [favLinks]);

  useEffect(() => {
    localStorage.setItem("cozyMoodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  // ---------- Clock Interval ----------
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

  // ---------- Mood Handling ----------
  const chooseMood = (type: string) => {
    setMood(type);
    setEffect(type);
    setQuote(quotes[type][Math.floor(Math.random() * quotes[type].length)]);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    setMoodHistory((prev) => ({ ...prev, [today]: type }));
    setTimeout(() => setEffect(null), 5000);
  };

  // ---------- Favorite Links ----------
  const addFavLink = () => {
    if (!newLinkName || !newLinkURL) return;
    setFavLinks((prev) => [...prev, { name: newLinkName, url: newLinkURL }]);
    setNewLinkName("");
    setNewLinkURL("");
  };

  const removeFavLink = (index: number) => {
    setFavLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Draggable Helpers ----------
  const clampPosition = (x: number, y: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { x: Math.max(0, Math.min(x, width - 256)), y: Math.max(0, Math.min(y, height - 220)) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition(clampPosition(e.clientX - offset.current.x, e.clientY - offset.current.y));
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const clampNamePosition = (x: number, y: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { x: Math.max(0, Math.min(x, width - 220)), y: Math.max(0, Math.min(y, height - 120)) };
  };

  const handleNameMouseDown = (e: React.MouseEvent) => {
    setDraggingName(true);
    nameOffset.current = { x: e.clientX - namePosition.x, y: e.clientY - namePosition.y };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingName) return;
      setNamePosition(clampNamePosition(e.clientX - nameOffset.current.x, e.clientY - nameOffset.current.y));
    };
    const handleUp = () => setDraggingName(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [draggingName]);

  // ---------- Time Formatting ----------
  if (!time) return null;
  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = time.getHours() >= 12 ? "PM" : "AM";
  const dateString = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const subtitle = "Stay Cozy ✿";

  // ---------- File Upload ----------
  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) setPhoto(reader.result.toString());
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
      {/* Header & Favorite Links */}
      <div className="absolute top-4 md:top-6 left-0 w-full flex flex-col items-center z-20">
        <h1 className={`${meow.className} text-6xl md:text-7xl text-[#86EFAC] text-center`}>CozyBoard</h1>

        {/* Favorite Links Card */}
        <div className="mt-6 w-[90%] max-w-md mx-auto 
          bg-[repeating-linear-gradient(45deg,#dcfce7,#dcfce7_10px,#bbf7d0_10px,#bbf7d0_20px)]
          backdrop-blur-sm rounded-2xl p-4 shadow-lg flex flex-col">

          <h3 className="text-xl md:text-2xl font-bold mb-3 text-center text-green-700">
            Favorite Places ✿
          </h3>

          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto mb-3">
            {favLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-xl shadow-sm max-w-full">
                <a
                  href={link.url}
                  target="_blank"
                  className="font-medium truncate max-w-[100px] md:max-w-[140px] hover:underline text-green-700"
                >
                  {link.name}
                </a>
                <button
                  onClick={() => {
                    const newName = prompt("Edit name", link.name);
                    const newURL = prompt("Edit URL", link.url);
                    if (newName && newURL) {
                      setFavLinks(prev =>
                        prev.map((l, idx) =>
                          idx === i ? { name: newName, url: newURL } : l
                        )
                      );
                    }
                  }}
                  className="px-2 py-1 rounded text-white bg-green-400 hover:bg-green-500 text-xs"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeFavLink(i)}
                  className="px-2 py-1 rounded text-white bg-green-400 hover:bg-green-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Name"
              value={newLinkName}
              onChange={e => setNewLinkName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-green-300 outline-none text-green-700 bg-white/70"
            />
            <input
              type="text"
              placeholder="URL"
              value={newLinkURL}
              onChange={e => setNewLinkURL(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-green-300 outline-none text-green-700 bg-white/70"
            />
            <button
              onClick={addFavLink}
              className="w-full md:w-auto bg-green-400 text-white px-4 py-2 rounded-xl hover:bg-green-500 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Clock */}
      <div className="absolute top-24 md:top-6 left-4 md:left-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-md">
        <div className="flex flex-col text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-rose-300 leading-none">{dateString}</h2>
          <div className={`${pixel.className} mt-2 px-4 py-2 rounded-lg bg-emerald-50/60 text-emerald-300 text-xs md:text-sm tracking-widest shadow-inner transition-all duration-700 ${hourChanged ? "animate-hourPop" : ""} neon-glow`}>
            {hours}<span className={blink ? "opacity-100" : "opacity-20"}>:</span>
            {minutes}<span className={blink ? "opacity-100" : "opacity-20"}>:</span>
            {seconds} <span className="text-[8px] md:text-[10px] align-top">{ampm}</span>
          </div>
          <p className="mt-3 text-base md:text-lg font-semibold text-rose-300">{subtitle}</p>
        </div>
        <Image src="/lucky.jpg" alt="lucky charm" width={80} height={80} className="rounded-full object-cover"/>
      </div>

     {/* Fixed Polaroid (Bottom-right) */}
<div
  style={{
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 20, // stays above background but below header/links if needed
  }}
  className="w-64"
>
  <div className="bg-[repeating-linear-gradient(45deg,#ffe4e6,#ffe4e6_10px,#fecdd3_10px,#fecdd3_20px)] p-4 pb-10 rounded-sm shadow-xl rotate-[-3deg] relative border border-rose-300">
    {photo ? (
      <>
        <img src={photo} alt="User upload" className="w-full h-40 object-cover" />
        <button
          onClick={() => setPhoto(null)}
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
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>
    )}
    <p className={`${festive.className} absolute bottom-2 left-1/2 -translate-x-1/2 text-base text-black`}>
      Little Memory ✿
    </p>
  </div>
</div>

      {/* Draggable Nameplate */}
      <div
        onMouseDown={handleNameMouseDown}
        style={{ position: "absolute", left: namePosition.x, top: namePosition.y, cursor: draggingName ? "grabbing" : "grab" }}
        className="relative"
      >
        <Image src="/name.png" alt="name plate" width={200} height={80} />
        <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your Name ✿" className={`${festive.className} absolute inset-0 w-full h-full bg-transparent text-black text-2xl text-center outline-none`} />
      </div>
    </main>
  );
}