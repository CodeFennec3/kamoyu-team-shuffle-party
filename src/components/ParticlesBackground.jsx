import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
  
      fpsLimit: 30,
  
      detectRetina: true,
  
      particles: {
        number: {
          value: 35,
        },
  
        color: {
          value: '#ffffff',
        },

        opacity: {
          value: 0.25,
        },

        size: {
          value: {
            min: 1,
            max: 2,
          },
        },

        move: {
          enable: true,
          speed: 0.05,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
        },

        links: {
          enable: false,
        },
      },
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="pointer-events-none opacity-70"
    />
  );
}