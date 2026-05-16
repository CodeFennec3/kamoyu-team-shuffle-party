import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Settings, Lock, Users, LayoutDashboard, Trash2, Pencil } from 'lucide-react';

// =====================
// Firebase SETUP
// =====================
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClYTbo9nrlRy8vAOi0J9Yz9akbBLz6IjA",
  authDomain: "kamoyu-team-shuffle.firebaseapp.com",
  projectId: "kamoyu-team-shuffle",
  storageBucket: "kamoyu-team-shuffle.firebasestorage.app",
  messagingSenderId: "114052898784",
  appId: "1:114052898784:web:a439faa1055b0eae28d585"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ROOM_ID = "kamoyu8";

// ===================== UI COMPONENTS
// =====================
const Button = ({ className = '', children, ...props }) => (
  <button className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium ${className}`} {...props}>
    {children}
  </button>
);

const Avatar = ({ src, size = 40 }) => (
  <div
    className="rounded-full overflow-hidden bg-slate-700 flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <img src={src} className="w-full h-full object-cover" />
  </div>
);

const funnySuffixes = ['海賊団','秘密結社','温泉同好会','革命軍','騎士団','研究所','最終防衛隊','帝国'];

export default function TeamShuffleApp() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);

  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const adminPassword = 'team123';

  const [view, setView] = useState('dashboard');
  const [isShuffling, setIsShuffling] = useState(false);

  // ===================== MEMBER FORM
  const [name, setName] = useState('');
  const [nicknames, setNicknames] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editId, setEditId] = useState(null);
  const [avatarSize, setAvatarSize] = useState(40);

  // ===================== FIREBASE LOAD
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", ROOM_ID), (snap) => {
      const data = snap.exists() ? snap.data() : null;
      setMembers(data?.members ?? []);
    });
    return () => unsub();
  }, []);

  // ===================== SYNC FIREBASE
  useEffect(() => {
    setDoc(doc(db, "rooms", ROOM_ID), {
      members,
      updatedAt: Date.now()
    }, { merge: true });
  }, [members]);

  const activeMembers = useMemo(() => members.filter(m => m.active), [members]);

  const login = () => {
    if (passwordInput === adminPassword) setAdminMode(true);
  };

  // ===================== ADD / EDIT MEMBER
  const saveMember = () => {
    if (!name) return;

    const newMember = {
      id: editId || Date.now(),
      baseName: name,
      nicknames: nicknames.split(',').map(n => n.trim()).filter(Boolean),
      avatar: avatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      active: true
    };

    if (editId) {
      setMembers(prev => prev.map(m => m.id === editId ? newMember : m));
    } else {
      setMembers(prev => [...prev, newMember]);
    }

    setName('');
    setNicknames('');
    setAvatar('');
    setEditId(null);
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const editMember = (m) => {
    setName(m.baseName);
    setNicknames(m.nicknames.join(','));
    setAvatar(m.avatar);
    setEditId(m.id);
  };

  // ===================== SHUFFLE
  const createTeams = () => {
    setIsShuffling(true);
    setTeams(null);

    setTimeout(() => {
      const shuffled = [...activeMembers].sort(() => Math.random() - 0.5);
      const mid = Math.ceil(shuffled.length / 2);

      setTeams({
        a: shuffled.slice(0, mid),
        b: shuffled.slice(mid)
      });

      setIsShuffling(false);
    }, 800);
  };

  // ===================== UI
  return (
    <div className="flex bg-slate-950 text-white h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 p-4 space-y-3">
        <h1 className="font-bold text-lg">Team Shuffle</h1>

        <button onClick={() => setView('dashboard')} className="w-full p-2 bg-slate-800 rounded">Dashboard</button>
        <button onClick={() => setView('shuffle')} className="w-full p-2 bg-slate-800 rounded">Shuffle</button>

        <div className="pt-4 border-t border-slate-700">
          {!adminMode ? (
            <>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full p-2 bg-slate-800 rounded"
              />
              <Button onClick={login} className="w-full mt-2">
                <Lock size={16}/> Login
              </Button>
            </>
          ) : (
            <div className="text-green-400">Admin ON</div>
          )}
        </div>

        {/* AVATAR SIZE */}
        <div className="pt-4 border-t border-slate-700">
          <div className="text-sm mb-2">アイコンサイズ</div>
          <input type="range" min="30" max="80" value={avatarSize}
            onChange={e => setAvatarSize(Number(e.target.value))} />
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* MEMBER ADMIN PANEL */}
        {adminMode && (
          <div className="bg-slate-900 p-4 rounded-xl mb-4 space-y-2">
            <h2 className="font-bold">メンバー管理</h2>

            <input value={name} onChange={e => setName(e.target.value)} placeholder="名前" className="w-full p-2 bg-slate-800 rounded" />
            <input value={nicknames} onChange={e => setNicknames(e.target.value)} placeholder="ニックネーム" className="w-full p-2 bg-slate-800 rounded" />

            <input type="file" onChange={e => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => setAvatar(reader.result);
              reader.readAsDataURL(file);
            }} />

            {avatar && <img src={avatar} className="w-16 h-16 rounded-full object-cover" />}

            <Button onClick={saveMember} className="w-full">
              {editId ? '更新' : '追加'}
            </Button>
          </div>
        )}

        {/* MEMBER LIST */}
        <div className="grid grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="bg-slate-900 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={m.avatar} size={avatarSize} />
                <span>{m.baseName}</span>
              </div>

              {adminMode && (
                <div className="flex gap-2">
                  <button onClick={() => editMember(m)}><Pencil size={16}/></button>
                  <button onClick={() => deleteMember(m.id)}><Trash2 size={16}/></button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SHUFFLE */}
        {view === 'shuffle' && (
          <div className="mt-6">
            <Button onClick={createTeams} disabled={isShuffling}>
              <Shuffle /> {isShuffling ? 'Shuffling...' : 'Start'}
            </Button>

            {teams && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(teams).map(([k, team]) => (
                  <div key={k} className="bg-slate-900 p-4 rounded-xl">
                    <h3>Team {k}</h3>
                    {team.map(m => (
                      <div key={m.id} className="flex items-center gap-2">
                        <Avatar src={m.avatar} size={avatarSize} />
                        {m.baseName}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}