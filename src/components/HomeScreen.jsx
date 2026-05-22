
export default function HomeScreen({
  passwordInput,
  setPasswordInput,
  enterAdmin,
  startViewer
}) {
  return (
    <div className="flex flex-col items-center">

      <button
        onClick={startViewer}
        className="
          group
          relative

          w-[850px]
          h-[300px]

          rounded-[48px]

          bg-gradient-to-br
          from-cyan-300
          via-sky-400
          to-violet-500

          text-[150px]
          font-black
          tracking-[12px]

          shadow-[0_0_120px_rgba(34,211,238,0.9)]

          hover:scale-105
          active:scale-95

          transition-all
          duration-300

          overflow-hidden
        "
      >
        <span className="relative z-10">
          START
        </span>
      </button>

      <div className="mt-40 flex items-center gap-4 opacity-70">
        <button
          onClick={enterAdmin}
          className="
            px-5
            py-2
            rounded-xl
            bg-slate-900/80
            border
            border-cyan-400/40
            text-xs
            font-bold
            hover:bg-slate-800
            hover:border-cyan-300
            transition-all
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
            w-[180px]
            px-4
            py-2
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