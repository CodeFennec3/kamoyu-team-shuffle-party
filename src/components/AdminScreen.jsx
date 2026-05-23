import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminScreen({ setScreen }) {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  /* =========================
     ① リアルタイム読み込み
  ========================= */
  useEffect(() => {
    console.log("📡 realtime members start");

    const q = query(
      collection(db, "members"),
      orderBy("baseName")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setMembers(data);
    });

    return () => unsubscribe();
  }, []);

  /* =========================
     Base64変換
  ========================= */
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

  /* =========================
     ② 追加
  ========================= */
  const addMember = async () => {
    if (loading) return;

    const trimmed = name.trim();

    if (!trimmed) return;

    /* 重複チェック */
    const exists = members.some(
      (m) => m.baseName === trimmed
    );

    if (exists) {
      alert("同じ名前のメンバーがいます");
      return;
    }

    setLoading(true);

    try {
      console.log("➡️ add start");

      let avatar = "";

      if (file) {
        console.log("🖼 converting image...");
        avatar = await toBase64(file);
      }

      const docRef = await addDoc(collection(db, "members"), {
        baseName: trimmed,
        avatar: avatar || "",
        active: true,
        createdAt: Date.now(),
      });

      console.log("✅ added:", docRef.id);

      setName("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (e) {
      console.error("❌ add error:", e);
      alert("追加に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     削除
  ========================= */
  const removeMember = async (id) => {
    const ok = confirm("削除しますか？");

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "members", id));
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  /* =========================
     active切替
  ========================= */
  const toggleActive = async (m) => {
    try {
      await updateDoc(doc(db, "members", m.id), {
        active: !m.active,
      });
    } catch (e) {
      console.error(e);
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* =========================
          Header
      ========================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

        <h1 className="text-3xl md:text-5xl font-black text-cyan-300 tracking-wide">
          ADMIN PANEL
        </h1>

        <button
          onClick={() => setScreen("home")}
          className="
            px-5
            py-2
            rounded-xl
            bg-slate-800
            hover:bg-slate-700
            transition
            font-bold
          "
        >
          戻る
        </button>
      </div>

      {/* =========================
          Form
      ========================= */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-5
          mb-8
          flex
          flex-wrap
          gap-3
          items-center
        "
      >

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addMember();
            }
          }}
          placeholder="メンバー名"
          className="
            px-4
            py-3
            rounded-xl
            bg-slate-800
            outline-none
            border
            border-slate-700
            focus:border-cyan-400
            min-w-[220px]
          "
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="
            text-sm
            text-slate-300
          "
        />

        <button
          onClick={addMember}
          disabled={loading}
          className="
            px-6
            py-3
            rounded-xl
            bg-cyan-400
            hover:bg-cyan-300
            text-black
            font-black
            transition
            disabled:opacity-50
          "
        >
          {loading ? "処理中..." : "追加"}
        </button>

      </div>

      {/* =========================
          Member Count
      ========================= */}
      <div className="mb-6 text-slate-400 font-bold">
        メンバー数: {members.length}
      </div>

      {/* =========================
          List
      ========================= */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-5
        "
      >

        {members.map((m) => (
          <div
            key={m.id}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-5
              hover:border-cyan-500
              transition
            "
          >

            {/* avatar */}
            <div className="flex justify-center mb-4">

              {m.avatar ? (
                <img
                  src={m.avatar}
                  alt={m.baseName}
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border-4
                    border-slate-700
                  "
                />
              ) : (
                <div
                  className="
                    w-24
                    h-24
                    rounded-full
                    bg-slate-800
                    flex
                    items-center
                    justify-center
                    text-3xl
                    font-black
                    text-cyan-300
                  "
                >
                  {m.baseName?.charAt(0)}
                </div>
              )}

            </div>

            {/* name */}
            <div className="text-center text-xl font-black mb-2">
              {m.baseName}
            </div>

            {/* active status */}
            <div
              className={`
                text-center
                text-sm
                font-bold
                mb-4
                ${
                  m.active
                    ? "text-green-400"
                    : "text-red-400"
                }
              `}
            >
              {m.active ? "● 参加中" : "● 不参加"}
            </div>

            {/* buttons */}
            <div className="flex gap-2">

              <button
                onClick={() => toggleActive(m)}
                className="
                  flex-1
                  py-2
                  rounded-xl
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  font-bold
                  transition
                "
              >
                切替
              </button>

              <button
                onClick={() => removeMember(m.id)}
                className="
                  flex-1
                  py-2
                  rounded-xl
                  bg-red-600
                  hover:bg-red-500
                  font-bold
                  transition
                "
              >
                削除
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}