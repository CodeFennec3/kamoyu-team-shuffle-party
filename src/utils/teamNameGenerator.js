const teamNames = [
  "with スーパーモンキーズ",
  "軍団",
  "サーカス団",
  "新選組",
  "とその下僕達",
  "塾",
  "学園",
  "グループ",
  "",
  "が仕切るチーム",
  "イケメン隊",
  "R指定",
  "48",
];

export const generateTeamName = (
  leaderName,
  usedSuffixes = []
) => {

  // まだ使われていない語尾だけ
  const available = teamNames.filter(
    (name) => !usedSuffixes.includes(name)
  );

  // 全使用時保険
  const pool =
    available.length > 0
      ? available
      : teamNames;

  const suffix =
    pool[
      Math.floor(Math.random() * pool.length)
    ];

  return {
    fullName: `${leaderName}${suffix}`,
    suffix,
  };
};