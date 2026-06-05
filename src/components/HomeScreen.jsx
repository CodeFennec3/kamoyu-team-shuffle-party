import { useEffect, useMemo, useState } from "react";
import Title from "./Title";

/* =========================
   🎲 配列シャッフル
========================= */
function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

/* =========================
   🦙 ラマ
========================= */
function FloatingLlama() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = () => {
      setPos({
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
      });
    };

    move();

    const interval = setInterval(move, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        absolute text-4xl opacity-10
        pointer-events-none
        transition-all duration-[6000ms]
      "
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
    >
      🦙
    </div>
  );
}

/* =========================
   🦆 小鴨（中央回避）
========================= */
function FloatingDuck() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const generate = () => {
    let x;
    let y;

    do {
      x = 5 + Math.random() * 90;
      y = 5 + Math.random() * 90;
    } while (
      x > 35 &&
      x < 65 &&
      y > 35 &&
      y < 65
    );

    return { x, y };
  };

  useEffect(() => {
    const move = () => {
      setPos(generate());
    };

    move();

    const interval = setInterval(move, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        absolute text-3xl opacity-20
        pointer-events-none
        transition-all duration-[5000ms]
      "
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
    >
      🦆
    </div>
  );
}

/* =========================
   🦆 大鴨（ボス）
========================= */
function BigDuck() {
  const [pos, setPos] = useState({
    x: 60,
    y: 40,
  });

  const generate = () => {
    let x;
    let y;

    do {
      x = 5 + Math.random() * 90;
      y = 5 + Math.random() * 90;
    } while (
      x > 25 &&
      x < 75 &&
      y > 25 &&
      y < 80
    );

    return { x, y };
  };

  useEffect(() => {
    const move = () => {
      setPos(generate());
    };

    move();

    const interval = setInterval(move, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        absolute text-[220px] opacity-15
        pointer-events-none
        z-0
        transition-all duration-[5000ms]
        drop-shadow-[0_0_80px_rgba(0,255,255,0.25)]
      "
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "rotate(-8deg)",
      }}
    >
      🦆
    </div>
  );
}

/* =========================
   🏠 HomeScreen
========================= */
export default function HomeScreen({
  passwordInput,
  setPasswordInput,
  enterAdmin,
  startViewer,
}) {
  /* =========================
     🎲 背景アイコン順ランダム化
  ========================= */
  const randomObjects = useMemo(() => {
    const objects = [
      ...Array.from({ length: 6 }).map((_, i) => ({
        type: "llama",
        id: `llama-${i}`,
      })),

      ...Array.from({ length: 6 }).map((_, i) => ({
        type: "duck",
        id: `duck-${i}`,
      })),
    ];

    return shuffleArray(objects);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* 🌌 背景 */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-slate-950
          via-indigo-950
          to-black
          pointer-events-none
        "
      />

      {/* ✨ ネオン */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-cyan-500/10
          via-purple-500/10
          to-pink-500/10
          blur-3xl
          pointer-events-none
        "
      />

      {/* 🎲 ランダム表示 */}
      {randomObjects.map((obj) => {
        if (obj.type === "llama") {
          return (
            <FloatingLlama key={obj.id} />
          );
        }

        return (
          <FloatingDuck key={obj.id} />
        );
      })}

      <BigDuck />

      <Title />

      {/* 🎮 UI */}
      <div
        className="
          w-[540px]
          p-10
          rounded-3xl
          bg-black/40
          backdrop-blur-xl
          border border-cyan-400/20
          shadow-[0_0_90px_rgba(0,200,255,0.25)]
          flex flex-col items-center gap-6
          mt-40
          relative z-20
        "
      >
        <button
          onClick={startViewer}
          className="
            w-full py-8
            text-5xl font-black text-black
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500
            rounded-2xl
            shadow-[0_0_70px_rgba(0,255,255,0.5)]
            hover:scale-110
            active:scale-95
            transition-transform
          "
        >
          START
        </button>

        <div className="flex items-center gap-3 opacity-80">
          <button
            onClick={enterAdmin}
            className="
              px-4 py-2
              rounded-xl
              bg-black/40
              border border-cyan-400/30
              text-xs font-bold text-cyan-200
            "
          >
            ADMIN
          </button>

          <input
            type="password"
            value={passwordInput}
            onChange={(e) =>
              setPasswordInput(
                e.target.value
              )
            }
            placeholder="password"
            className="
              w-[170px]
              px-3 py-2
              rounded-xl
              bg-black/40
              border border-slate-700
              text-sm text-white
              outline-none
              focus:border-violet-400
            "
          />
        </div>

        {/* =========================
           CREDIT
        ========================= */}
        <div className="mt-4 flex flex-col items-center gap-5">

          {/* スタジオかもゆ */}
          <div
            className="
              flex items-center gap-4

              px-6 py-4

              rounded-2xl

              bg-cyan-500/10
              border border-cyan-400/20

              shadow-[0_0_30px_rgba(0,255,255,0.15)]
            "
          >
            <div
              className="
                text-5xl
                animate-bounce
              "
            >
              🦆
            </div>

            <div className="flex flex-col">
              <div
                className="
                  text-sm
                  tracking-[6px]
                  text-cyan-300/70
                "
              >
                製作
              </div>

              <div
                className="
                  text-3xl
                  font-black
                  text-cyan-200
                  tracking-[3px]
                "
              >
                スタジオかもゆ
              </div>
            </div>
          </div>

          {/* FEKAINO OWARI */}
          <div
            className="
              relative

              px-6
              py-3

              border
              border-red-500/30

              bg-red-500/5

              text-center

              rotate-[-2deg]

              shadow-[0_0_40px_rgba(255,0,80,0.25)]
            "
          >
            <div
              className="
                text-xs
                tracking-[8px]
                text-red-300
              "
            >
              SPECIAL THANKS
            </div>

            <div
              className="
                mt-1

                text-[32px]
                font-black
                italic

                tracking-[8px]

                text-white

                drop-shadow-[0_0_20px_rgba(255,0,80,0.9)]
              "
            >
              FEKAINO OWARI
            </div>

            <div
              className="
                absolute
                -top-[2px]
                left-0

                w-full
                h-[2px]

                bg-gradient-to-r
                from-transparent
                via-red-500
                to-transparent
              "
            />
          </div>

          {/* MR. ADULT */}
          <div
            className="
              relative

              px-8
              py-4

              border
              border-yellow-400/40

              bg-yellow-500/10

              text-center

              rotate-[2deg]

              shadow-[0_0_50px_rgba(255,220,0,0.35)]
            "
          >
            <div
              className="
                text-xs
                tracking-[8px]
                text-yellow-300
              "
            >
              SPECIAL THANKS
            </div>

            <div
              className="
                mt-1

                text-[24px]
                font-black

                tracking-[2px]

                text-white

                drop-shadow-[0_0_20px_rgba(255,220,0,0.9)]
              "
            >
              Mr. Adult 桜井リュンリュン
            </div>

            <div
              className="
                absolute
                -top-[2px]
                left-0

                w-full
                h-[2px]

                bg-gradient-to-r
                from-transparent
                via-yellow-400
                to-transparent
              "
            />  
          </div>

        </div>
      </div>
    </div>
  );
}