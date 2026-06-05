import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import HomeScreen from "./components/HomeScreen";
import LobbyScreen from "./components/LobbyScreen";
import IntroScreen from "./components/IntroScreen";
import CaptainSlotScreen from "./components/CaptainSlotScreen";
import CaptainScreen from "./components/CaptainScreen";
import TeamNameScreen from "./components/TeamNameScreen";
import DistributionScreen from "./components/DistributionScreen";
import FightScreen from "./components/FightScreen";
import ResultScreen from "./components/ResultScreen";
import NaokinScreen from "./components/NaokinScreen";
import ParticlesBackground from "./components/ParticlesBackground";
import AdminScreen from "./components/AdminScreen";

import { shuffleArray } from "./utils/shuffle";
import { generateTeamName } from "./utils/teamNameGenerator";
import { teamThemes } from "./utils/teamThemes";

export default function App() {
  const [screen, setScreen] = useState("home");

  const [members, setMembers] = useState([]);

  /* =========================
     BGM
  ========================= */
  const audioRef = useRef(null);

  const playNaokinBgm = () => {
    if (!audioRef.current) return;

    const naokinTracks = [
      "/music/naokinminchi.mp3",
      "/music/naokinminchi2.mp3",
    ];

    const randomTrack =
      naokinTracks[
        Math.floor(
          Math.random() * naokinTracks.length
        )
      ];

    audioRef.current.pause();

    const audio = new Audio(randomTrack);

    audio.loop = true;
    audio.volume = 0.35;

    audio.play().catch(console.error);

    audioRef.current = audio;
  };

  /* =========================
     ローカル不参加管理
  ========================= */
  const [inactiveIds, setInactiveIds] = useState([]);

  const [passwordInput, setPasswordInput] = useState("");

  const [battleData, setBattleData] = useState({
    teams: { a: [], b: [] },

    captains: {
      a: null,
      b: null,
    },

    teamNames: {
      a: "",
      b: "",
    },

    theme: null,
  });

  /* =========================
     Firebase
  ========================= */
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "members"),
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setMembers(list);
      }
    );

    return () => unsub();
  }, []);

  /* =========================
     BGM 初期化
  ========================= */
  useEffect(() => {
    const normalTracks = [
      "/music/teamshuffle.mp3",
      "/music/teamshuffle_rai.mp3",
    ];

    const randomTrack =
      normalTracks[
        Math.floor(
          Math.random() * normalTracks.length
        )
      ];

    const audio = new Audio(randomTrack);

    audio.loop = true;

    // 音量調整
    audio.volume = 0.35;

    audioRef.current = audio;

    // 初回ユーザー操作で再生
    const startAudio = () => {
      audio
        .play()
        .catch((err) => {
          console.log(
            "BGM autoplay blocked:",
            err
          );
        });

      window.removeEventListener(
        "click",
        startAudio
      );
    };

    window.addEventListener(
      "click",
      startAudio
    );

    return () => {
      audio.pause();

      window.removeEventListener(
        "click",
        startAudio
      );
    };
  }, []);

  /* ========================= */

  const wait = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    );

  /* ========================= */

  const startViewer = () =>
    setScreen("lobby");

  const enterAdmin = () => {
    if (passwordInput === "admin") {
      setScreen("admin");
    } else {
      alert("パスワード違う");
    }
  };

  /* =========================
     不参加切り替え
  ========================= */
  const toggleActive = (id) => {
    setInactiveIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* =========================
     MAIN SHUFFLE
  ========================= */
  const startShuffle = async () => {
    const active = members.filter(
      (m) => !inactiveIds.includes(m.id)
    );

    if (active.length < 2) {
      alert("2人以上必要です");
      return;
    }

    const shuffled = shuffleArray(active);

    const mid = Math.ceil(
      shuffled.length / 2
    );

    const teamA = shuffled.slice(0, mid);
    const teamB = shuffled.slice(mid);

    const captainA = teamA[0];
    const captainB = teamB[0];

    const randomTheme =
      teamThemes[
        Math.floor(
          Math.random() * teamThemes.length
        )
      ];

    /* =========================
       チーム名生成（重複防止）
    ========================= */
    const teamAData =
      generateTeamName(
        captainA.baseName
      );

    const teamBData =
      generateTeamName(
        captainB.baseName,
        [teamAData.suffix]
      );

    setBattleData({
      teams: {
        a: teamA,
        b: teamB,
      },

      captains: {
        a: captainA,
        b: captainB,
      },

      teamNames: {
        a: teamAData.fullName,
        b: teamBData.fullName,
      },

      theme: randomTheme,
    });

    /* =========================
       演出シーケンス
    ========================= */

    setScreen("intro");

    await wait(2500);

    setScreen("captainSlotA");

    await wait(2800);

    setScreen("captainRevealA");

    await wait(2200);

    setScreen("captainSlotB");

    await wait(2800);

    setScreen("captainRevealB");

    await wait(2200);

    setScreen("teamName");

    await wait(2500);

    setScreen("distribution");

    await wait(3500);

    setScreen("fight");

    await wait(1800);

    setScreen("result");
  };

  return (
    <div
      className="
        relative
        min-h-screen
        text-white
      "
    >
      <ParticlesBackground variant={screen} />

      {/* HOME */}
      {screen === "home" && (
        <HomeScreen
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          enterAdmin={enterAdmin}
          startViewer={startViewer}
        />
      )}

      {/* LOBBY */}
      {screen === "lobby" && (
        <LobbyScreen
          members={members}
          inactiveIds={inactiveIds}
          toggleActive={toggleActive}
          startShuffle={startShuffle}
        />
      )}

      {/* INTRO */}
      {screen === "intro" && (
        <IntroScreen />
      )}

      {/* CAPTAIN SLOT A */}
      {screen === "captainSlotA" && (
        <CaptainSlotScreen
          members={members}
          finalCaptain={
            battleData.captains.a
          }
          label="一人目のリーダーは.."
          color={battleData.theme?.a.text}
        />
      )}

      {/* CAPTAIN REVEAL A */}
      {screen === "captainRevealA" && (
        <CaptainScreen
          captain={battleData.captains.a}
          label="一人目のリーダーは"
          color={battleData.theme?.a.text}
        />
      )}

      {/* CAPTAIN SLOT B */}
      {screen === "captainSlotB" && (
        <CaptainSlotScreen
          members={members}
          finalCaptain={
            battleData.captains.b
          }
          label="二人目のリーダーは.."
          color={battleData.theme?.b.text}
        />
      )}

      {/* CAPTAIN REVEAL B */}
      {screen === "captainRevealB" && (
        <CaptainScreen
          captain={battleData.captains.b}
          label="二人目のリーダーは"
          color={battleData.theme?.b.text}
        />
      )}

      {/* TEAM NAME */}
      {screen === "teamName" && (
        <TeamNameScreen
          teamNames={
            battleData.teamNames
          }
        />
      )}

      {/* DISTRIBUTION */}
      {screen === "distribution" && (
        <DistributionScreen
          animatedTeams={
            battleData.teams
          }
          teamNames={
            battleData.teamNames
          }
          captains={
            battleData.captains
          }
          theme={battleData.theme}
        />
      )}

      {/* FIGHT */}
      {screen === "fight" && (
        <FightScreen />
      )}

      {/* RESULT */}
      {screen === "result" && (
        <ResultScreen
          teams={battleData.teams}
          captains={battleData.captains}
          teamNames={battleData.teamNames}
          theme={battleData.theme}
          startShuffle={startShuffle}
          setScreen={setScreen}
          playNaokinBgm={playNaokinBgm}
        />
      )}

      {/* NAOKIN MODE */}
      {screen === "naokin" && (
        <NaokinScreen
          teams={battleData.teams}
          captains={
            battleData.captains
          }
          teamNames={
            battleData.teamNames
          }
          theme={battleData.theme}
          setScreen={setScreen}
        />
      )}

      {/* ADMIN */}
      {screen === "admin" && (
        <AdminScreen
          setScreen={setScreen}
        />
      )}
    </div>
  );
}
