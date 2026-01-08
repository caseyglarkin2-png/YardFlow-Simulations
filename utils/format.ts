export function fmtClock(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export function fmtHMS(sec: number | null) {
  if (sec == null) return "—";
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${ss}s`;
  return `${ss}s`;
}

export function fmtPct(x: number) {
  return `${Math.round(x * 100)}%`;
}

export function fmtMoneyM(x: number) {
  const v = Math.max(0, x);
  return `$${v.toFixed(v < 10 ? 2 : 1)}M`;
}
