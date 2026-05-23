import { useEffect, useState } from "react";

export default function TeamNameScreen({
  teamNames,
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
      overflow-hidden
      flex
      items-center
      justify-center
    ">

      {/* =========================
         LEFT GLOW
      ========================= */}
      <div className="
        absolute
        left-[-180px]
        top-1/2
        -translate-y-1/2

        w-[700px]
        h-[700px]

        rounded-full
        bg-cyan-400/10
        blur-[120px]
      " />

      {/* =========================
         RIGHT GLOW
      ========================= */}
      <div className="
        absolute
        right-[-180px]
        top-1/2
        -translate-y-1/2

        w-[700px]
        h-[700px]

        rounded-full
        bg-violet-400/10
        blur-[120px]
      " />

      {/* =========================
         CONTENT
      ========================= */}
      <div className="
        relative
        z-10
        w-full
        px-16
      ">

        {/* TEAM LOCKED */}
        <div
          className={`
            text-center
            text-3xl
            font-black
            tracking-[12px]
            text-yellow-300

            transition-all
            duration-700

            ${
              show
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }
          `}
        >
          TEAM LOCKED
        </div>

        {/* MAIN */}
        <div className="
          mt-24
          grid
          grid-cols-[1fr_auto_1fr]
          items-center
          gap-12
        ">

          {/* TEAM A */}
          <div
            className={`
              text-center

              transition-all
              duration-1000
              delay-200

              ${
                show
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }
            `}
          >

            <div className="
              text-cyan-300
              text-[84px]
              leading-[0.95]
              font-black
              break-words

              drop-shadow-[0_0_40px_rgba(34,211,238,1)]

              animate-pulse
            ">
              {teamNames.a}
            </div>

          </div>

          {/* VS */}
          <div
            className={`
              text-[140px]
              leading-none
              font-black
              text-white

              drop-shadow-[0_0_50px_rgba(255,255,255,0.9)]

              transition-all
              duration-1000
              delay-500

              ${
                show
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 rotate-12"
              }
            `}
          >
            VS
          </div>

          {/* TEAM B */}
          <div
            className={`
              text-center

              transition-all
              duration-1000
              delay-200

              ${
                show
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }
            `}
          >

            <div className="
              text-violet-300
              text-[84px]
              leading-[0.95]
              font-black
              break-words

              drop-shadow-[0_0_40px_rgba(192,132,252,1)]

              animate-pulse
            ">
              {teamNames.b}
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div
          className={`
            mt-24
            text-center
            text-slate-300
            text-2xl
            tracking-[8px]
            font-bold

            transition-all
            duration-1000
            delay-700

            ${
              show
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          PREPARING MATCH...
        </div>
      </div>
    </div>
  );
}