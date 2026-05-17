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
    className={`bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Avatar = ({ src }) => (
  <div style={{ width: '96px', height: '96px' }} className="rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 mx-auto">
    <img src={src} alt="avatar" className="w-full h-full object-cover object-center block" />
  </div>
);

export default function TeamShuffleApp() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [screen, setScreen] = useState('lobby'); // lobby | shuffling | result
  const [passwordInput, setPasswordInput] = useState('');
  const [adminMode, setAdminMode] = useState(false);

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
      setDoc(doc(db, 'rooms', ROOM_ID), { members, updatedAt: Date.now() }, { merge: true });
    }, 300);

    return () => clearTimeout(timeout);
  }, [members]);

  const activeMembers = useMemo(() => members.filter((m) => m.active), [members]);

  const toggleActive = (id) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const login = () => {
    if (passwordInput === adminPassword) setAdminMode(true);
  };

  const startShuffle = () => {
    setScreen('shuffling');

    const shuffled = [...activeMembers].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);

    setTimeout(() => {
      setTeams({
        a: shuffled.slice(0, mid),
        b: shuffled.slice(mid)
      });
      setScreen('result');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">かもゆとゆかいな仲間たちをまぜまぜ</h1>

        {!adminMode && (
          <div className="max-w-sm mx-auto mb-8 space-y-2">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-2 bg-slate-800 rounded"
              placeholder="Admin password"
            />
            <Button onClick={login} className="w-full">
              <Lock size={16} /> Login
            </Button>
          </div>
        )}

        {screen === 'lobby' && (
          <>
            <div
              className="mb-10"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
                gap: '16px',
                width: '100%',
                justifyItems: 'center'
              }}
            >
              {members.filter((m) => m.active).map((m) => (
                <div key={m.id} style={{ width: '110px', textAlign: 'center' }}>
                  <Avatar src={m.avatar} />
                  <div className="mt-2 text-sm font-medium truncate">{m.baseName}</div>
                  <button
                    onClick={() => toggleActive(m.id)}
                    className="mt-2 text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg"
                  >
                    不参加
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={startShuffle}>
                <Shuffle size={16} /> シャッフル開始
              </Button>
            </div>
          </>
        )}

        {screen === 'shuffling' && (
          <div className="text-center py-24">
            <h2 className="text-5xl font-bold animate-pulse">シャッフル中...</h2>
            <p className="mt-6 text-slate-400">チームをいい感じに混ぜています</p>
          </div>
        )}

        {screen === 'result' && teams && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(teams).map(([key, team]) => (
              <div key={key} className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Team {key.toUpperCase()}</h2>
                <div className="space-y-3">
                  {team.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700">
                        <img src={m.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <span>{m.baseName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}