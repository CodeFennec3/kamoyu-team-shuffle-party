export default function Title() {
  return (
    <h1 className="
      absolute top-6 left-1/2 -translate-x-1/2
      text-7xl font-extrabold
      z-10 pointer-events-none
      text-center
      drop-shadow-[0_0_40px_rgba(0,255,255,0.6)]
      whitespace-nowrap
    ">
      <span className="text-pink-400 drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]">
        かもゆ
      </span>

      <span className="text-white mx-2">
        と
      </span>

      <span className="text-cyan-200 mx-2">
        ゆかいな仲間たち
      </span>

      <span className="text-yellow-300 text-7xl ml-4 drop-shadow-[0_0_20px_rgba(255,255,0,0.5)]">
        チーム分け
      </span>
    </h1>
  );
}