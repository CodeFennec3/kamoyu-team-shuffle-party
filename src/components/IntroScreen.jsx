import { useEffect, useState } from "react";

export default function IntroScreen() {
  const [step, setStep] = useState(0);

  const texts = [
    "INITIALIZING SYSTEM",
    "SCANNING PLAYERS",
    "BALANCING TEAMS",
    "PREPARING MATCH",
    "READY",
  ];

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current++;

      if (current >= texts.length) {
        clearInterval(interval);
        return;
      }

      setStep(current);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        relative
        h-screen

        overflow-visible

        flex
        flex-col
        items-center
        justify-start

        px-6
        pt-20
        pb-10

        bg-black/20
      "
    >
      {/* =========================
         GRID BG
      ========================= */}
      <div
        className="
          absolute
          inset-0

          opacity-[0.08]

          bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]

          bg-[size:40px_40px]
        "
      />

      {/* =========================
         SCAN LINE
      ========================= */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
        "
      >
        <div
          className="
            absolute
            left-0
            w-full
            h-[2px]

            bg-cyan-300/50

            animate-[scan_2.5s_linear_infinite]

            shadow-[0_0_20px_rgba(34,211,238,0.8)]
          "
        />
      </div>

      {/* =========================
         MAIN TITLE
      ========================= */}
      <div
        className="
          relative
          z-10

          text-center

          text-[90px]

          leading-[1.35]

          font-black
          tracking-[12px]

          text-cyan-300

          animate-pulse

          drop-shadow-[0_0_50px_rgba(34,211,238,0.9)]
        "
      >
        TEAM SHUFFLE
      </div>

      {/* =========================
         SUB
      ========================= */}
      <div
        className="
          mt-6

          text-2xl
          tracking-[10px]
          font-black

          text-slate-300
        "
      >
        SYSTEM ONLINE
      </div>

      {/* =========================
         STATUS
      ========================= */}
      <div
        className="
          mt-16

          w-full
          max-w-[700px]

          space-y-6
        "
      >
        {texts.map((text, index) => (
          <div
            key={text}
            className={`
              flex
              items-center
              justify-between

              px-6
              py-4

              rounded-2xl

              border

              transition-all
              duration-500

              ${
                index <= step
                  ? "border-cyan-400/60 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03]"
              }
            `}
          >
            {/* TEXT */}
            <div
              className={`
                text-xl
                font-bold
                tracking-[4px]

                ${
                  index <= step
                    ? "text-cyan-200"
                    : "text-slate-500"
                }
              `}
            >
              {text}
            </div>

            {/* STATUS */}
            <div
              className={`
                text-sm
                font-black
                tracking-[3px]

                ${
                  index < step
                    ? "text-green-400"
                    : index === step
                    ? "text-yellow-300 animate-pulse"
                    : "text-slate-600"
                }
              `}
            >
              {index < step
                ? "COMPLETE"
                : index === step
                ? "PROCESSING"
                : "WAITING"}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
         LOADING BAR
      ========================= */}
      <div
        className="
          mt-12

          w-full
          max-w-[700px]

          h-[18px]

          rounded-full
          overflow-hidden

          bg-slate-800
          border
          border-white/10
        "
      >
        <div
          className="
            h-full

            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500

            transition-all
            duration-500

            shadow-[0_0_30px_rgba(34,211,238,0.8)]
          "
          style={{
            width: `${((step + 1) / texts.length) * 100}%`,
          }}
        />
      </div>

      {/* =========================
         BOTTOM
      ========================= */}
      <div
        className="
          mt-8

          text-slate-500
          text-sm

          tracking-[6px]
        "
      >
        MATCHMAKING ENGINE v2.0
      </div>

      {/* =========================
         STYLE
      ========================= */}
      <style>
        {`
          @keyframes scan {
            0% {
              top: -10%;
            }

            100% {
              top: 110%;
            }
          }
        `}
      </style>
    </div>
  );
}

