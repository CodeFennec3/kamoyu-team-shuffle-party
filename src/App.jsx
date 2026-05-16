import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Settings, Lock, Users, LayoutDashboard, X } from 'lucide-react';

const Button = ({ className = '', children, ...props }) => (
  <button className={`bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-xl font-medium ${className}`} {...props}>
    {children}
  </button>
);

const Avatar = ({ src }) => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
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

  const [view, setView] = useState('dashboard'); // SaaS化
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  /* ================= LOAD ================= */
  useEffect(() => {
    const saved = localStorage.getItem('teamShuffleMembers');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('teamShuffleMembers', JSON.stringify(members));
  }, [members]);

  const activeMembers = useMemo(() => members.filter(m => m.active), [members]);

  /* ================= AUTH ================= */
  const login = () => {
    if (passwordInput === adminPassword) setAdminMode(true);
  };

  /* ================= GAME SHUFFLE (roulette feel) ================= */
  const createTeams = () => {
    setIsShuffling(true);
    setTeams(null);

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setShuffleKey(counter);
    }, 120);

    setTimeout(() => {
      clearInterval(interval);

      const shuffled = [...activeMembers].sort(() => Math.random() - 0.5);
      const mid = Math.ceil(shuffled.length / 2);

      const teamA = shuffled.slice(0, mid);
      const teamB = shuffled.slice(mid);

      setTeams({
        a: teamA,
        b: teamB
      });

      setIsShuffling(false);
    }, 1200);
  };

  /* ================= SaaS SIDEBAR ================= */
  const Sidebar = () => (
    <div className="w-64 bg-slate-900 h-screen p-4 space-y-3">
      <h1 className="text-xl font-bold mb-4">Shuffle SaaS</h1>

      <button onClick={() => setView('dashboard')} className="flex items-center gap-2 w-full p-2 rounded bg-slate-800">
        <LayoutDashboard size={16}/> Dashboard
      </button>

      <button onClick={() => setView('members')} className="flex items-center gap-2 w-full p-2 rounded bg-slate-800">
        <Users size={16}/> Members
      </button>

      <button onClick={() => setView('shuffle')} className="flex items-center gap-2 w-full p-2 rounded bg-slate-800">
        <Shuffle size={16}/> Shuffle
      </button>

      <div className="pt-4 border-t border-slate-700">
        {!adminMode ? (
          <div className="space-y-2">
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full p-2 bg-slate-800 rounded"
              placeholder="admin"
            />
            <Button onClick={login} className="w-full flex items-center justify-center gap-2">
              <Lock size={16}/> Login
            </Button>
          </div>
        ) : (
          <div className="text-green-400 text-sm">Admin ON</div>
        )}
      </div>
    </div>
  );

  /* ================= GAME VIEW ================= */
  const ShuffleView = () => (
    <div className="flex flex-col items-center justify-center h-full">

      <motion.div
        key={shuffleKey}
        animate={{ rotate: isShuffling ? 360 : 0, scale: isShuffling ? 1.1 : 1 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-6"
      >
        🎲 Shuffle Mode
      </motion.div>

      <Button onClick={createTeams} disabled={isShuffling} className="px-6">
        <Shuffle className="mr-2" />
        {isShuffling ? 'Shuffling...' : 'Start Shuffle'}
      </Button>

      <AnimatePresence>
        {teams && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-6 mt-8 w-full max-w-4xl"
          >
            {Object.entries(teams).map(([key, team]) => (
              <motion.div
                key={key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 p-4 rounded-xl"
              >
                <h2 className="font-bold mb-3">Team {key.toUpperCase()}</h2>
                {team.map(m => (
                  <div key={m.id} className="flex items-center gap-2 py-1">
                    <Avatar src={m.avatar} />
                    <span>{m.baseName}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ================= DASHBOARD ================= */
  const Dashboard = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl">
          <div className="text-sm text-slate-400">Total Members</div>
          <div className="text-2xl font-bold">{members.length}</div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <div className="text-sm text-slate-400">Active</div>
          <div className="text-2xl font-bold">{activeMembers.length}</div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <div className="text-sm text-slate-400">Teams Ready</div>
          <div className="text-2xl font-bold">{teams ? Object.keys(teams).length : 0}</div>
        </div>
      </div>
    </div>
  );

  /* ================= MAIN ================= */
  return (
    <div className="flex bg-slate-950 text-white h-screen">

      <Sidebar />

      <div className="flex-1 overflow-auto">
        {view === 'dashboard' && <Dashboard />}
        {view === 'shuffle' && <ShuffleView />}
        {view === 'members' && (
          <div className="p-6 text-slate-300">
            メンバー管理は次フェーズで拡張（CRUD UI追加予定）
          </div>
        )}
      </div>

    </div>
  );
}