export default function HomeScreen({
  passwordInput,
  setPasswordInput,
  enterAdmin,
  startViewer
}) {
  return (
    <div className="h-[75vh] flex flex-col items-center justify-center">
      <button
        onClick={startViewer}
        className="
          px-24
          py-10
          rounded-[32px]
          bg-gradient-to-r
          from-cyan-400
          to-violet-500
          text-6xl
          font-black
          tracking-[6px]
          shadow-[0_0_60px_rgba(139,92,246,0.8)]
          hover:scale-105
          transition-all
          duration-300
        "
      >
        START
      </button>

      <div className="mt-40 flex items-center gap-4 opacity-70">
        <button
          onClick={enterAdmin}
          className="
            px-6
            py-3
            rounded-xl
            bg-slate-800
            border
            border-slate-600
            text-sm
            font-bold
            hover:bg-slate-700
          "
        >
          ADMIN
        </button>

        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="password"
          className="
            px-4
            py-3
            rounded-xl
            bg-slate-900/80
            border
            border-slate-700
            text-sm
            outline-none
            focus:border-violet-400
          "
        />
      </div>
    </div>
  );
}