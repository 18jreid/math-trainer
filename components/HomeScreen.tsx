"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Syringe, Pill, Plus, Minus, Activity, ChevronRight, Stethoscope, Flame, TrendingUp } from "lucide-react";
import type { Operation, Difficulty } from "@/lib/questions";
import { loadDailyChallengeRecord, loadOpStats, getLocalDate, type NavView, type CoreOperation } from "@/lib/storage";
import AppNav from "./AppNav";

interface HomeScreenProps {
  onStart: (operation: Operation, difficulty: Difficulty, questionCount: number) => void;
  onNavigate: (view: NavView) => void;
}

const OPERATIONS: { id: Operation; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { id: "division",       label: "Division",       icon: <Syringe className="w-5 h-5" />,  color: "teal",   desc: "300 B12 doses ÷ 10 per kit = ?" },
  { id: "multiplication", label: "Multiplication", icon: <Pill className="w-5 h-5" />,     color: "blue",   desc: "12 patients × 8 Acousana sessions = ?" },
  { id: "addition",       label: "Addition",       icon: <Plus className="w-5 h-5" />,     color: "green",  desc: "1,200 pellets + 800 restocked = ?" },
  { id: "subtraction",    label: "Subtraction",    icon: <Minus className="w-5 h-5" />,    color: "orange", desc: "500 semaglutide units − 180 dispensed = ?" },
  { id: "mixed",          label: "Mixed Cases",    icon: <Activity className="w-5 h-5" />, color: "teal",   desc: "Random mix of all procedure types" },
];

const DIFFICULTIES: { id: Difficulty; label: string; badge: string; desc: string }[] = [
  { id: "easy",   label: "Routine",  badge: "LVL 1", desc: "Round numbers, common doses" },
  { id: "medium", label: "Clinical", badge: "LVL 2", desc: "More variety, larger quantities" },
  { id: "hard",   label: "Advanced", badge: "LVL 3", desc: "Full range, any calculation" },
];

const COUNTS = [5, 10, 20];

const colorMap: Record<string, string> = {
  teal:   "border-[#00c9a740] text-[#00c9a7] hover:border-[#00c9a780] hover:bg-[#00c9a708]",
  blue:   "border-[#0ea5e940] text-[#38bdf8] hover:border-[#0ea5e980] hover:bg-[#0ea5e908]",
  green:  "border-[#22c55e40] text-[#4ade80] hover:border-[#22c55e80] hover:bg-[#22c55e08]",
  orange: "border-[#f9731640] text-[#fb923c] hover:border-[#f9731680] hover:bg-[#f9731608]",
};
const selectedColorMap: Record<string, string> = {
  teal:   "border-[#00c9a7] bg-[#00c9a712] text-[#00c9a7]",
  blue:   "border-[#0ea5e9] bg-[#0ea5e912] text-[#38bdf8]",
  green:  "border-[#22c55e] bg-[#22c55e12] text-[#4ade80]",
  orange: "border-[#f97316] bg-[#f9731612] text-[#fb923c]",
};

const OP_LABELS: Record<CoreOperation, string> = {
  division: "Division", multiplication: "Multiplication", addition: "Addition", subtraction: "Subtraction",
};

function EkgLine() {
  return (
    <svg viewBox="0 0 200 40" className="w-40 h-6 mx-auto mb-3 opacity-40" fill="none">
      <path
        d="M0,20 L40,20 L50,20 L55,14 L60,20 L65,4 L70,36 L75,20 L85,20 L90,14 L95,20 L100,20 L140,20 L145,14 L150,20 L155,4 L160,36 L165,20 L175,20 L200,20"
        stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="ekg-path"
      />
    </svg>
  );
}

export default function HomeScreen({ onStart, onNavigate }: HomeScreenProps) {
  const [selectedOp, setSelectedOp]     = React.useState<Operation>("division");
  const [selectedDiff, setSelectedDiff] = React.useState<Difficulty>("easy");
  const [selectedCount, setSelectedCount] = React.useState(10);
  const [dailyDone, setDailyDone]       = useState(false);
  const [streak, setStreak]             = useState(0);
  const [weakOp, setWeakOp]             = useState<CoreOperation | null>(null);
  const [weakPct, setWeakPct]           = useState(0);

  useEffect(() => {
    const daily = loadDailyChallengeRecord();
    if (daily && daily.date === getLocalDate()) {
      setDailyDone(daily.completed);
      setStreak(daily.streak);
    }
    const stats = loadOpStats();
    const candidates = (Object.entries(stats) as [CoreOperation, { totalAttempts: number; accuracyPct: number }][])
      .filter(([, s]) => s.totalAttempts >= 3);
    if (candidates.length) {
      const worst = candidates.sort(([, a], [, b]) => a.accuracyPct - b.accuracyPct)[0];
      setWeakOp(worst[0]);
      setWeakPct(worst[1].accuracyPct);
    }
  }, []);

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-start px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#00c9a712] border border-[#00c9a740] flex items-center justify-center">
              <Stethoscope className="w-3.5 h-3.5 text-[#00c9a7]" />
            </div>
            <span className="text-[#00c9a7] text-xs font-mono tracking-widest uppercase">One Wellness Utah</span>
          </div>
          <EkgLine />
          <h1 className="text-3xl font-bold text-[#e2f4f1] mb-1 glow-teal">Clinic Math Trainer</h1>
          <p className="text-[#6b9ea8] text-xs max-w-xs mx-auto">Practice real clinic calculations — pellets, injections, semaglutide, Acousana &amp; more.</p>
        </div>

        {/* Daily challenge + streak banner */}
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate("daily")}
          className={`w-full border rounded-2xl p-4 flex items-center justify-between gap-3 mb-5 cursor-pointer transition-colors ${
            dailyDone
              ? "border-[#22c55e40] bg-[#22c55e08]"
              : "border-[#163040] bg-[#091418] hover:border-[#00c9a740]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Flame className={`w-5 h-5 ${streak > 0 ? "text-[#fb923c]" : "text-[#163040]"}`} />
            <div className="text-left">
              <p className="text-[#e2f4f1] text-sm font-semibold">
                Daily Challenge {dailyDone ? "✓" : ""}
              </p>
              <p className="text-[#6b9ea8] text-xs">
                {streak > 0 ? `${streak}-day streak` : "Start your streak"}
                {dailyDone ? " · Completed today" : " · 5 questions"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#163040]" />
        </motion.button>

        {/* Weak spot nudge */}
        {weakOp && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => { setSelectedOp(weakOp); setSelectedDiff("easy"); }}
            className="w-full border border-[#f9731640] bg-[#091418] rounded-2xl p-3 flex items-center justify-between gap-3 mb-5 cursor-pointer hover:bg-[#f9731608] transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-[#fb923c]" />
              <p className="text-[#e2f4f1] text-sm">
                Weak spot: <span className="text-[#fb923c]">{OP_LABELS[weakOp]}</span>
                <span className="text-[#6b9ea8] text-xs ml-2">{weakPct}% accuracy</span>
              </p>
            </div>
            <span className="text-[#fb923c] text-xs font-mono">Select →</span>
          </motion.button>
        )}

        {/* Procedure Type */}
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#00c9a7]" />
            <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Procedure Type</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OPERATIONS.map((op) => {
              const isSelected  = selectedOp === op.id;
              const colorClass  = isSelected ? selectedColorMap[op.color] : colorMap[op.color];
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op.id)}
                  className={`border rounded-xl p-3 text-left transition-all duration-150 cursor-pointer ${colorClass} ${op.id === "mixed" ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {op.icon}
                    <span className="font-semibold text-sm">{op.label}</span>
                  </div>
                  <p className="text-[10px] text-[#6b9ea8] font-mono leading-tight">{op.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Complexity */}
        <section className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#00c9a7]" />
            <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Complexity</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const isSelected = selectedDiff === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiff(d.id)}
                  className={`border rounded-xl p-3 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-[#00c9a7] bg-[#00c9a712] text-[#00c9a7]"
                      : "border-[#163040] text-[#6b9ea8] hover:border-[#00c9a740] hover:text-[#e2f4f1]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm">{d.label}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded border ${isSelected ? "border-[#00c9a740] text-[#00c9a7]" : "border-[#163040] text-[#6b9ea8]"}`}>{d.badge}</span>
                  </div>
                  <p className="text-[10px] text-[#6b9ea8] leading-tight">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Case Count */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-[#00c9a7]" />
            <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Case Count</h2>
          </div>
          <div className="flex gap-3">
            {COUNTS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCount(c)}
                className={`flex-1 border rounded-xl py-3 font-mono font-bold text-lg transition-all duration-150 cursor-pointer ${
                  selectedCount === c
                    ? "border-[#00c9a7] bg-[#00c9a712] text-[#00c9a7]"
                    : "border-[#163040] text-[#6b9ea8] hover:border-[#00c9a740] hover:text-[#e2f4f1]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Begin */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => onStart(selectedOp, selectedDiff, selectedCount)}
          className="w-full bg-[#00c9a7] text-[#060e10] font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00b896] transition-colors"
        >
          Begin Assessment
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <AppNav current="home" onNavigate={onNavigate} />
    </div>
  );
}
