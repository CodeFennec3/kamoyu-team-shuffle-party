import Avatar from './Avatar';

export default function CaptainScreen({ captain, label, color }) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center animate-pulse">
      <div className={`text-3xl mb-10 font-bold ${color}`}>
        {label}
      </div>

      <Avatar src={captain.avatar} size={220} />

      <div className="mt-8 text-6xl font-black">
        {captain.baseName}
      </div>
    </div>
  );
}