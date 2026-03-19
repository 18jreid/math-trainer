"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Stethoscope, HeartPulse, Timer, ClipboardList } from "lucide-react";
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

function getGrade(pct: number): { label: string; sub: string; color: string; glow: string; ring: string } {
  if (pct === 100) return { label: "Exemplary",    sub: "Flawless session",          color: "text-[#4ade80]", glow: "glow-green", ring: "border-[#22c55e]" };
  if (pct >= 80)  return { label: "Proficient",   sub: "Strong clinical accuracy",  color: "text-[#00c9a7]", glow: "glow-teal",  ring: "border-[#00c9a7]" };
  if (pct >= 60)  return { label: "Developing",   sub: "Keep pushing forward",      color: "text-[#38bdf8]", glow: "",           ring: "border-[#0ea5e9]" };
  return               { label: "Needs Review",  sub: "More practice recommended", color: "text-[#fb923c]", glow: "",           ring: "border-[#f97316]" };
}

export default function ResultsScreen({ results, onRetry, onHome }: ResultsScreenProps) {
  const correct  = results.filter((r) => r.correct).length;
  const total    = results.length;
  const pct      = Math.round((correct / total) * 100);
  const avgTime  = Math.round(results.reduce((s, r) => s + r.timeMs, 0) / total);
  const grade    = getGrade(pct);
  const streak   = results.reduce((best, r, i) => {
    let run = 0;
    for (let j = i; j < results.length && results[j].correct; j++) run++;
    return Math.max(best, run);
  }, 0);

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <ClipboardList className="w-4 h-4 text-[#00c9a7]" />
          <span className="text-[#00c9a7] text-xs font-mono uppercase tracking-widest">
            Session Report
          </span>
        </div>

        {/* Score ring */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={`inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 ${grade.ring} bg-[#091418] mb-4`}
          >
            <span className={`text-3xl font-bold font-mono ${grade.color} ${grade.glow}`}>
              {pct}%
            </span>
            <span className="text-[#163040] text-xs font-mono mt-0.5">SCORE</span>
          </motion.div>
          <h2 className={`text-2xl font-bold mb-1 ${grade.color}`}>{grade.label}</h2>
          <p className="text-[#6b9ea8] text-sm">{grade.sub}</p>
        </div>

        {/* Vitals row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <HeartPulse className="w-4 h-4" />, label: "Accurate",    value: `${correct}/${total}`, color: "text-[#4ade80]" },
            { icon: <Timer className="w-4 h-4" />,      label: "Avg Response", value: formatTime(avgTime),  color: "text-[#00c9a7]" },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: "Best Streak", value: `${streak}`,         color: "text-[#38bdf8]" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="border border-[#163040] rounded-xl p-3 bg-[#091418] text-center"
            >
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <div className={`font-mono font-bold text-lg ${s.color}`}>{s.value}</div>
              <div className="text-[#6b9ea8] text-xs mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Case Review */}
        <div className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-[#163040] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7]" />
            <h3 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">
              Case Review
            </h3>
          </div>
          <div className="divide-y divide-[#0e1f24] max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className="px-5 py-3 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {r.correct
                    ? <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                    : <XCircle className="w-4 h-4 text-[#ef4444]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e2f4f1] text-sm leading-snug truncate" title={r.question.prompt}>
                    {r.question.prompt}
                  </p>
                  {!r.correct && (
                    <p className="text-[#6b9ea8] text-xs mt-0.5">
                      You entered {r.userAnswer?.toLocaleString() ?? "—"} · Correct:{" "}
                      <span className="text-[#e2f4f1]">{r.question.answer.toLocaleString()}</span>
                      {r.question.hint && <span className="text-[#163040]"> · {r.question.hint}</span>}
                    </p>
                  )}
                </div>
                <span className="text-[#163040] font-mono text-xs shrink-0">{formatTime(r.timeMs)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="flex-1 border border-[#163040] rounded-xl py-3 text-[#6b9ea8] hover:text-[#e2f4f1] hover:border-[#00c9a740] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            New Session
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="flex-1 bg-[#00c9a7] text-[#060e10] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00b896] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retrain
          </motion.button>
        </div>

        <p className="text-center text-[#163040] text-xs font-mono mt-5 tracking-widest">
          ONE WELLNESS UTAH · WOODS CROSS, UT
        </p>
      </motion.div>
    </div>
  );
}
