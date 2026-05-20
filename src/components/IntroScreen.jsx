export default function IntroScreen() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <div className="text-8xl font-black tracking-[12px] animate-pulse text-cyan-300">
        TEAM SHUFFLE
      </div>

      <div className="mt-10 text-2xl text-slate-300 animate-bounce">
        メンバーを混ぜています...
      </div>
    </div>
  );
}