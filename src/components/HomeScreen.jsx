START TEST 999
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
          group
          relative

          w-[700px]
          h-[260px]

          rounded-[48px]

          bg-gradient-to-br
          from-cyan-300
          via-sky-400
          to-violet-500

          text-[110px]
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
        <div
          className="
            absolute
            inset-0
            bg-white/20
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
          "
        />

        <div
          className="
            absolute
            -top-20
            -left-20
            w-72
            h-72
            bg-white/30
            rounded-full
            blur-3xl
          "
        />

        <span className="relative z-10">
          START
        </span>
      </button>

      <div className="mt-64 flex items-center gap-5 opacity-60">
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