import { useEffect, useState } from "react";

export default function NaokinScreen({
  teams,
  captains,
  teamNames,
  theme,
  setScreen,
}) {
  /* =========================
     TEAM 切替
  ========================= */
  const [selectedTeam, setSelectedTeam] =
    useState("a");

  const [flash, setFlash] =
    useState(false);

  /* =========================
     3秒ごと切替
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);

      setTimeout(() => {
        setFlash(false);

        setSelectedTeam((prev) =>
          prev === "a" ? "b" : "a"
        );
      }, 250);
    }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  /* ========================= */

  const members =
    teams[selectedTeam] || [];

  const teamTheme =
    selectedTeam === "a"
      ? theme?.a
      : theme?.b;

  const teamName =
    selectedTeam === "a"
      ? teamNames.a
      : teamNames.b;

  const leaderId =
    captains[selectedTeam]?.id;

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden

        bg-black

        flex
        flex-col
        items-center
        justify-center

        px-4
        py-10
      "
    >
      {/* =========================
         BACKGROUND
      ========================= */}
      <div
        className={`
          absolute
          inset-0

          transition-all
          duration-300

          ${
            flash
              ? `
                bg-red-700/60
              `
              : `
                bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.25),transparent_70%)]
              `
          }

          z-0
        `}
      />

      {/* =========================
         SCAN LINES
      ========================= */}
      <div
        className="
          absolute
          inset-0

          opacity-10

          bg-[linear-gradient(to_bottom,transparent_0%,white_1%,transparent_2%)]

          bg-[length:100%_8px]

          pointer-events-none

          z-0
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

          flex
          flex-col
          items-center
        "
      >
        {/* WARNING */}
        <div
          className={`
            text-red-500
            font-black

            tracking-[1vw]

            text-[5vw]
            sm:text-[40px]

            drop-shadow-[0_0_30px_rgba(255,0,0,1)]

            transition-all
            duration-300

            ${
              flash
                ? `
                  scale-125
                  opacity-100
                `
                : `
                  scale-100
                  opacity-70
                `
            }
          `}
        >
          WARNING
        </div>

        {/* LOCK ON */}
        <div
          className="
            mt-2

            text-white/60
            font-bold

            tracking-[1vw]

            text-[3vw]
            sm:text-[24px]
          "
        >
          NOW TARGETING...
        </div>

        {/* TEAM NAME */}
        <div
          className={`
            mt-10

            text-center
            font-black

            text-[10vw]
            sm:text-[90px]

            break-words

            transition-all
            duration-300

            ${
              flash
                ? "scale-110"
                : "scale-100"
            }

            ${teamTheme?.text}
            ${teamTheme?.glow}

            drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]
          `}
        >
          {teamName}
        </div>

        {/* TARGET */}
        <div
          className="
            mt-3

            text-white/70
            font-bold

            tracking-[1vw]

            text-[3vw]
            sm:text-[24px]
          "
        >
          TARGET TEAM
        </div>

        {/* MEMBER LIST */}
        <div
          className="
            mt-16

            w-full
            max-w-[1400px]

            flex
            flex-col
            gap-6
          "
        >
          {members.map((member, index) => {
            const isLeader =
              member.id === leaderId;

            return (
              <div
                key={member.id}
                className={`
                  w-full

                  rounded-[30px]

                  px-6
                  py-6

                  text-center

                  font-black

                  text-[11vw]
                  sm:text-[72px]

                  transition-all
                  duration-300

                  ${
                    flash
                      ? "scale-105"
                      : "scale-100"
                  }

                  ${
                    isLeader
                      ? `
                        bg-yellow-400
                        text-black

                        shadow-[0_0_40px_rgba(255,255,0,0.8)]
                      `
                      : `
                        bg-white/10
                        text-white

                        border
                        border-white/10
                      `
                  }
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {isLeader && "👑 "}
                {member.baseName}
              </div>
            );
          })}
        </div>

        {/* BUTTON */}
        <button
          onClick={() =>
            setScreen("result")
          }
          className="
            relative
            z-20

            mt-16

            px-10
            py-5

            rounded-[24px]

            text-2xl
            sm:text-3xl

            font-black

            bg-red-600
            hover:bg-red-500

            hover:scale-105
            active:scale-95

            transition-all
            duration-300

            shadow-[0_0_40px_rgba(255,0,0,0.6)]
          "
        >
          戻る
        </button>
      </div>
    </div>
  );
}