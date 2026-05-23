export default function Avatar({
  src,
  size = 96,

  borderColor = "border-slate-500",

  glow = "shadow-[0_0_25px_rgba(255,255,255,0.15)]",

  className = "",
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`
        relative

        rounded-full
        overflow-hidden

        bg-slate-700

        border-4
        ${borderColor}

        ${glow}

        transition-all
        duration-300

        hover:scale-105

        ${className}
      `}
    >

      {/* INNER LIGHT */}
      <div className="
        absolute
        inset-0

        bg-gradient-to-br
        from-white/10
        to-transparent

        pointer-events-none
        z-10
      " />

      {src ? (
        <img
          src={src}
          alt="avatar"
          className="
            w-full
            h-full
            object-cover
            object-center
            block
          "
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="
          w-full
          h-full

          flex
          items-center
          justify-center

          text-4xl
          bg-slate-600
        ">
          👤
        </div>
      )}
    </div>
  );
}