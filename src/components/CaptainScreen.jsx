import { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function CaptainScreen({
  captain,
  label,
  color,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

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
         GOD GLOW
      ========================= */}
      <div className="
        absolute
        w-[900px]
        h-[900px]
        rounded-full
        bg-yellow-300/10
        blur-[140px]
        animate-pulse
      " />

      {/* =========================
         OUTER RINGS
      ========================= */}
      <div
        className="
          absolute
          w-[460px]
          h-[460px]
          rounded-full
          border
          border-yellow-300/20
          animate-spin
        "
        style={{
          animationDuration: "14s",
        }}
      />

      <div
        className="
          absolute
          w-[560px]
          h-[560px]
          rounded-full
          border
          border-white/10
          animate-spin
        "
        style={{
          animationDuration: "22s",
        }}
      />

      {/* =========================
         TEAM LEADER
      ========================= */}
      <div
        className={`
          text-3xl
          font-black
          tracking-[10px]
          mb-6
          z-10

          transition-all
          duration-700

          ${color}

          ${
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }
        `}
      >
        TEAM LEADER
      </div>

      {/* =========================
         LABEL
      ========================= */}
      <div
        className={`
          text-6xl
          font-black
          tracking-[6px]
          z-10

          transition-all
          duration-700
          delay-100

          ${color}

          ${
            show
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }
        `}
      >
        {label}
      </div>

      {/* =========================
         CROWN
      ========================= */}
      <div
        className={`
          text-[80px]
          mt-10
          mb-2
          z-10

          transition-all
          duration-700
          delay-200

          ${
            show
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-50 -rotate-45"
          }
        `}
      >
        👑
      </div>

      {/* =========================
         AVATAR
      ========================= */}
      <div
        className={`
          relative
          z-10
          mt-4

          transition-all
          duration-700
          delay-300

          ${
            show
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }
        `}
      >

        {/* GOLD RING */}
        <div className="
          absolute
          inset-[-24px]
          rounded-full
          border-4
          border-yellow-300/70
          animate-pulse
          shadow-[0_0_80px_rgba(255,255,0,0.7)]
        " />

        {/* INNER GLOW */}
        <div className="
          rounded-full
          shadow-[0_0_120px_rgba(255,255,255,0.7)]
        ">
          <Avatar
            src={captain?.avatar}
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
          text-[88px]
          leading-none
          font-black
          tracking-[6px]
          text-white
          z-10
          text-center

          drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]

          transition-all
          duration-700
          delay-500

          ${
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }
        `}
      >
        {captain?.baseName}
      </div>

      {/* =========================
         LOCKED
      ========================= */}
      <div
        className={`
          mt-10
          text-2xl
          tracking-[12px]
          font-black
          text-yellow-300
          z-10

          transition-all
          duration-700
          delay-700

          ${
            show
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50"
          }
        `}
      >
        LEADER LOCKED
      </div>
    </div>
  );
}