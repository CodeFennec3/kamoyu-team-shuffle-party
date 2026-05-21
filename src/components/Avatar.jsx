export default function Avatar({ src, size = 96 }) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="rounded-full overflow-hidden bg-slate-700 border-4 border-slate-500 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
    >
      {src ? (
        <img
          src={src}
          alt="avatar"
          className="w-full h-full object-cover object-center block"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-full bg-slate-600" />
      )}
    </div>
  );
}