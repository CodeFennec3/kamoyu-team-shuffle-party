import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import Avatar from "./Avatar";
import Title from "./Title";

export default function LobbyScreen({
  members,
  inactiveIds,
  toggleActive,
  startShuffle,
}) {
  const [loaded, setLoaded] = useState(false);

  /* =========================
     ① 入場アニメ開始
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     ② フラッシュ演出
  ========================= */
  const flash = () => {
    const el = document.createElement("div");

    el.className =
      "fixed inset-0 bg-white opacity-20 z-[999] pointer-events-none";

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 120);
  };

  const handleStart = () => {
    flash();

    document.body.classList.add("animate-pulse");

    setTimeout(() => {
      document.body.classList.remove("animate-pulse");
      startShuffle();
    }, 200);
  };

  return (
    <div
      className="
        relative
        min-h-screen
        pt-40
        bg-gradient-to-br
        from-slate-950
        via-indigo-950
        to-black
        overflow-hidden
      "
    >

      {/* =========================
         🌌 背景グロー
      ========================= */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]
          pointer-events-none
        "
      />

      {/* =========================
         🏷 タイトル
      ========================= */}
      <Title />

      {/* =========================
         👥 メンバー一覧
      ========================= */}
      <div
        className="
          mt-10
          mb-24
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          xl:grid-cols-8
          gap-10
          px-10
          justify-items-center
        "
      >

        {members.map((m, index) => {
          const inactive = inactiveIds.includes(m.id);

          return (
            <div
              key={m.id}
              className={`
                w-[150px]
                p-5
                rounded-3xl
                bg-white/5
                border border-cyan-400/20
                backdrop-blur-xl
                shadow-[0_0_30px_rgba(0,255,255,0.05)]
                transition-all duration-500
                hover:scale-110

                ${
                  loaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }

                ${
                  inactive
                    ? "opacity-30 grayscale scale-90"
                    : ""
                }
              `}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >

              {/* avatar */}
              <div className="flex justify-center">
                <div className="scale-125">
                  <Avatar src={m.avatar} />
                </div>
              </div>

              {/* name */}
              <div
                className="
                  mt-5
                  text-base
                  font-black
                  text-white
                  text-center
                  truncate
                "
              >
                {m.baseName}
              </div>

              {/* button */}
              <button
                onClick={() => toggleActive(m.id)}
                className={`
                  mt-5
                  w-full
                  text-sm
                  font-black
                  py-3
                  rounded-2xl
                  transition
                  shadow-[0_0_20px_rgba(255,0,0,0.2)]

                  ${
                    inactive
                      ? "bg-emerald-600/80 hover:bg-emerald-500"
                      : "bg-red-600/80 hover:bg-red-500"
                  }
                `}
              >
                {inactive ? "参加" : "不参加"}
              </button>

            </div>
          );
        })}
      </div>

      {/* =========================
         🚀 チーム分けボタン
      ========================= */}
      <div className="text-center pb-20">

        <button
          onClick={handleStart}
          className="
            inline-flex items-center gap-4
            text-5xl font-black
            px-28 py-10
            rounded-[40px]
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500
            hover:scale-110
            active:scale-95
            transition-all duration-300
            shadow-[0_0_80px_rgba(0,200,255,0.6)]
            border-4 border-cyan-200/70
            active:brightness-150
          "
        >
          <Shuffle size={44} />
          チーム分け
        </button>

      </div>
    </div>
  );
}