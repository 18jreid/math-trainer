"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Clock, Flame, ChevronRight } from "lucide-react";
import {
  loadSessionHistory, loadOpStats, loadPersonalBests,
  type SessionRecord, type OpStatsMap, type PersonalBestsMap,
} from "@/lib/storage";
import type { CoreOperation, NavView } from "@/lib/storage";
import AppNav from "./AppNav";
import type { Operation, Difficulty } from "@/lib/questions";

interface ProgressDashboardProps {
  onNavigate: (view: NavView) => void;
  onDrill: (op: Operation, diff: Difficulty) => void;
}

function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-CA");
  });
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
}

const OP_LABELS: Record<CoreOperation, string> = {
  division: "Division", multiplication: "Multiplication",
  addition: "Addition", subtraction: "Subtraction",
};

const OP_COLORS: Record<CoreOperation, string> = {
  division: "#00c9a7", multiplication: "#38bdf8",
  addition: "#4ade80", subtraction: "#fb923c",
};

const DIFF_LABELS: Record<string, string> = {
  easy: "Routine", medium: "Clinical", hard: "Advanced",
};

export default function ProgressDashboard({ onNavigate, onDrill }: ProgressDashboardProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [stats, setStats]       = useState<OpStatsMap | null>(null);
  const [bests, setBests]       = useState<PersonalBestsMap>({});

  useEffect(() => {
    setSessions(loadSessionHistory());
    setStats(loadOpStats());
    setBests(loadPersonalBests());
  }, []);

  const days = getLast7Days();
  const today = getLocalDate();

  // Group sessions by day for chart
  const byDay = days.map((date) => {
    const day = sessions.filter((s) => s.date === date);
    const avg = day.length ? Math.round(day.reduce((s, r) => s + r.scorePct, 0) / day.length) : null;
    return { date, avg, count: day.length };
  });

  const totalSessions = sessions.length;
  const lifetimeAcc   = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.scorePct, 0) / sessions.length)
    : 0;
  const avgTime       = sessions.length
    ? Math.round(sessions.reduce((s, r) => s + r.avgTimeMs, 0) / sessions.length)
    : 0;

  // Weak spot
  const weakOp = stats
    ? (Object.entries(stats) as [CoreOperation, { totalAttempts: number; accuracyPct: number }][])
        .filter(([, s]) => s.totalAttempts > 0)
        .sort(([, a], [, b]) => a.accuracyPct - b.accuracyPct)[0]?.[0]
    : null;

  // Chart dimensions
  const W = 300, H = 120, PAD_L = 4, PAD_T = 24, PAD_B = 22, BAR_H = H - PAD_T - PAD_B;
  const slotW = (W - PAD_L) / 7;
  const barW  = Math.max(slotW * 0.55, 8);

  return (
    <div className="min-h-screen grid-bg flex flex-col pb-20">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[#163040]">
        <TrendingUp className="w-4 h-4 text-[#00c9a7]" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-[#00c9a7]">Progress</h1>
      </div>

      <div className="flex-1 px-4 py-6 max-w-xl mx-auto w-full space-y-5">

        {/* 7-day chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="border border-[#163040] rounded-2xl bg-[#091418] p-5"
        >
          <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest mb-4">7-Day Accuracy</h2>
          {sessions.length === 0 ? (
            <p className="text-[#163040] text-sm text-center py-6 font-mono">No sessions yet — complete a session to see your chart.</p>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
              {byDay.map((d, i) => {
                const x       = PAD_L + i * slotW + (slotW - barW) / 2;
                const pct     = d.avg ?? 0;
                const bh      = d.avg != null ? Math.max((pct / 100) * BAR_H, 3) : 3;
                const by      = PAD_T + BAR_H - bh;
                const isToday = d.date === today;
                const color   = d.avg == null ? "#163040" : pct >= 80 ? "#00c9a7" : pct >= 60 ? "#38bdf8" : "#fb923c";
                return (
                  <g key={d.date}>
                    <rect x={x} y={by} width={barW} height={bh} rx={3} fill={color} opacity={d.avg == null ? 0.3 : 1} />
                    {isToday && <rect x={x - 1} y={PAD_T} width={barW + 2} height={BAR_H} rx={3} fill="none" stroke="#00c9a740" strokeWidth={1} />}
                    {d.avg != null && (
                      <text x={x + barW / 2} y={by - 4} textAnchor="middle" fontSize={8} fill={color} fontFamily="monospace">
                        {pct}%
                      </text>
                    )}
                    <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={8}
                      fill={isToday ? "#00c9a7" : "#163040"} fontFamily="monospace">
                      {dayLabel(d.date)}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.07 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: <Target className="w-4 h-4" />,  label: "Sessions",     value: totalSessions.toString(), color: "text-[#00c9a7]" },
            { icon: <Flame className="w-4 h-4" />,   label: "Lifetime Acc", value: `${lifetimeAcc}%`,        color: "text-[#4ade80]" },
            { icon: <Clock className="w-4 h-4" />,   label: "Avg Time",     value: avgTime ? `${(avgTime / 1000).toFixed(1)}s` : "—", color: "text-[#38bdf8]" },
          ].map((s) => (
            <div key={s.label} className="border border-[#163040] rounded-xl p-3 bg-[#091418] text-center">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <div className={`font-mono font-bold text-xl ${s.color}`}>{s.value}</div>
              <div className="text-[#6b9ea8] text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Weak spot */}
        {weakOp && stats && stats[weakOp].totalAttempts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.14 }}
            className="border border-[#f9731640] rounded-2xl bg-[#091418] p-4 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-[#fb923c] text-xs font-mono uppercase tracking-widest mb-0.5">Weak Spot</p>
              <p className="text-[#e2f4f1] font-semibold">{OP_LABELS[weakOp]}</p>
              <p className="text-[#6b9ea8] text-xs">{stats[weakOp].accuracyPct}% accuracy · {stats[weakOp].totalAttempts} attempts</p>
            </div>
            <button
              onClick={() => onDrill(weakOp as Operation, "easy")}
              className="shrink-0 bg-[#f97316] text-[#060e10] font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#ea6a10] transition-colors"
            >
              Drill It <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Op accuracy breakdown */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.21 }}
            className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[#163040]">
              <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Accuracy by Procedure</h2>
            </div>
            <div className="divide-y divide-[#0e1f24]">
              {(Object.entries(stats) as [CoreOperation, { accuracyPct: number; totalAttempts: number }][]).map(([op, s]) => (
                <div key={op} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: OP_COLORS[op] }} />
                  <span className="text-[#e2f4f1] text-sm flex-1">{OP_LABELS[op]}</span>
                  {s.totalAttempts === 0 ? (
                    <span className="text-[#163040] text-xs font-mono">No data</span>
                  ) : (
                    <>
                      <div className="flex-1 max-w-24 bg-[#163040] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.accuracyPct}%`, backgroundColor: OP_COLORS[op] }} />
                      </div>
                      <span className="text-xs font-mono w-10 text-right" style={{ color: OP_COLORS[op] }}>{s.accuracyPct}%</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Personal bests */}
        {Object.keys(bests).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.28 }}
            className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[#163040]">
              <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Personal Bests</h2>
            </div>
            <div className="divide-y divide-[#0e1f24]">
              {Object.entries(bests).map(([key, best]) => {
                const [op, diff] = key.split(":");
                return (
                  <div key={key} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[#e2f4f1] text-sm">{OP_LABELS[op as CoreOperation] ?? op}</p>
                      <p className="text-[#6b9ea8] text-xs">{DIFF_LABELS[diff] ?? diff}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#00c9a7] font-mono font-bold text-sm">{best.scorePct}%</p>
                      <p className="text-[#6b9ea8] font-mono text-xs">{(best.avgTimeMs / 1000).toFixed(1)}s avg</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <AppNav current="progress" onNavigate={onNavigate} />
    </div>
  );
}
