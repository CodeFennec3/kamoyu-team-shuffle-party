export default function TeamNameScreen({ teamNames }) {
  return (
    <div className="h-[70vh] flex items-center justify-center gap-24 px-10">
      <div className="w-1/2 text-center text-6xl font-black text-cyan-300 drop-shadow-[0_0_40px_rgba(34,211,238,1)] animate-pulse break-words">
        {teamNames.a}
      </div>

      <div className="w-1/2 text-center text-6xl font-black text-violet-300 drop-shadow-[0_0_40px_rgba(192,132,252,1)] animate-pulse break-words">
        {teamNames.b}
      </div>

      <div className={`
        text-6xl
        font-black
        tracking-[6px]
        uppercase
        ${theme.a.text}
        ${theme.a.glow}
      `}>
        ⚡ {teamNames.a} ⚡
      </div>
    </div>
  );
}