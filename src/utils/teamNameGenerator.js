const coolWords = [
  'PHOENIX',
  'VORTEX',
  'BLAZE',
  'REQUIEM',
  'NOVA',
  'TEMPEST',
  'RAPTOR',
  'INFERNO',
  'VALKYRIE',
  'ECLIPSE',
  'FANG',
  'TITAN',
  'STORM',
  'ZERO',
  'NEBULA'
];

export const generateTeamName = (leaderName) => {
  const word = coolWords[Math.floor(Math.random() * coolWords.length)];

  return `${leaderName.toUpperCase()} ${word}`;
};