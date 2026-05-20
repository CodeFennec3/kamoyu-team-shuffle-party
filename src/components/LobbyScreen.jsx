import { Shuffle } from 'lucide-react';
import Avatar from './Avatar';

export default function LobbyScreen({ members, toggleActive, startShuffle }) {
  return (
    <>
      <div
        className="mb-16"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
          gap: '28px',
          width: '100%',
          justifyItems: 'center'
        }}
      >
        {members.map((m) => (
          <div
            key={m.id}
            className="transition-all duration-300 hover:scale-105"
            style={{ width: '120px', textAlign: 'center' }}
          >
            <div className="flex justify-center">
              <Avatar src={m.avatar} />
            </div>

            <div className="mt-4 text-sm font-bold truncate">
              {m.baseName}
            </div>

            <button
              onClick={() => toggleActive(m.id)}
              className="mt-4 text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-bold transition-all"
            >
              不参加
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-32">
        <button
          onClick={startShuffle}
          className="
            inline-flex
            items-center
            gap-4
            text-5xl
            font-black
            px-28
            py-10
            rounded-[32px]
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500
            hover:scale-110
            transition-all
            duration-300
            shadow-[0_0_60px_rgba(59,130,246,0.9)]
            border-4
            border-cyan-200
          "
        >
          <Shuffle size={42} />
          チーム分け
        </button>
      </div>
    </>
  );
}