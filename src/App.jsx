import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Shuffle, Edit, Trash2, Settings, X, Link } from 'lucide-react';

const Button = ({ className = '', children, ...props }) => (
  <button className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium ${className}`} {...props}>
    {children}
  </button>
);

const initialMembers = [];

const funnySuffixes = ['海賊団','秘密結社','温泉同好会','革命軍','騎士団','研究所','最終防衛隊','帝国'];

const Avatar = ({ src }) => (
  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
    <img src={src} className="w-full h-full object-cover" />
  </div>
);

export default function TeamShuffleApp() {
  const [members, setMembers] = useState(initialMembers);
  const [teams, setTeams] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newNicknames, setNewNicknames] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [teamCount, setTeamCount] = useState(2);
  const [isShuffling, setIsShuffling] = useState(false);

  /* =====================
     LOAD / SAVE
  ===================== */
  useEffect(() => {
    const saved = localStorage.getItem('teamShuffleMembers');
    if (saved) setMembers(JSON.parse(saved));

    const params = new URLSearchParams(window.location.search);
    const shared = params.get('data');
    if (shared) {
      try {
        setMembers(JSON.parse(decodeURIComponent(shared)));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('teamShuffleMembers', JSON.stringify(members));
  }, [members]);

  /* =====================
     DERIVED
  ===================== */
  const activeMembers = useMemo(() => members.filter(m => m.active), [members]);
  const inactiveMembers = useMemo(() => members.filter(m => !m.active), [members]);

  /* =====================
     MEMBER OPS
  ===================== */
  const resetForm = () => {
    setNewName(''); setNewNicknames(''); setNewAvatar(''); setEditingId(null);
  };

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

    resetForm();
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

  /* =====================
     SHARE
  ===================== */
  const shareURL = () => {
    const url = `${window.location.origin}?data=${encodeURIComponent(JSON.stringify(members))}`;
    navigator.clipboard.writeText(url);
    alert('共有リンクをコピーしました');
  };

  /* =====================
     TEAM GENERATION
  ===================== */
  const createTeams = () => {
    setIsShuffling(true);

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
    }, 800);
  };

  /* =====================
     EMPTY STATE
  ===================== */
  if (members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">メンバーがいません</h1>
          <p className="text-slate-400">管理モードから追加してください</p>
        </div>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Team Shuffle Pro</h1>

        <div className="flex gap-2 items-center">

          <select value={teamCount} onChange={e => setTeamCount(Number(e.target.value))} className="bg-slate-800 p-2 rounded">
            {[2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} Teams</option>
            ))}
          </select>

          <Button onClick={shareURL}>
            <Link size={16} />
          </Button>

          <Button onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? 'Viewer' : 'Admin'}
          </Button>

          {isAdmin && (
            <Button onClick={() => setAdminOpen(true)}>
              <Settings size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Members */}
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

                {isAdmin && (
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
            <div key={m.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl mb-2 opacity-60">
              <Avatar src={m.avatar} />
              <span>{m.baseName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shuffle */}
      <div className="flex justify-center mt-6">
        <Button onClick={createTeams} disabled={isShuffling}>
          {isShuffling ? 'Shuffling...' : 'Shuffle'}
        </Button>
      </div>

      {/* Teams */}
      {teams && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {Object.values(teams).map((t, i) => (
            <motion.div
              key={i}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
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
        </div>
      )}

      {/* Admin Panel */}
      {adminOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-end">
          <div className="w-96 bg-slate-900 p-4">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Admin Panel</h2>
              <button onClick={() => setAdminOpen(false)}><X/></button>
            </div>

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
              {editingId ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
