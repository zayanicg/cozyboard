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

  // ---------- Weather ----------
  const [weather, setWeather] = useState<{
    temp: number;
    feels: number;
    condition: string;
    emoji: string;
    city: string;
    isDay: boolean;
  } | null>(null);

  // ---------- Favorite Links ----------
  const [favLinks, setFavLinks] = useState<{ name: string; url: string }[]>([]);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkURL, setNewLinkURL] = useState("");

  // ---------- To-Do List ----------
const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);
const [newTask, setNewTask] = useState("");

// ---------- Deleting Tasks ----------
const [deletingTaskIndexes, setDeletingTaskIndexes] = useState<number[]>([]);

const deleteTask = (index: number) => {
  setDeletingTaskIndexes(prev => [...prev, index]);

  setTimeout(() => {
    setTasks(prev => prev.filter((_, i) => i !== index));
    setDeletingTaskIndexes(prev => prev.filter(i => i !== index));

    // Optional: create a poof
    const poof = document.createElement("div");
    poof.className = "poof";
    poof.style.left = `${Math.random() * window.innerWidth}px`;
    poof.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(poof);
    setTimeout(() => document.body.removeChild(poof), 500);
  }, 500);
};

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

    const savedTasks = localStorage.getItem("cozyTasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    setNamePosition({ x: 20, y: window.innerHeight - 120 });
  }, []);

  // ---------- Fetch Weather ----------
useEffect(() => {
    async function getWeather() {
      try {
        // 1️⃣ Get user's location
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
  
          // 2️⃣ Fetch weather with local timezone
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=apparent_temperature&temperature_unit=fahrenheit&timezone=auto`
          );
          const data = await res.json();
  
          const current = data.current_weather;
          const now = new Date();
          const currentHour = now.getHours();
  
          // 3️⃣ Get local "feels like" from hourly apparent_temperature
          const feels = data.hourly?.apparent_temperature?.[currentHour] ?? current.temperature;
  
          // 4️⃣ Map weather code → emoji & condition
          let emoji = "🌤️";
          let condition = "Clear";
          const code = current.weathercode;
  
          if ([0].includes(code)) {
            emoji = "☀️";
            condition = "Sunny";
          } else if ([1, 2, 3].includes(code)) {
            emoji = "🌤️";
            condition = "Cloudy";
          } else if ([45, 48].includes(code)) {
            emoji = "🌫️";
            condition = "Foggy";
          } else if ([51, 53, 55, 61, 63, 65].includes(code)) {
            emoji = "🌧️";
            condition = "Rainy";
          } else if ([71, 73, 75].includes(code)) {
            emoji = "❄️";
            condition = "Snowy";
          } else if ([95, 96, 99].includes(code)) {
            emoji = "⛈️";
            condition = "Stormy";
          }
  
          // 5️⃣ Get city name via Nominatim (OpenStreetMap)
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const geoData = await geoRes.json();
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Your City";
  
          // 6️⃣ Update state
          setWeather({
            temp: Math.round(current.temperature),
            feels: Math.round(feels),
            condition,
            emoji,
            city,
            isDay: current.is_day === 1,
          });
        });
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    }
  
    getWeather();
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

  useEffect(() => {
    localStorage.setItem("cozyTasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const toggleTask = (index: number, e?: React.MouseEvent) => {
    setTasks(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  
    // ✨ sparkle
    if (e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
  
      const newSparkle = {
        id: Date.now(),
        x: rect.left + rect.width / 2,
        y: rect.top,
      };
  
      setSparkles(prev => [...prev, newSparkle]);
  
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 800);
    }
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

  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

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
<div className="mt-6 w-[85%] max-w-sm mx-auto 
  bg-[repeating-linear-gradient(45deg,#dcfce7,#dcfce7_10px,#bbf7d0_10px,#bbf7d0_20px)]
  backdrop-blur-sm rounded-2xl p-3 shadow-lg flex flex-col">

  <h3 className="text-lg md:text-xl font-bold mb-2 text-center text-green-700">
    Favorite Places ✿
  </h3>

  {/* ✅ SCROLLABLE LINKS CONTAINER */}
  <div className="overflow-y-auto max-h-40 mb-2 flex flex-col gap-2 pr-1">
    {favLinks.map((link, i) => (
      <div
        key={i}
        className="flex items-center justify-between gap-2 bg-white/70 px-3 py-1.5 rounded-xl shadow-sm"
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium truncate max-w-[120px] hover:underline text-green-700 text-sm"
        >
          {link.name}
        </a>

        <div className="flex gap-1">
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
      </div>
    ))}
  </div>

  {/* INPUT SECTION */}
  <div className="flex flex-col md:flex-row gap-2 w-full">
    <input
      type="text"
      placeholder="Name"
      value={newLinkName}
      onChange={e => setNewLinkName(e.target.value)}
      className="w-full px-2 py-1.5 rounded-xl border border-green-300 outline-none text-green-700 bg-white/70 text-sm"
    />

    <input
      type="text"
      placeholder="URL"
      value={newLinkURL}
      onChange={e => setNewLinkURL(e.target.value)}
      className="w-full px-2 py-1.5 rounded-xl border border-green-300 outline-none text-green-700 bg-white/70 text-sm"
    />

    <button
      onClick={addFavLink}
      className="w-full md:w-auto bg-green-400 text-white px-3 py-1.5 rounded-xl hover:bg-green-500 transition text-sm"
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
         {/* Weather */}
         {weather && (
  <div className="mt-2 flex flex-col text-emerald-400 text-sm md:text-base">

    {/* Row 1 */}
    <div className="flex items-center gap-2">
      <span className="text-lg">{weather.emoji}</span>
      <span className="font-semibold">{weather.temp}°F</span>
      <span className="opacity-70">{weather.condition}</span>
    </div>

    {/* Row 2 */}
    <div className="flex items-center gap-2 opacity-80">
      <span>Feels like {weather.feels}°F</span>
      <span>•</span>
      <span>{weather.city}</span>
    </div>

  </div>
)}

<p className="mt-1 text-base md:text-lg font-semibold text-rose-300">
  {subtitle}
</p>
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

   {/* Mood Tracker Card */}
<div className="mood-card">
  <h3 className="text-sm font-bold text-pink-400 mb-2">Mood Tracker ✿</h3>

  {/* Mood Buttons */}
  <div className="flex gap-2 mb-3">
    <img src="/mood-excited.png" alt="excited" onClick={() => chooseMood("excited")} />
    <img src="/mood-sad.png" alt="sad" onClick={() => chooseMood("sad")} />
    <img src="/mood-angry.png" alt="angry" onClick={() => chooseMood("angry")} />
    <img src="/mood-chill.png" alt="chill" onClick={() => chooseMood("chill")} />
  </div>

  {/* Quote */}
  {quote && <p className="text-xs text-pink-400 text-center italic mb-2">{quote}</p>}

 {/* Weekly Mood Row */}
 <div className="mood-row">
  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
    <div key={day}>
      <span>{day}</span>
      <span style={{ fontSize: "1.2rem", color: "#f28ab2" }}>
        {moodHistory[day] ? 
          moodHistory[day] === "excited" ? "😊" :
          moodHistory[day] === "sad" ? "😔" :
          moodHistory[day] === "angry" ? "😡" :
          moodHistory[day] === "chill" ? "😌" :
          <span style={{ fontSize: "0.85rem", color: "#f28ab2" }}>✿</span>
        : <span style={{ fontSize: "0.85rem", color: "#f28ab2" }}>✿</span>}
      </span>
    </div>
  ))}
</div>
</div>

{/* Mood Effects */}
{effect && (
  <div className="mood-effect">
    {effect === "sad" &&
      Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="rain"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 50}px`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
          }}
        ></div>
      ))}
    {effect === "excited" &&
      Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 50}px`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {["🎉", "✨", "🎊", "💖"][Math.floor(Math.random() * 4)]}
        </div>
      ))}
    {effect === "angry" &&
      Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="spark"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {["🔥", "⚡", "💥"][Math.floor(Math.random() * 3)]}
        </div>
      ))}
    {effect === "chill" &&
      Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="leaf"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${-10 - Math.random() * 50}px`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          🍃
        </div>
      ))}
  </div>
)}

{/* To-Do List */}
<div className="absolute left-4 top-1/2 w-64 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md -translate-y-1/2"
  style={{ backgroundImage: "url('/to-do-bg.jpg')" }}
>
 
  <h3 className="text-sm font-bold text-pink-400 mb-2 text-center">To-Do ✿</h3>

  {/* Input */}
  <div className="flex gap-2 mb-3">
    <input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
      placeholder="New task..."
      className="flex-1 px-2 py-1 rounded-lg border text-sm"
    />
    <button
      onClick={() => {
        if (!newTask) return;
        setTasks(prev => [...prev, { text: newTask, done: false }]);
        setNewTask("");
      }}
      className="bg-pink-300 px-2 rounded-lg text-white"
    >
      +
    </button>
  </div>

  {/* Tasks */}
  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
    {tasks.map((task, i) => (
      <div
        key={i}
        onClick={(e) => toggleTask(i, e)}
        className={`flex items-center justify-between px-2 py-1 rounded-lg cursor-pointer transition
        ${task.done ? "bg-pink-100 line-through opacity-60" : "bg-white"}`}
      >
        <span className="text-sm">{task.text}</span>
        <span className="text-pink-300 text-xs">
          {task.done ? "✓" : "✿"}
        </span>

          {/* Delete button */}
          <button
            onClick={() => deleteTask(i)}
            className="text-pink-300 text-xs px-1"
          >
            ✕
          </button>
      </div>
    ))}
  </div>
</div>

{/* ✨ Sparkles */}
{sparkles.map(s => (
  <div
    key={s.id}
    style={{
      position: "fixed",
      left: s.x,
      top: s.y,
      pointerEvents: "none",
      animation: "fadeOut 0.8s ease-out",
    }}
  >
    ✨
  </div>
))}
    </main>
  );
}