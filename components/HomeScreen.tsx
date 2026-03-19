"use client";

import { motion } from "framer-motion";
import { Divide, X, Plus, Minus, Shuffle, ChevronRight, Stethoscope } from "lucide-react";
import type { Operation, Difficulty } from "@/lib/questions";

interface HomeScreenProps {
  onStart: (operation: Operation, difficulty: Difficulty, questionCount: number) => void;
}

const OPERATIONS: { id: Operation; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  {
    id: "division",
    label: "Division",
    icon: <Divide className="w-6 h-6" />,
    color: "cyan",
    desc: "300 B12 doses ÷ 10 per kit = ?",
  },
  {
    id: "multiplication",
    label: "Multiplication",
    icon: <X className="w-6 h-6" />,
    color: "purple",
    desc: "12 patients × 8 Acousana sessions = ?",
  },
  {
    id: "addition",
    label: "Addition",
    icon: <Plus className="w-6 h-6" />,
    color: "green",
    desc: "1,200 pellets + 800 restocked = ?",
  },
  {
    id: "subtraction",
    label: "Subtraction",
    icon: <Minus className="w-6 h-6" />,
    color: "orange",
    desc: "500 semaglutide units − 180 dispensed = ?",
  },
  {
    id: "mixed",
    label: "Mixed",
    icon: <Shuffle className="w-6 h-6" />,
    color: "cyan",
    desc: "Random mix of all operations",
  },
];

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "easy", label: "Easy", desc: "Round numbers, smaller values" },
  { id: "medium", label: "Medium", desc: "More divisors, larger totals" },
  { id: "hard", label: "Hard", desc: "Any numbers, full range" },
];

const COUNTS = [5, 10, 20];

const colorMap: Record<string, string> = {
  cyan: "border-[#00e5ff40] text-[#00e5ff] hover:border-[#00e5ff80] hover:bg-[#00e5ff08]",
  purple: "border-[#7c3aed40] text-[#a78bfa] hover:border-[#7c3aed80] hover:bg-[#7c3aed08]",
  green: "border-[#39d35340] text-[#39d353] hover:border-[#39d35380] hover:bg-[#39d35308]",
  orange: "border-[#f9731640] text-[#fb923c] hover:border-[#f9731680] hover:bg-[#f9731608]",
};

const selectedColorMap: Record<string, string> = {
  cyan: "border-[#00e5ff] bg-[#00e5ff12] text-[#00e5ff]",
  purple: "border-[#7c3aed] bg-[#7c3aed12] text-[#a78bfa]",
  green: "border-[#39d353] bg-[#39d35312] text-[#39d353]",
  orange: "border-[#f97316] bg-[#f9731612] text-[#fb923c]",
};

export default function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedOp, setSelectedOp] = React.useState<Operation>("division");
  const [selectedDiff, setSelectedDiff] = React.useState<Difficulty>("easy");
  const [selectedCount, setSelectedCount] = React.useState(10);

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-[#00e5ff]" />
            <span className="text-[#00e5ff] text-sm font-mono tracking-widest uppercase">
              One Wellness Math Trainer
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#e6edf3] mb-2 glow-cyan">
            Clinic Math Trainer
          </h1>
          <p className="text-[#8b949e] text-sm max-w-sm mx-auto">
            Real One Wellness scenarios — pellets, B12, semaglutide, Acousana &amp; more.
          </p>
        </div>

        {/* Operation Select */}
        <section className="mb-6">
          <h2 className="text-[#8b949e] text-xs font-mono uppercase tracking-widest mb-3">
            Operation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OPERATIONS.map((op) => {
              const isSelected = selectedOp === op.id;
              const colorClass = isSelected
                ? selectedColorMap[op.color]
                : colorMap[op.color];
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op.id)}
                  className={`border rounded-lg p-4 text-left transition-all duration-150 cursor-pointer ${colorClass} ${op.id === "mixed" ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {op.icon}
                    <span className="font-semibold text-sm">{op.label}</span>
                  </div>
                  <p className="text-[10px] text-[#8b949e] font-mono leading-tight">{op.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty Select */}
        <section className="mb-6">
          <h2 className="text-[#8b949e] text-xs font-mono uppercase tracking-widest mb-3">
            Difficulty
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const isSelected = selectedDiff === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiff(d.id)}
                  className={`border rounded-lg p-3 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-[#00e5ff] bg-[#00e5ff12] text-[#00e5ff]"
                      : "border-[#1e2d3d] text-[#8b949e] hover:border-[#00e5ff40] hover:text-[#e6edf3]"
                  }`}
                >
                  <div className="font-semibold text-sm mb-0.5">{d.label}</div>
                  <p className="text-[10px] text-[#8b949e] leading-tight">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Question Count */}
        <section className="mb-8">
          <h2 className="text-[#8b949e] text-xs font-mono uppercase tracking-widest mb-3">
            Questions
          </h2>
          <div className="flex gap-3">
            {COUNTS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCount(c)}
                className={`flex-1 border rounded-lg py-3 font-mono font-bold text-lg transition-all duration-150 cursor-pointer ${
                  selectedCount === c
                    ? "border-[#00e5ff] bg-[#00e5ff12] text-[#00e5ff]"
                    : "border-[#1e2d3d] text-[#8b949e] hover:border-[#00e5ff40] hover:text-[#e6edf3]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStart(selectedOp, selectedDiff, selectedCount)}
          className="w-full bg-[#00e5ff] text-[#080c14] font-bold text-lg py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00cfea] transition-colors"
        >
          Start Training
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// Need React for useState
import React from "react";
