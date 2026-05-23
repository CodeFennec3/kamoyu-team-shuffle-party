import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground({
  variant = "home",
}) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const config = {
    /* =========================
       HOME
    ========================= */
    home: {
      speed: 0.05,
      opacity: 0.2,
      count: 35,
      color: "#ffffff",
    },

    /* =========================
       LOBBY
    ========================= */
    lobby: {
      speed: 0.08,
      opacity: 0.25,
      count: 45,
      color: "#67e8f9",
    },

    /* =========================
       INTRO
    ========================= */
    intro: {
      speed: 0.2,
      opacity: 0.3,
      count: 70,
      color: "#60a5fa",
    },

    /* =========================
       CAPTAIN SLOT
    ========================= */
    captainSlotA: {
      speed: 0.35,
      opacity: 0.4,
      count: 90,
      color: "#22d3ee",
    },

    captainSlotB: {
      speed: 0.35,
      opacity: 0.4,
      count: 90,
      color: "#c084fc",
    },

    /* =========================
       CAPTAIN REVEAL
    ========================= */
    captainRevealA: {
      speed: 0.08,
      opacity: 0.5,
      count: 45,
      color: "#22d3ee",
    },

    captainRevealB: {
      speed: 0.08,
      opacity: 0.5,
      count: 45,
      color: "#c084fc",
    },

    /* =========================
       TEAM NAME
    ========================= */
    teamName: {
      speed: 0.1,
      opacity: 0.4,
      count: 60,
      color: "#ffffff",
    },

    /* =========================
       DISTRIBUTION
    ========================= */
    distribution: {
      speed: 0.08,
      opacity: 0.25,
      count: 50,
      color: "#ffffff",
    },

    /* =========================
       FIGHT
    ========================= */
    fight: {
      speed: 0.6,
      opacity: 0.5,
      count: 120,
      color: "#ff0000",
    },

    /* =========================
       RESULT
    ========================= */
    result: {
      speed: 0.05,
      opacity: 0.2,
      count: 40,
      color: "#ffffff",
    },

    /* =========================
       ADMIN
    ========================= */
    admin: {
      speed: 0.03,
      opacity: 0.15,
      count: 20,
      color: "#ffffff",
    },
  };

  /* =========================
     存在しないscreenでも安全化
  ========================= */
  const current =
    config[variant] || config.home;

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: 0,
      },

      fpsLimit: 60,

      detectRetina: true,

      particles: {
        number: {
          value: current.count,
        },

        color: {
          value: current.color,
        },

        opacity: {
          value: current.opacity,
        },

        size: {
          value: {
            min: 1,
            max: 3,
          },
        },

        move: {
          enable: true,
          speed: current.speed,
          direction: "none",
          random: true,
          straight: false,

          outModes: {
            default: "out",
          },
        },

        links: {
          enable: false,
        },
      },
    }),
    [current]
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="pointer-events-none opacity-80"
    />
  );
}