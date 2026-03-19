import type { Operation, Difficulty, Question } from "./questions";

export type NavView = "home" | "progress" | "daily" | "scenarios";

const P = "mth_";

export type CoreOperation = "division" | "multiplication" | "addition" | "subtraction";

export interface SessionRecord {
  id: string;
  date: string;           // YYYY-MM-DD local time
  timestamp: number;
  operation: Operation;
  difficulty: Difficulty;
  questionCount: number;
  correctCount: number;
  scorePct: number;
  avgTimeMs: number;
  isDaily: boolean;
  perOp: Array<{ operation: CoreOperation; correct: boolean; timeMs: number }>;
}

export interface OperationStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracyPct: number;
  avgTimeMs: number;
}

export type OpStatsMap = Record<CoreOperation, OperationStats>;

export interface PersonalBest {
  scorePct: number;
  avgTimeMs: number;
  scoreDate: string;
  timeDate: string;
}

export type PersonalBestsMap = Record<string, PersonalBest>;

export interface DailyChallengeRecord {
  date: string;
  questions: Question[];
  completed: boolean;
  streak: number;
  lastCompletedDate: string | null;
}

export interface CustomScenario {
  id: string;
  label: string;
  a: number;
  b: number;
  operation: CoreOperation;
  createdAt: number;
}

// ─── Local date (not UTC) ────────────────────────────────────────────────────

export function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

// ─── Low-level helpers ───────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(P + key);
    return v != null ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(P + key, JSON.stringify(value));
  } catch (e) {
    console.error("[storage] write failed for key", key, e);
  }
}

// ─── Session history ─────────────────────────────────────────────────────────

export function loadSessionHistory(): SessionRecord[] {
  return read<SessionRecord[]>("sessions", []);
}

export function saveSession(record: SessionRecord): void {
  const sessions = loadSessionHistory();
  sessions.push(record);
  if (sessions.length > 500) sessions.splice(0, sessions.length - 500);
  write("sessions", sessions);
  rebuildOpStats(sessions);
}

// ─── Operation stats ─────────────────────────────────────────────────────────

const BLANK: OperationStats = { totalAttempts: 0, correctAttempts: 0, accuracyPct: 0, avgTimeMs: 0 };
const CORE_OPS: CoreOperation[] = ["division", "multiplication", "addition", "subtraction"];

function rebuildOpStats(sessions: SessionRecord[]): void {
  const map: OpStatsMap = {
    division: { ...BLANK }, multiplication: { ...BLANK },
    addition: { ...BLANK }, subtraction: { ...BLANK },
  };
  for (const s of sessions) {
    for (const r of s.perOp) {
      const st = map[r.operation];
      st.totalAttempts++;
      if (r.correct) st.correctAttempts++;
      st.avgTimeMs += r.timeMs;
    }
  }
  for (const op of CORE_OPS) {
    const st = map[op];
    if (st.totalAttempts > 0) {
      st.accuracyPct = Math.round((st.correctAttempts / st.totalAttempts) * 100);
      st.avgTimeMs   = Math.round(st.avgTimeMs / st.totalAttempts);
    }
  }
  write("op_stats", map);
}

export function loadOpStats(): OpStatsMap {
  return read<OpStatsMap>("op_stats", {
    division: { ...BLANK }, multiplication: { ...BLANK },
    addition: { ...BLANK }, subtraction: { ...BLANK },
  });
}

// ─── Personal bests ──────────────────────────────────────────────────────────

export function loadPersonalBests(): PersonalBestsMap {
  return read<PersonalBestsMap>("bests", {});
}

export function checkAndSavePersonalBest(
  op: Operation, diff: Difficulty, scorePct: number, avgTimeMs: number,
): { isNewRecord: boolean; field: "score" | "time" | "both" | null } {
  const bests = loadPersonalBests();
  const key = `${op}:${diff}`;
  const today = getLocalDate();
  const existing = bests[key];

  let scoreImproved = false;
  let timeImproved  = false;

  if (!existing) {
    bests[key] = { scorePct, avgTimeMs, scoreDate: today, timeDate: today };
    scoreImproved = true;
    timeImproved  = true;
  } else {
    if (scorePct > existing.scorePct)    { existing.scorePct = scorePct; existing.scoreDate = today; scoreImproved = true; }
    if (avgTimeMs < existing.avgTimeMs)  { existing.avgTimeMs = avgTimeMs; existing.timeDate = today; timeImproved = true; }
    bests[key] = existing;
  }

  write("bests", bests);
  const field = scoreImproved && timeImproved ? "both" : scoreImproved ? "score" : timeImproved ? "time" : null;
  return { isNewRecord: field !== null, field };
}

// ─── Daily challenge ─────────────────────────────────────────────────────────

export function loadDailyChallengeRecord(): DailyChallengeRecord | null {
  return read<DailyChallengeRecord | null>("daily", null);
}

export function saveDailyChallengeRecord(r: DailyChallengeRecord): void {
  write("daily", r);
}

export function markDailyComplete(): void {
  const today  = getLocalDate();
  const record = loadDailyChallengeRecord();
  if (!record || record.date !== today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toLocaleDateString("en-CA");

  const streak = record.lastCompletedDate === yStr ? record.streak + 1 :
                 record.lastCompletedDate === today ? record.streak : 1;

  saveDailyChallengeRecord({ ...record, completed: true, streak, lastCompletedDate: today });
}

// ─── Custom scenarios ────────────────────────────────────────────────────────

export function loadScenarios(): CustomScenario[] {
  return read<CustomScenario[]>("scenarios", []);
}

export function saveScenario(s: CustomScenario): void {
  const list = loadScenarios();
  list.push(s);
  write("scenarios", list);
}

export function deleteScenario(id: string): void {
  write("scenarios", loadScenarios().filter(s => s.id !== id));
}

// ─── Sound ───────────────────────────────────────────────────────────────────

export function loadSoundEnabled(): boolean {
  return read<boolean>("sound", true);
}

export function saveSoundEnabled(on: boolean): void {
  write("sound", on);
}
