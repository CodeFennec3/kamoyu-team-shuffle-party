import { useEffect, useMemo, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { db, ROOM_ID } from './firebase';
import { shuffleArray } from './utils/shuffle';
import { generateTeamName } from './utils/teamNameGenerator';

import LobbyScreen from './components/LobbyScreen';
import IntroScreen from './components/IntroScreen';
import CaptainScreen from './components/CaptainScreen';
import TeamNameScreen from './components/TeamNameScreen';
import DistributionScreen from './components/DistributionScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [screen, setScreen] = useState('lobby');

  const [captainA, setCaptainA] = useState(null);
  const [captainB, setCaptainB] = useState(null);

  const [teamNames, setTeamNames] = useState({
    a: '',
    b: ''
  });

  const [animatedTeams, setAnimatedTeams] = useState({
    a: [],
    b: []
  });

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
        m.id === id
          ? { ...m, active: !m.active }
          : m
      )
    );
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

    setTeamNames({
      a: generateTeamName(captain1.baseName),
      b: generateTeamName(captain2.baseName)
    });

    setAnimatedTeams({
      a: [captain1],
      b: [captain2]
    });

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

      remaining.forEach((member, index) => {
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
        }, index * 900);
      });

      setTimeout(() => {
        setScreen('result');
      }, remaining.length * 900 + 2000);
    }, 8000);
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-500 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-6 py-8">
        <h1 className="text-6xl font-extrabold text-center mb-14 tracking-wide drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
          かもゆとゆかいな仲間たちをまぜまぜ
        </h1>

        {screen === 'lobby' && (
          <LobbyScreen
            members={activeMembers}
            toggleActive={toggleActive}
            startShuffle={startShuffle}
          />
        )}

        {screen === 'intro' && <IntroScreen />}

        {screen === 'captainA' && captainA && (
          <CaptainScreen
            captain={captainA}
            label="TEAM A LEADER"
            color="text-cyan-300"
          />
        )}

        {screen === 'captainB' && captainB && (
          <CaptainScreen
            captain={captainB}
            label="TEAM B LEADER"
            color="text-violet-300"
          />
        )}

        {screen === 'teamNames' && (
          <TeamNameScreen teamNames={teamNames} />
        )}

        {screen === 'distribution' && (
          <DistributionScreen
            animatedTeams={animatedTeams}
            teamNames={teamNames}
          />
        )}

        {screen === 'result' && teams && (
          <ResultScreen
            teams={teams}
            teamNames={teamNames}
            startShuffle={startShuffle}
            setScreen={setScreen}
          />
        )}
      </div>
    </div>
  );
}
