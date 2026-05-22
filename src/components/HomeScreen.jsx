
export default function HomeScreen({
  passwordInput,
  setPasswordInput,
  enterAdmin,
  startViewer
}) {
  return (
    <div className="flex flex-col items-center">

      <button
        style={{
          width: "900px",
          height: "300px"
          background: "red",
          fontSize: "150px"
        }}
      >
          START
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