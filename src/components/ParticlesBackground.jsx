import Particles from 'react-tsparticles';

export default function ParticlesBackground() {
  return (
    <Particles
      options={{
        background: {
          color: {
            value: 'transparent'
          }
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: ['#22d3ee', '#a855f7', '#ffffff']
          },
          links: {
            enable: true,
            color: '#888',
            distance: 120,
            opacity: 0.2
          },
          move: {
            enable: true,
            speed: 1.5
          },
          number: {
            value: 60
          },
          opacity: {
            value: 0.4
          },
          size: {
            value: { min: 1, max: 4 }
          }
        }
      }}
      className="absolute inset-0"
    />
  );
}
