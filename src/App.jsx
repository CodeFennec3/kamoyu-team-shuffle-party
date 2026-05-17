import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Shuffle, Lock, Trash2, Pencil, UserCheck, UserX } from 'lucide-react';

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
    className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Avatar = ({ src, size = 40 }) => (
  <div
    className="rounded-full overflow-hidden bg-slate-700 shrink-0 border border-slate-600"
    style={{ width: size, height: size }}
  >
    <img src={src} alt="avatar" className="w-full h-full object-cover" />
  </div>
);

export default function TeamShuffleApp() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [view, setView] = useState('dashboard');
  const [isShuffling, setIsShuffling] = useState(false);

  const [name, setName] = useState('');
  const [nicknames, setNicknames] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editId, setEditId] = useState(null);
  const [avatarSize, setAvatarSize] = useState(40);

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

  const activeMembers = useMemo(() => members.filter((m) => m.active), [members]);

  const login = () => {
    if (passwordInput === adminPassword) setAdminMode(true);
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 200;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const saveMember = () => {
    if (!name.trim()) return;

    const newMember = {
      id: editId || Date.now(),
      baseName: name,
      nicknames: nicknames.split(',').map((n) => n.trim()).filter(Boolean),
      avatar: avatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      active: true
    };

    if (editId) {
      setMembers((prev) => prev.map((m) => (m.id === editId ? newMember : m)));
    } else {
      setMembers((prev) => [...prev, newMember]);
    }

    setName('');
    setNicknames('');
    setAvatar('');
    setEditId(null);
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const editMember = (member) => {
    setName(member.baseName);
    setNicknames(member.nicknames.join(','));
    setAvatar(member.avatar);
    setEditId(member.id);
  };

  const toggleActive = (id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

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

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <div className="w-64 bg-slate-900 p-4 space-y-3">
        <h1 className="font-bold text-lg">Team Shuffle</h1>

        <button onClick={() => setView('dashboard')} className="w-full p-2 bg-slate-800 rounded">
          Dashboard
        </button>
        <button onClick={() => setView('shuffle')} className="w-full p-2 bg-slate-800 rounded">
          Shuffle
        </button>

        {!adminMode ? (
          <div className="pt-4 border-t border-slate-700 space-y-2">
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
        ) : (
          <div className="text-green-400 pt-4 border-t border-slate-700">Admin ON</div>
        )}

        <div className="pt-4 border-t border-slate-700">
          <div className="text-sm mb-2">アイコンサイズ</div>
          <input
            type="range"
            min="30"
            max="70"
            value={avatarSize}
            onChange={(e) => setAvatarSize(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        {adminMode && (
          <div className="bg-slate-900 p-4 rounded-xl mb-4 space-y-2">
            <h2 className="font-bold">メンバー管理</h2>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" className="w-full p-2 bg-slate-800 rounded" />
            <input value={nicknames} onChange={(e) => setNicknames(e.target.value)} placeholder="ニックネーム" className="w-full p-2 bg-slate-800 rounded" />

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const compressed = await compressImage(file);
                setAvatar(compressed);
              }}
            />

            {avatar && <img src={avatar} alt="preview" className="w-16 h-16 rounded-full object-cover" />}

            <Button onClick={saveMember} className="w-full">
              {editId ? '更新' : '追加'}
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-slate-900 p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={m.avatar} size={avatarSize} />
                <span className={`truncate ${!m.active ? 'opacity-40 line-through' : ''}`}>
                  {m.baseName}
                </span>
              </div>

              {adminMode && (
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(m.id)}>
                    {m.active ? <UserCheck size={16} /> : <UserX size={16} />}
                  </button>
                  <button onClick={() => editMember(m)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteMember(m.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {view === 'shuffle' && (
          <div className="mt-6">
            <Button onClick={createTeams} disabled={isShuffling}>
              <Shuffle size={16} /> {isShuffling ? 'Shuffling...' : 'Start'}
            </Button>

            {teams && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {Object.entries(teams).map(([key, team]) => (
                  <div key={key} className="bg-slate-900 p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Team {key.toUpperCase()}</h3>
                    <div className="space-y-2">
                      {team.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 flex-wrap">
                          <Avatar src={m.avatar} size={avatarSize} />
                          <span>{m.baseName}</span>
                        </div>
                      ))}
                    </div>
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
