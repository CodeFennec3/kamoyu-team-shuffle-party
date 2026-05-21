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
      fpsLimit: 60,
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 120,
          enable: true,
          opacity: 0.08,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.02,
        },
        number: {
          value: 45,
        },
        opacity: {
          value: 0.25,
        },
        size: {
          value: { min: 1, max: 2.5 },
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
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
}