"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Home, Trophy, Clock, Target } from "lucide-react";
import type { SessionResult } from "./TrainingSession";

interface ResultsScreenProps {
  results: SessionResult[];
  onRetry: () => void;
  onHome: () => void;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function getGrade(pct: number): { label: string; color: string; glow: string } {
  if (pct === 100) return { label: "Perfect!", color: "text-[#39d353]", glow: "glow-green" };
  if (pct >= 80) return { label: "Great job!", color: "text-[#00e5ff]", glow: "glow-cyan" };
  if (pct >= 60) return { label: "Keep going!", color: "text-[#a78bfa]", glow: "" };
  return { label: "Keep practicing!", color: "text-[#fb923c]", glow: "" };
}

export default function ResultsScreen({ results, onRetry, onHome }: ResultsScreenProps) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);
  const avgTime = Math.round(results.reduce((s, r) => s + r.timeMs, 0) / total);
  const grade = getGrade(pct);

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        {/* Score hero */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#00e5ff40] bg-[#00e5ff08] mb-4"
          >
            <span className={`text-3xl font-bold font-mono ${grade.color} ${grade.glow}`}>
              {pct}%
            </span>
          </motion.div>
          <h2 className={`text-2xl font-bold mb-1 ${grade.color}`}>{grade.label}</h2>
          <p className="text-[#8b949e] text-sm">
            {correct} of {total} correct
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Target className="w-4 h-4" />, label: "Correct", value: `${correct}/${total}`, color: "text-[#39d353]" },
            { icon: <Clock className="w-4 h-4" />, label: "Avg Time", value: formatTime(avgTime), color: "text-[#00e5ff]" },
            { icon: <Trophy className="w-4 h-4" />, label: "Score", value: `${pct}%`, color: "text-[#a78bfa]" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="border border-[#1e2d3d] rounded-lg p-3 bg-[#0d1117] text-center"
            >
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <div className={`font-mono font-bold text-lg ${s.color}`}>{s.value}</div>
              <div className="text-[#8b949e] text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Question breakdown */}
        <div className="border border-[#1e2d3d] rounded-xl bg-[#0d1117] overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-[#1e2d3d]">
            <h3 className="text-[#8b949e] text-xs font-mono uppercase tracking-widest">
              Question Breakdown
            </h3>
          </div>
          <div className="divide-y divide-[#1e2d3d] max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className="px-4 py-3 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {r.correct
                    ? <CheckCircle2 className="w-4 h-4 text-[#39d353]" />
                    : <XCircle className="w-4 h-4 text-[#f75555]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e6edf3] text-sm leading-snug truncate" title={r.question.prompt}>
                    {r.question.prompt}
                  </p>
                  {!r.correct && (
                    <p className="text-[#8b949e] text-xs mt-0.5">
                      You answered {r.userAnswer?.toLocaleString() ?? "nothing"} · Answer:{" "}
                      <span className="text-[#e6edf3]">{r.question.answer.toLocaleString()}</span>
                      {r.question.hint && ` (${r.question.hint})`}
                    </p>
                  )}
                </div>
                <span className="text-[#8b949e] font-mono text-xs shrink-0">{formatTime(r.timeMs)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 border border-[#1e2d3d] rounded-lg py-3 text-[#8b949e] hover:text-[#e6edf3] hover:border-[#00e5ff40] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 bg-[#00e5ff] text-[#080c14] font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00cfea] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
