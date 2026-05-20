import Avatar from './Avatar';

export default function DistributionScreen({ animatedTeams, teamNames }) {
  return (
    <div className="min-h-[70vh] flex items-start justify-between px-16 pt-10">
      <div className="w-[42%] bg-slate-900/50 rounded-3xl p-8 border border-cyan-500">
        <div className="text-5xl font-black text-cyan-300 mb-10 text-center break-words">
          {teamNames.a}
        </div>

        <div className="space-y-12">
          {animatedTeams.a.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center animate-[fadeIn_0.5s_ease]"
            >
              <Avatar src={m.avatar} size={84} />

              <div className="text-xl font-bold mt-3 text-center">
                {m.baseName}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-5xl font-black animate-pulse pt-40">
        VS
      </div>

      <div className="w-[42%] bg-slate-900/50 rounded-3xl p-8 border border-violet-500">
        <div className="text-5xl font-black text-violet-300 mb-10 text-center break-words">
          {teamNames.b}
        </div>

        <div className="space-y-12">
          {animatedTeams.b.map((m) => (
            <div
              key={m.id}
              className="flex flex-col items-center animate-[fadeIn_0.5s_ease]"
            >
              <Avatar src={m.avatar} size={84} />

              <div className="text-xl font-bold mt-3 text-center">
                {m.baseName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}