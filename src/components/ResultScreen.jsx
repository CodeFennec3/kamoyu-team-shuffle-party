import { Shuffle } from "lucide-react";
import Avatar from "./Avatar";

export default function ResultScreen({
  teams,
  captains,
  teamNames,
  theme,
  startShuffle,
  setScreen,
}) {
  const renderMembers = (teamKey) => {
    return teams[teamKey]
      .filter(
        (m) => m.id !== captains[teamKey]?.id
      )
      .map((m) => (
        <div
          key={m.id}
          className="
            flex
            flex-col
            items-center

            transition-all
            duration-300

            hover:scale-110
          "
        >
          <Avatar
            src={m.avatar}
            size={70}
          />

          <div className="
            mt-3
            text-lg
            font-bold
            max-w-[100px]
            truncate
          ">
            {m.baseName}
          </div>
        </div>
      ));
  };

  return (
    <div className="
      relative
      min-h-screen
      overflow-hidden
      px-10
      py-10
    ">

      {/* =========================
         TOP
      ========================= */}
      <div className="
        text-center
      ">

        <div className="
          text-yellow-300
          text-2xl
          tracking-[10px]
          font-black
        ">
          チーム分け結果
        </div>

      </div>

      {/* =========================
         MAIN
      ========================= */}
      <div className="
        mt-10

        grid
        grid-cols-[1fr_auto_1fr]
        gap-10
        items-center
      ">

        {/* =========================
           TEAM A
        ========================= */}
        <div
          className={`
            rounded-[40px]
            p-10

            bg-slate-900/60
            backdrop-blur-xl

            border-2
            ${theme?.a.border}

            shadow-[0_0_60px_rgba(0,0,0,0.5)]
          `}
        >

          {/* TEAM NAME */}
          <div className={`
            text-center
            text-5xl
            font-black
            break-words

            ${theme?.a.text}
            ${theme?.a.glow}
          `}>
            {teamNames.a}
          </div>

          {/* LEADER */}
          <div className="
            mt-12
            flex
            flex-col
            items-center
          ">

            <div className="
              text-[64px]
              leading-none
            ">
              👑
            </div>

            <div className="
              text-yellow-300
              font-black
              tracking-[6px]
              mt-2
            ">
              LEADER
            </div>

            <div className="
              relative
              mt-6
            ">

              <div className="
                absolute
                inset-[-14px]
                rounded-full
                border-4
                border-yellow-300/70
                animate-pulse
              " />

              <div className="
                rounded-full
                shadow-[0_0_100px_rgba(255,255,0,0.5)]
              ">
                <Avatar
                  src={captains.a?.avatar}
                  size={160}
                />
              </div>

            </div>

            <div className="
              mt-6
              text-4xl
              font-black
              text-center
            ">
              {captains.a?.baseName}
            </div>
          </div>

          {/* MEMBERS */}
          <div className="
            mt-14
            flex
            flex-wrap
            justify-center
            gap-8
          ">
            {renderMembers("a")}
          </div>
        </div>

        {/* =========================
           VS
        ========================= */}
        <div className="
          text-[140px]
          leading-none
          font-black
          text-white

          animate-pulse

          drop-shadow-[0_0_60px_rgba(255,255,255,1)]
        ">
          VS
        </div>

        {/* =========================
           TEAM B
        ========================= */}
        <div
          className={`
            rounded-[40px]
            p-10

            bg-slate-900/60
            backdrop-blur-xl

            border-2
            ${theme?.b.border}

            shadow-[0_0_60px_rgba(0,0,0,0.5)]
          `}
        >

          {/* TEAM NAME */}
          <div className={`
            text-center
            text-5xl
            font-black
            break-words

            ${theme?.b.text}
            ${theme?.b.glow}
          `}>
            {teamNames.b}
          </div>

          {/* LEADER */}
          <div className="
            mt-12
            flex
            flex-col
            items-center
          ">

            <div className="
              text-[64px]
              leading-none
            ">
              👑
            </div>

            <div className="
              text-yellow-300
              font-black
              tracking-[6px]
              mt-2
            ">
              LEADER
            </div>

            <div className="
              relative
              mt-6
            ">

              <div className="
                absolute
                inset-[-14px]
                rounded-full
                border-4
                border-yellow-300/70
                animate-pulse
              " />

              <div className="
                rounded-full
                shadow-[0_0_100px_rgba(255,255,0,0.5)]
              ">
                <Avatar
                  src={captains.b?.avatar}
                  size={160}
                />
              </div>

            </div>

            <div className="
              mt-6
              text-4xl
              font-black
              text-center
            ">
              {captains.b?.baseName}
            </div>
          </div>

          {/* MEMBERS */}
          <div className="
            mt-14
            flex
            flex-wrap
            justify-center
            gap-8
          ">
            {renderMembers("b")}
          </div>
        </div>
      </div>

      {/* =========================
         BUTTONS
      ========================= */}
      <div className="
        mt-16
        flex
        justify-center
        gap-8
      ">

        {/* RESHUFFLE */}
        <button
          onClick={startShuffle}
          className="
            group

            px-14
            py-6

            rounded-[24px]

            text-3xl
            font-black

            inline-flex
            items-center
            gap-5

            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500

            hover:scale-110
            active:scale-95

            transition-all
            duration-300

            shadow-[0_0_60px_rgba(0,200,255,0.5)]
          "
        >

          <Shuffle
            size={40}
            className="
              group-hover:rotate-180
              transition-all
              duration-500
            "
          />

          もう一回チーム分け
        </button>

        {/* BACK */}
        <button
          onClick={() => setScreen("lobby")}
          className="
            px-12
            py-6

            rounded-[24px]

            text-3xl
            font-black

            bg-slate-800/80
            border
            border-white/10

            hover:bg-slate-700
            hover:scale-105

            transition-all
            duration-300
          "
        >
          ロビーへ戻る
        </button>
      </div>

      {/* =========================
         FOOTER
      ========================= */}
      <div className="
        mt-14
        text-center

        text-slate-400
        text-lg
        tracking-[6px]
      ">
        TEAM SHUFFLE SYSTEM
      </div>

    </div>
  );
}