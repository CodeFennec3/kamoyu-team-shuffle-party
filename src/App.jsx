import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Shuffle, Edit, Trash2, Settings, X, Lock } from 'lucide-react';

const Button = ({ className = '', children, ...props }) => (
  <button className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium ${className}`} {...props}>
    {children}
  </button>
);

const funnySuffixes = ['海賊団','秘密結社','温泉同好会','革命軍','騎士団','研究所','最終防衛隊','帝国'];

const Avatar = ({ src }) => (
  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
    <img src={src} className="w-full h-full object-cover" />
  </div>
);

export default function TeamShuffleApp() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);

  const [adminMode, setAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const adminPassword = 'team123';

  const [adminOpen, setAdminOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newNicknames, setNewNicknames] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [teamCount, setTeamCount] = useState(2);
  const [isShuffling, setIsShuffling] = useState(false);

  /* ================= AUTH ================= */
  const loginAdmin = () => {
    if (passwordInput === adminPassword) {
      setAdminMode(true);
      setPasswordInput('');
    } else {
      alert('パスワードが違います');
    }
  };

  const logoutAdmin = () => setAdminMode(false);

  /* ================= LOAD / SAVE ================= */
  useEffect(() => {
    const saved = localStorage.getItem('teamShuffleMembers');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('teamShuffleMembers', JSON.stringify(members));
  }, [members]);

  const activeMembers = useMemo(() => members.filter(m => m.active), [members]);
  const inactiveMembers = useMemo(() => members.filter(m => !m.active), [members]);

  /* ================= MEMBER ================= */
  const saveMember = () => {
    if (!newName) return;

    const member = {
      id: editingId || Date.now(),
      baseName: newName,
      nicknames: newNicknames.split(',').map(n => n.trim()).filter(Boolean),
      avatar: newAvatar || 'https://cdn.discordapp.com/embed/avatars/4.png',
      active: true
    };

    setMembers(prev => {
      if (editingId) return prev.map(m => m.id === editingId ? member : m);
      return [...prev, member];
    });

    setNewName('');
    setNewNicknames('');
    setNewAvatar('');
    setEditingId(null);
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setNewName(m.baseName);
    setNewNicknames(m.nicknames.join(','));
    setNewAvatar(m.avatar);
    setAdminOpen(true);
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  /* ================= SHUFFLE (FIXED ANIMATION) ================= */
  const createTeams = () => {
    setIsShuffling(true);
    setTeams(null); // ← 重要：一度消す（アニメ発火用）

    setTimeout(() => {
      const shuffled = [...activeMembers].sort(() => Math.random() - 0.5);

      const teamsArr = Array.from({ length: teamCount }, () => []);

      shuffled.forEach((m, i) => {
        teamsArr[i % teamCount].push({
          ...m,
          displayName: m.nicknames[Math.floor(Math.random() * m.nicknames.length)]
        });
      });

      const result = {};

      teamsArr.forEach((t, idx) => {
        const leader = t[Math.floor(Math.random() * t.length)] || {};
        result[`t${idx}`] = {
          name: `${leader.displayName || 'Team'} ${funnySuffixes[idx % funnySuffixes.length]}`,
          members: t,
          leader: leader.id
        };
      });

      setTeams(result);
      setIsShuffling(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Shuffle Pro</h1>

        <div className="flex gap-2 items-center">

          {/* team count */}
          <select value={teamCount} onChange={e => setTeamCount(Number(e.target.value))} className="bg-slate-800 p-2 rounded">
            {[2,3,4,5,6].map(n => <option key={n}>{n} Teams</option>)}
          </select>

          {/* admin auth */}
          {!adminMode ? (
            <div className="flex gap-2">
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="admin password"
                className="bg-slate-800 px-2 rounded"
              />
              <Button onClick={loginAdmin}>
                <Lock size={16} />
              </Button>
            </div>
          ) : (
            <Button onClick={logoutAdmin}>
              Admin ON
            </Button>
          )}

          {adminMode && (
            <Button onClick={() => setAdminOpen(true)}>
              <Settings size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* MEMBERS */}
      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <h2 className="text-green-300 font-bold mb-2">Active</h2>

          <AnimatePresence>
            {activeMembers.map(m => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center bg-slate-800 p-3 rounded-xl mb-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={m.avatar} />
                  <div>
                    <div className="font-bold">{m.baseName}</div>
                    <div className="text-xs text-slate-400">{m.nicknames.join(', ')}</div>
                  </div>
                </div>

                {adminMode && (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(m)}><Edit size={16} /></button>
                    <button onClick={() => deleteMember(m.id)}><Trash2 size={16} /></button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div>
          <h2 className="text-pink-300 font-bold mb-2">Inactive</h2>
          {inactiveMembers.map(m => (
            <div key={m.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl opacity-60">
              <Avatar src={m.avatar} />
              <span>{m.baseName}</span>
            </div>
          ))}
        </div>

      </div>

      {/* SHUFFLE */}
      <div className="flex justify-center mt-6">
        <Button onClick={createTeams} disabled={isShuffling}>
          <Shuffle className="mr-2" />
          {isShuffling ? 'Shuffling...' : 'Shuffle'}
        </Button>
      </div>

      {/* TEAMS */}
      <AnimatePresence>
        {teams && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-3 gap-4 mt-6"
          >
            {Object.values(teams).map((t, i) => (
              <motion.div
                key={i}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 p-4 rounded-xl"
              >
                <h2 className="font-bold mb-2">{t.name}</h2>
                {t.members.map(m => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <Avatar src={m.avatar} />
                    <span>{m.displayName}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN PANEL */}
      {adminOpen && adminMode && (
        <div className="fixed inset-0 bg-black/60 flex justify-end">
          <div className="w-96 bg-slate-900 p-4">
            <h2 className="font-bold mb-2">Admin Panel</h2>

            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="name" className="w-full p-2 mb-2 bg-slate-800" />
            <input value={newNicknames} onChange={e => setNewNicknames(e.target.value)} placeholder="nicknames" className="w-full p-2 mb-2 bg-slate-800" />

            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const r = new FileReader();
              r.onload = () => setNewAvatar(r.result);
              r.readAsDataURL(file);
            }} />

            <Button className="mt-2 w-full" onClick={saveMember}>
              Save
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
