import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function CaptainSlotScreen({
  members,
  finalCaptain,
  label,
  color,
}) {
  const [current, setCurrent] = useState(members[0]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let index = 0;

    /* =========================
       SLOT高速切替
    ========================= */
    const interval = setInterval(() => {
      setCurrent(members[index % members.length]);
      index++;
    }, 70);

    /* =========================
       LOCK直前演出
    ========================= */
    const slowDown = setTimeout(() => {
      clearInterval(interval);

      let finalIndex = 0;

      const finalList = shuffleArray([
        ...members,
        finalCaptain,
      ]);

      const slowInterval = setInterval(() => {
        setCurrent(
          finalList[finalIndex % finalList.length]
        );

        finalIndex++;
      }, 180);

      setTimeout(() => {
        clearInterval(slowInterval);

        setCurrent(finalCaptain);

        setLocked(true);

        flash();
      }, 1200);
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(slowDown);
    };
  }, []);

  /* =========================
     FLASH
  ========================= */
  const flash = () => {
    const el = document.createElement("div");

    el.className =
      "fixed inset-0 bg-white opacity-30 z-[999] pointer-events-none";

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 120);
  };

  /* =========================
     SHUFFLE
  ========================= */
  const shuffleArray = (array) => {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  return (
    <div className="
      relative
      h-screen
      flex
      flex-col
      items-center
      justify-center
      overflow-hidden
    ">

      {/* =========================
         BACK GLOW
      ========================= */}
      <div className="
        absolute
        w-[700px]
        h-[700px]
        rounded-full
        bg-cyan-400/10
        blur-[120px]
        animate-pulse
      " />

      {/* =========================
         RING
      ========================= */}
      <div className="
        absolute
        w-[420px]
        h-[420px]
        rounded-full
        border
        border-white/10
        animate-spin
      "
      style={{
        animationDuration: "10s",
      }}
      />

      <div className="
        absolute
        w-[520px]
        h-[520px]
        rounded-full
        border
        border-cyan-400/10
        animate-spin
      "
      style={{
        animationDuration: "18s",
      }}
      />

      {/* =========================
         LABEL
      ========================= */}
      <div
        className={`
          text-4xl
          font-black
          tracking-[6px]
          mb-16
          ${color}
          drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]
        `}
      >
        {label}
      </div>

      {/* =========================
         AVATAR
      ========================= */}
      <div
        className={`
          transition-all
          duration-300

          ${
            locked
              ? "scale-125"
              : "scale-100"
          }
        `}
      >
        <div className={`
          rounded-full

          ${
            locked
              ? "shadow-[0_0_120px_rgba(255,255,255,0.8)]"
              : "shadow-[0_0_60px_rgba(0,255,255,0.3)]"
          }
        `}>
          <Avatar
            src={current?.avatar}
            size={260}
          />
        </div>
      </div>

      {/* =========================
         NAME
      ========================= */}
      <div
        className={`
          mt-12
          text-7xl
          font-black
          tracking-[4px]
          transition-all
          duration-300

          ${
            locked
              ? "scale-110 text-white"
              : "text-slate-200"
          }
        `}
      >
        {current?.baseName}
      </div>

      {/* =========================
         LOCKED
      ========================= */}
      <div
        className={`
          mt-10
          text-3xl
          font-black
          tracking-[10px]
          text-yellow-300

          transition-all
          duration-500

          ${
            locked
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }
        `}
      >
        LOCKED
      </div>
    </div>
  );
}