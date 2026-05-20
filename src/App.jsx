import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Shuffle, Lock } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyClYTbo9nrlRy8vAOi0J9Yz9akbBLz6IjA',
  authDomain: 'kamoyu-team-shuffle.firebaseapp.com',
  projectId: 'kamoyu-team-shuffle',
  storageBucket: 'kamoyu-team-shuffle.firebasestorage.app',
  messagingSenderId: '114052898784',
  appId: '1:114052898784:web:a439faa1055b0eae28d585'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ROOM_ID = 'kamoyu8';

const Button = ({ className = '', children, ...props }) => (
  <button
    className={`font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Avatar = ({ src, size = 96 }) => (
  <div
    style={{ width: `${size}px`, height: `${size}px` }}
    className="rounded-full overflow-hidden bg-slate-700 border-4 border-slate-500 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
  >
    <img
      src={src}
      alt="avatar"
      className="w-full h-full object-cover object-center block"
    />
  </div>
);

export default function TeamShuffleApp() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [screen, setScreen] = useState('lobby');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminMode, setAdminMode] = useState(false);

  const [captainA, setCaptainA] = useState(null);
  const [captainB, setCaptainB] = useState(null);
  const [distributionIndex, setDistributionIndex] = useState(0);
  const [animatedTeams, setAnimatedTeams] = useState({ a: [], b: [] });

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'team123';
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'rooms', ROOM_ID), (snap) => {
      const data = snap.exists() ? snap.data() : null;
      setMembers(data?.members ?? []);
      isInitialLoad.current = false;
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;

    const timeout = setTimeout(() => {
      setDoc(
        doc(db, 'rooms', ROOM_ID),
        {
          members,
          updatedAt: Date.now()
        },
        { merge: true }
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [members]);

  const activeMembers = useMemo(
    () => members.filter((m) => m.active),
    [members]
  );

  const toggleActive = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, active: !m.active } : m
      )
    );
  };

  const login = () => {
    if (passwordInput === adminPassword) {
      setAdminMode(true);
    }
  };

  const shuffleArray = (array) => {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  const startShuffle = () => {
    const shuffled = shuffleArray(activeMembers);

    const captain1 = shuffled[0];
    const captain2 = shuffled[1];

    const remaining = shuffled.slice(2);

    const teamA = [captain1];
    const teamB = [captain2];

    remaining.forEach((member, index) => {
      if (index % 2 === 0) {
        teamA.push(member);
      } else {
        teamB.push(member);
      }
    });

    setTeams({
      a: teamA,
      b: teamB
    });

    setCaptainA(captain1);
    setCaptainB(captain2);

    setAnimatedTeams({
      a: [captain1],
      b: [captain2]
    });

    setDistributionIndex(0);

    setScreen('intro');

    setTimeout(() => {
      setScreen('captainA');
    }, 1500);

    setTimeout(() => {
      setScreen('captainB');
    }, 3500);

    setTimeout(() => {
      setScreen('teamNames');
    }, 5500);

    setTimeout(() => {
      setScreen('distribution');

      const distributionMembers = remaining;

      distributionMembers.forEach((member, index) => {
        setTimeout(() => {
          setAnimatedTeams((prev) => {
            const next = {
              a: [...prev.a],
              b: [...prev.b]
            };

            if (index % 2 === 0) {
              next.a.push(member);
            } else {
              next.b.push(member);
            }

            return next;
          });

          setDistributionIndex(index + 1);
        }, index * 900);
      });

      setTimeout(() => {
        setScreen('result');
      }, distributionMembers.length * 900 + 2000);
    }, 8000);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-6 py-8">
        <h1 className="text-6xl font-extrabold text-center mb-14 tracking-wide drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
          かもゆとゆかいな仲間たちをまぜまぜ
        </h1>

        {!adminMode && (
          <div className="max-w-sm mx-auto mb-8 space-y-2">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-xl"
              placeholder="Admin password"
            />

            <Button
              onClick={login}
              className="w-full bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-xl"
            >
              <Lock size={16} />
              Login
            </Button>
          </div>
        )}

        {screen === 'lobby' && (
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
              {members
                .filter((m) => m.active)
                .map((m) => (
                  <div
                    key={m.id}
                    className="transition-all duration-300 hover:scale-105"
                    style={{
                      width: '120px',
                      textAlign: 'center'
                    }}
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

            <div className="text-center">
              <Button
                onClick={startShuffle}
                className="
                  text-3xl
                  px-16
                  py-6
                  rounded-2xl
                  bg-cyan-500
                  hover:bg-cyan-400
                  shadow-[0_0_40px_rgba(34,211,238,0.7)]
                  hover:scale-105
                "
              >
                <Shuffle size={32} />
                チーム分け
              </Button>
            </div>
          </>
        )}

        {screen === 'intro' && (
          <div className="h-[70vh] flex flex-col items-center justify-center">
            <div className="text-8xl font-black tracking-[12px] animate-pulse text-cyan-300">
              TEAM SHUFFLE
            </div>

            <div className="mt-10 text-2xl text-slate-300 animate-bounce">
              メンバーを混ぜています...
            </div>
          </div>
        )}

        {screen === 'captainA' && captainA && (
          <div className="h-[70vh] flex flex-col items-center justify-center animate-pulse">
            <div className="text-3xl mb-10 text-cyan-300 font-bold">
              TEAM A LEADER
            </div>

            <Avatar src={captainA.avatar} size={220} />

            <div className="mt-8 text-6xl font-black">
              {captainA.baseName}
            </div>
          </div>
        )}

        {screen === 'captainB' && captainB && (
          <div className="h-[70vh] flex flex-col items-center justify-center animate-pulse">
            <div className="text-3xl mb-10 text-violet-300 font-bold">
              TEAM B LEADER
            </div>

            <Avatar src={captainB.avatar} size={220} />

            <div className="mt-8 text-6xl font-black">
              {captainB.baseName}
            </div>
          </div>
        )}

        {screen === 'teamNames' && (
          <div className="h-[70vh] flex items-center justify-center gap-40">
            <div className="text-8xl font-black text-cyan-300 drop-shadow-[0_0_40px_rgba(34,211,238,1)] animate-pulse">
              TEAM A
            </div>

            <div className="text-8xl font-black text-violet-300 drop-shadow-[0_0_40px_rgba(192,132,252,1)] animate-pulse">
              TEAM B
            </div>
          </div>
        )}

        {screen === 'distribution' && (
          <div className="min-h-[70vh] flex items-center justify-between px-16">
            <div className="w-[40%] bg-slate-900/50 rounded-3xl p-8 border border-cyan-500">
              <div className="text-5xl font-black text-cyan-300 mb-8">
                TEAM A
              </div>

              <div className="space-y-6">
                {animatedTeams.a.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-5 animate-[fadeIn_0.5s_ease]"
                  >
                    <Avatar src={m.avatar} size={72} />

                    <div className="text-2xl font-bold">
                      {m.baseName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-5xl font-black animate-pulse">
              VS
            </div>

            <div className="w-[40%] bg-slate-900/50 rounded-3xl p-8 border border-violet-500">
              <div className="text-5xl font-black text-violet-300 mb-8">
                TEAM B
              </div>

              <div className="space-y-6">
                {animatedTeams.b.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-5 animate-[fadeIn_0.5s_ease]"
                  >
                    <Avatar src={m.avatar} size={72} />

                    <div className="text-2xl font-bold">
                      {m.baseName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === 'result' && teams && (
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
                  <h2 className="text-4xl font-black mb-8">
                    Team {key.toUpperCase()}
                  </h2>

                  <div className="space-y-5">
                    {team.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-5"
                      >
                        <Avatar src={m.avatar} size={64} />

                        <span className="text-2xl font-bold">
                          {m.baseName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6 mt-14">
              <Button
                onClick={startShuffle}
                className="bg-cyan-500 hover:bg-cyan-400 text-2xl px-10 py-5 rounded-2xl"
              >
                <Shuffle size={28} />
                もう一回チーム分け
              </Button>

              <Button
                onClick={() => setScreen('lobby')}
                className="bg-slate-700 hover:bg-slate-600 text-2xl px-10 py-5 rounded-2xl"
              >
                最初に戻る
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
