import { Shuffle } from 'lucide-react';
import Avatar from './Avatar';

export default function ResultScreen({
  teams,
  teamNames,
  startShuffle,
  setScreen
}) {
  return (
    <>
      <div className="text-center mb-8 text-7xl animate-bounce">
        🎉
      </div>

      <div className="grid md:grid-cols-2 gap-10 px-10">
        {Object.entries(teams).map(([key, team]) => (
          <div
            key={key}
            className="bg-slate-900/70 backdrop-blur-md p-8 rounded-3xl border border-slate-700"
          >
            <h2 className="text-4xl font-black mb-8 break-words text-center">
              {teamNames[key]}
            </h2>

            <div className="space-y-12">
              {team.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col items-center"
                >
                  <Avatar src={m.avatar} size={84} />

                  <div className="text-xl font-bold mt-3 text-center">
                    {m.baseName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-14">
        <button
          onClick={startShuffle}
          className="bg-cyan-500 hover:bg-cyan-400 text-2xl px-10 py-5 rounded-2xl inline-flex items-center gap-3 font-bold"
        >
          <Shuffle size={28} />
          もう一回チーム分け
        </button>

        <button
          onClick={() => setScreen('lobby')}
          className="bg-slate-700 hover:bg-slate-600 text-2xl px-10 py-5 rounded-2xl font-bold"
        >
          最初に戻る
        </button>
      </div>
    </>
  );
}