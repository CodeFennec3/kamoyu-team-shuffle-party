import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Shuffle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

const Card = ({ className = '', children, ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const CardContent = ({ className = '', children }) => (
  <div className={className}>{children}</div>
);

const Button = ({ className = '', children, ...props }) => (
  <button
    className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium ${className}`}
    {...props}
  >
    {children}
  </button>
);

const funnySuffixes = [
  '海賊団', '秘密結社', '温泉同好会', '革命軍', '騎士団', '研究所', '最終防衛隊', '帝国'
];

const initialMembers = [
  {
    id: 1,
    baseName: 'Atsushi',
    nicknames: ['フェネック', 'あつ', 'ボス'],
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    active: true,
  },
  {
    id: 2,
    baseName: 'Mika',
    nicknames: ['みかち', 'みか', 'みー'],
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    active: true,
  },
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function TeamShuffleApp() {
  const [members, setMembers] = useState(initialMembers);
  const [teams, setTeams] = useState(null);

  const [newName, setNewName] = useState('');
  const [newNicknames, setNewNicknames] = useState('');
  const [newAvatar, setNewAvatar] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [avatarSize, setAvatarSize] = useState('md');
  const [avatarFit, setAvatarFit] = useState('cover');

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  useEffect(() => {
    const saved = localStorage.getItem('teamShuffleMembers');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('teamShuffleMembers', JSON.stringify(members));
  }, [members]);

  const startEdit = (m) => {
    setEditingId(m.id);
    setNewName(m.baseName);
    setNewNicknames(m.nicknames.join(','));
    setNewAvatar(m.avatar);
  };

  const reset = () => {
    setEditingId(null);
    setNewName('');
    setNewNicknames('');
    setNewAvatar('');
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

    reset();
  };

  const moveMember = (id, active) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, active } : m));
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const createTeams = () => {
    const shuffled = shuffle(members.filter(m => m.active)).map(m => ({
      ...m,
      displayName: randomItem(m.nicknames)
    }));

    const mid = Math.ceil(shuffled.length / 2);

    setTeams({
      a: { name: 'Team A', members: shuffled.slice(0, mid) },
      b: { name: 'Team B', members: shuffled.slice(mid) }
    });
  };

  const Avatar = ({ src }) => (
    <div className={`${sizeMap[avatarSize]} rounded-full overflow-hidden bg-slate-600 flex items-center justify-center border border-slate-500`}
    >
      {src ? (
        <img
          src={src}
          className={`w-full h-full ${avatarFit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      ) : (
        <ImageIcon className="text-slate-300" />
      )}
    </div>
  );

  const MemberCard = ({ m }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between gap-3 bg-slate-800/80 backdrop-blur p-3 rounded-2xl border border-slate-700 shadow"
    >
      <div className="flex items-center gap-3">
        <Avatar src={m.avatar} />
        <div>
          <div className="text-white font-semibold">{m.baseName}</div>
          <div className="text-xs text-slate-400">{m.nicknames.join(', ')}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => startEdit(m)}><Edit size={16} /></button>
        <button onClick={() => deleteMember(m.id)}><Trash2 size={16} className="text-red-400" /></button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Shuffle Pro</h1>
      </div>

      {/* UI Settings */}
      <div className="flex gap-4 mb-4">
        <select value={avatarSize} onChange={e => setAvatarSize(e.target.value)} className="bg-slate-800 p-2 rounded">
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>

        <select value={avatarFit} onChange={e => setAvatarFit(e.target.value)} className="bg-slate-800 p-2 rounded">
          <option value="cover">Fill (cover)</option>
          <option value="contain">Full image (contain)</option>
        </select>
      </div>

      {/* Editor */}
      <div className="bg-slate-900 p-4 rounded-2xl mb-6 border border-slate-800">
        <div className="grid gap-2">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="name" className="p-2 rounded bg-slate-800" />
          <input value={newNicknames} onChange={e => setNewNicknames(e.target.value)} placeholder="nicknames" className="p-2 rounded bg-slate-800" />

          <input type="file" accept="image/*" onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setNewAvatar(reader.result);
            reader.readAsDataURL(file);
          }} />

          <div className="flex gap-2">
            <Button onClick={saveMember}>{editingId ? 'Update' : 'Add'}</Button>
            {editingId && <Button onClick={reset}>Cancel</Button>}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="grid md:grid-cols-2 gap-4">
        {members.map(m => <MemberCard key={m.id} m={m} />)}
      </div>

      {/* Teams */}
      <div className="flex justify-center mt-6">
        <Button onClick={createTeams}><Shuffle className="mr-2" size={16} />Shuffle</Button>
      </div>

      {teams && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {Object.values(teams).map(t => (
            <div key={t.name} className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h2 className="font-bold mb-2">{t.name}</h2>
              {t.members.map(m => (
                <div key={m.id} className="flex items-center gap-2 py-1">
                  <Avatar src={m.avatar} />
                  <span>{m.displayName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
