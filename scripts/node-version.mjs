export function supportsNode(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(version);
  return !!match && Number(match[1]) === 24 && Number(match[2]) >= 15;
}
