import Avatar from "./Avatar";

export default function DistributionScreen({
  animatedTeams,
  teamNames,
  captains,
  theme,
}) {
  const renderMembers = (teamKey) => {
    return animatedTeams[teamKey]
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
            size={74}
          />

          <div
            className="
              mt-3
              text-lg
              font-bold
              text-center
              max-w-[100px]
              truncate
            "
          >
            {m.baseName}
          </div>
        </div>
      ));
  };

  return (
    <div
      className="
        relative
        min-h-screen

        overflow-y-auto
        overflow-x-hidden

        flex
        items-start
        justify-center

        px-10
        py-16
      "
    >
      {/* =========================
         LEFT GLOW
      ========================= */}
      <div
        className="
          absolute
          left-[-220px]
          top-1/2
          -translate-y-1/2

          w-[800px]
          h-[800px]

          rounded-full
          bg-cyan-400/10
          blur-[140px]
        "
      />

      {/* =========================
         RIGHT GLOW
      ========================= */}
      <div
        className="
          absolute
          right-[-220px]
          top-1/2
          -translate-y-1/2

          w-[800px]
          h-[800px]

          rounded-full
          bg-violet-400/10
          blur-[140px]
        "
      />

      {/* =========================
         MAIN
      ========================= */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[1900px]

          grid
          grid-cols-[1fr_auto_1fr]
          gap-10
          items-start
        "
      >
        {/* =========================
           TEAM A
        ========================= */}
        <div
          className={`
            relative

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
          <div
            className={`
              text-center
              text-5xl
              font-black
              break-words

              ${theme?.a.text}
              ${theme?.a.glow}
            `}
          >
            {teamNames.a}
          </div>

          {/* LEADER */}
          <div
            className="
              mt-14
              flex
              flex-col
              items-center
            "
          >
            <div
              className="
                text-[70px]
                leading-none
                mb-2
              "
            >
              👑
            </div>

            <div
              className="
                text-yellow-300
                font-black
                tracking-[6px]
                mb-6
              "
            >
              LEADER
            </div>

            <div
              className="
                relative
                rounded-full
                shadow-[0_0_100px_rgba(255,255,0,0.5)]
              "
            >
              <Avatar
                src={captains.a?.avatar}
                size={170}
              />

              <div
                className="
                  absolute
                  inset-[-14px]
                  rounded-full
                  border-4
                  border-yellow-300/70
                  animate-pulse
                "
              />
            </div>

            <div
              className="
                mt-6
                text-4xl
                font-black
                text-center
              "
            >
              {captains.a?.baseName}
            </div>
          </div>

          {/* MEMBERS */}
          <div
            className="
              mt-16
              flex
              flex-wrap
              justify-center
              gap-8
            "
          >
            {renderMembers("a")}
          </div>
        </div>

        {/* =========================
           VS
        ========================= */}
        <div
          className="
            flex
            items-center
            justify-center

            pt-[240px]
          "
        >
          <div
            className="
              text-[150px]
              leading-none
              font-black
              text-white

              animate-pulse

              drop-shadow-[0_0_60px_rgba(255,255,255,1)]
            "
          >
            VS
          </div>
        </div>

        {/* =========================
           TEAM B
        ========================= */}
        <div
          className={`
            relative

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
          <div
            className={`
              text-center
              text-5xl
              font-black
              break-words

              ${theme?.b.text}
              ${theme?.b.glow}
            `}
          >
            {teamNames.b}
          </div>

          {/* LEADER */}
          <div
            className="
              mt-14
              flex
              flex-col
              items-center
            "
          >
            <div
              className="
                text-[70px]
                leading-none
                mb-2
              "
            >
              👑
            </div>

            <div
              className="
                text-yellow-300
                font-black
                tracking-[6px]
                mb-6
              "
            >
              LEADER
            </div>

            <div
              className="
                relative
                rounded-full
                shadow-[0_0_100px_rgba(255,255,0,0.5)]
              "
            >
              <Avatar
                src={captains.b?.avatar}
                size={170}
              />

              <div
                className="
                  absolute
                  inset-[-14px]
                  rounded-full
                  border-4
                  border-yellow-300/70
                  animate-pulse
                "
              />
            </div>

            <div
              className="
                mt-6
                text-4xl
                font-black
                text-center
              "
            >
              {captains.b?.baseName}
            </div>
          </div>

          {/* MEMBERS */}
          <div
            className="
              mt-16
              flex
              flex-wrap
              justify-center
              gap-8
            "
          >
            {renderMembers("b")}
          </div>
        </div>
      </div>
    </div>
  );
}

