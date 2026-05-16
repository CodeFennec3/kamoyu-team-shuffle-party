import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Shuffle, Settings, Trash2 } from 'lucide-react';

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
  {
    id: 3,
    baseName: 'Taro',
    nicknames: ['たろ', 'たろう'],
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    active: true,
  },
  {
    id: 4,
    baseName: 'Ken',
    nicknames: ['けん', 'けんた'],
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
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
  const [draggedId, setDraggedId] = useState(null);
  const [teams, setTeams] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNicknames, setNewNicknames] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const adminPassword = 'team123';
  const [affinities, setAffinities] = useState([]);
  const [affinityA, setAffinityA] = useState('');
  const [affinityB, setAffinityB] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('teamShuffleMembers');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('teamShuffleMembers', JSON.stringify(members));
  }, [members]);

  const addMember = () => {
    if (!newName) return;
    const newMember = {
      id: Date.now(),
      baseName: newName,
      nicknames: newNicknames.split(',').map((n) => n.trim()).filter(Boolean),
      avatar: newAvatar || 'https://cdn.discordapp.com/embed/avatars/4.png',
      active: true,
    };
    setMembers((prev) => [...prev, newMember]);
    setNewName('');
    setNewNicknames('');
    setNewAvatar('');
  };

  const activeMembers = useMemo(() => members.filter((m) => m.active), [members]);
  const inactiveMembers = useMemo(() => members.filter((m) => !m.active), [members]);

  const moveMember = (id, active) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active } : m))
    );
  };

  const createTeams = () => {
    let bestShuffle = null;
    let bestScore = -Infinity;

    for (let i = 0; i < 15; i++) {
      const shuffledTry = shuffle(activeMembers).map((m) => ({
        ...m,
        displayName: randomItem(m.nicknames),
      }));

      const midTry = Math.ceil(shuffledTry.length / 2);
      const teamATry = shuffledTry.slice(0, midTry);
      const teamBTry = shuffledTry.slice(midTry);

      let score = 0;
      affinities.forEach((pair) => {
        const inA1 = teamATry.some((m) => m.baseName === pair.a);
        const inA2 = teamATry.some((m) => m.baseName === pair.b);
        const inB1 = teamBTry.some((m) => m.baseName === pair.a);
        const inB2 = teamBTry.some((m) => m.baseName === pair.b);
        if ((inA1 && inA2) || (inB1 && inB2)) score += 3;
      });

      if (score > bestScore) {
        bestScore = score;
        bestShuffle = shuffledTry;
      }
    }

    const shuffled = bestShuffle;
    const mid = Math.ceil(shuffled.length / 2);
    const teamA = shuffled.slice(0, mid);
    const teamB = shuffled.slice(mid);

    const leaderA = randomItem(teamA);
    const leaderB = randomItem(teamB);

    setTeams({
      a: {
        name: `${leaderA.displayName}${randomItem(funnySuffixes)}`,
        leader: leaderA.id,
        members: teamA,
      },
      b: {
        name: `${leaderB.displayName}${randomItem(funnySuffixes)}`,
        leader: leaderB.id,
        members: teamB,
      },
    });
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const MemberCard = ({ member }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex items-center gap-3 bg-slate-700 rounded-2xl px-3 py-2 cursor-pointer shadow"
      draggable
      onDragStart={() => setDraggedId(member.id)}
    >
      <img src={member.avatar} alt={member.baseName} className="w-10 h-10 rounded-full" />
      <span className="text-white flex-1">{member.baseName}</span>
      {isAdmin && (
        <button onClick={(e) => { e.stopPropagation(); deleteMember(member.id); }}>
          <Trash2 size={16} className="text-red-400" />
        </button>
      )}
    </motion.div>
  );

  const TeamView = ({ team }) => (
    <Card className="bg-slate-800 border-slate-700 rounded-3xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-violet-300 mb-4">{team.name}</h2>
        <div className="space-y-2">
          {team.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 bg-slate-700 p-2 rounded-xl">
              <img src={m.avatar} alt={m.displayName} className="w-10 h-10 rounded-full" />
              <span className="text-white flex items-center gap-2">
                {m.displayName}
                {team.leader === m.id && <Crown size={16} className="text-yellow-400" />}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🎮 Team Shuffle Party</h1>
          <div className="flex gap-2 items-center">
            {!isAdmin ? (
              <>
                <input
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="管理パスワード"
                  className="rounded-xl px-3 py-2 bg-slate-700 text-white text-sm"
                />
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => passwordInput === adminPassword && setIsAdmin(true)}
                >
                  <Settings className="mr-2" size={16} />管理
                </Button>
              </>
            ) : (
              <Button variant="secondary" className="rounded-2xl" onClick={() => setIsAdmin(false)}>
                管理モードON
              </Button>
            )}
          </div>
        </div>

        {isAdmin && (
          <>
          <Card className="bg-slate-800 rounded-3xl border-slate-700 mb-4">
            <CardContent className="p-4 space-y-3">
              <h2 className="font-bold text-yellow-300">相性補正</h2>
              <input value={affinityA} onChange={(e) => setAffinityA(e.target.value)} placeholder="名前A" className="w-full rounded-xl p-2 bg-slate-700 text-white" />
              <input value={affinityB} onChange={(e) => setAffinityB(e.target.value)} placeholder="名前B" className="w-full rounded-xl p-2 bg-slate-700 text-white" />
              <Button onClick={() => {
                if (!affinityA || !affinityB) return;
                setAffinities((prev) => [...prev, { a: affinityA, b: affinityB }]);
                setAffinityA('');
                setAffinityB('');
              }} className="rounded-xl">相性追加</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 rounded-3xl border-slate-700">
            <CardContent className="p-4 space-y-3">
              <h2 className="font-bold text-cyan-300">メンバー追加</h2>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="名前" className="w-full rounded-xl p-2 bg-slate-700 text-white" />
              <input value={newNicknames} onChange={(e) => setNewNicknames(e.target.value)} placeholder="ニックネーム（カンマ区切り）" className="w-full rounded-xl p-2 bg-slate-700 text-white" />
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setNewAvatar(reader.result);
                reader.readAsDataURL(file);
              }} className="w-full text-sm text-slate-300" />
              {newAvatar && <img src={newAvatar} alt="preview" className="w-16 h-16 rounded-full" />}
              <Button onClick={addMember} className="rounded-xl">追加する</Button>
            </CardContent>
          </Card>
          </>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="bg-slate-800 rounded-3xl border-slate-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => draggedId && moveMember(draggedId, true)}
          >
            <CardContent className="p-4">
              <h2 className="font-bold mb-4 text-green-300">参加メンバー</h2>
              <div className="space-y-2">
                {activeMembers.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-slate-800 rounded-3xl border-slate-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => draggedId && moveMember(draggedId, false)}
          >
            <CardContent className="p-4">
              <h2 className="font-bold mb-4 text-pink-300">不参加メンバー</h2>
              <div className="space-y-2">
                {inactiveMembers.map((m) => <MemberCard key={m.id} member={m} />)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={createTeams} size="lg" className="rounded-2xl px-8 text-lg">
            <Shuffle className="mr-2" size={18} />チーム分けする
          </Button>
        </div>

        {teams && (
          <div className="grid md:grid-cols-2 gap-6">
            <TeamView team={teams.a} />
            <TeamView team={teams.b} />
          </div>
        )}
      </div>
    </div>
  );
}
