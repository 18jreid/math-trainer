"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, FlaskConical, ArrowRight, Stethoscope } from "lucide-react";
import type { Question } from "@/lib/questions";

interface TrainingSessionProps {
  questions: Question[];
  onFinish: (results: SessionResult[]) => void;
  onHome: () => void;
}

export interface SessionResult {
  question: Question;
  userAnswer: number | null;
  correct: boolean;
  timeMs: number;
}

type Phase = "question" | "correct" | "wrong";

const opLabel: Record<string, string> = {
  division:       "÷",
  multiplication: "×",
  addition:       "+",
  subtraction:    "−",
};

const opColor: Record<string, string> = {
  division:       "text-[#00c9a7]",
  multiplication: "text-[#38bdf8]",
  addition:       "text-[#4ade80]",
  subtraction:    "text-[#fb923c]",
};

const opBadge: Record<string, string> = {
  division:       "Dosage Calc",
  multiplication: "Supply Count",
  addition:       "Stock Add",
  subtraction:    "Inventory",
};

export default function TrainingSession({ questions, onFinish, onHome }: TrainingSessionProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("question");
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const current = questions[index];
  const progress = (index / questions.length) * 100;

  useEffect(() => {
    setStartTime(Date.now());
    setInput("");
    setShowHint(false);
    setPhase("question");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [index]);

  const submit = useCallback(() => {
    if (phase !== "question") return;
    const num = parseInt(input.replace(/,/g, ""), 10);
    const isCorrect = num === current.answer;
    const result: SessionResult = {
      question: current,
      userAnswer: isNaN(num) ? null : num,
      correct: isCorrect,
      timeMs: Date.now() - startTime,
    };

    const newResults = [...results, result];
    setResults(newResults);
    setPhase(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        onFinish(newResults);
      } else {
        setIndex((i) => i + 1);
      }
    }, isCorrect ? 800 : 1800);
  }, [phase, input, current, startTime, results, index, questions.length, onFinish]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#163040]">
        <button
          onClick={onHome}
          className="text-[#6b9ea8] hover:text-[#e2f4f1] transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Stethoscope className="w-4 h-4" />
          One Wellness
        </button>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${opColor[current.operation]} border-current border-opacity-30 bg-current bg-opacity-5`}>
            {opBadge[current.operation]}
          </span>
          <span className="font-mono text-[#6b9ea8] text-sm">
            {index + 1}<span className="text-[#163040]">/</span>{questions.length}
          </span>
        </div>

        <span className={`font-mono text-xl font-bold ${opColor[current.operation] ?? "text-[#00c9a7]"}`}>
          {opLabel[current.operation]}
        </span>
      </div>

      {/* Vitals progress bar */}
      <div className="h-1 bg-[#163040] relative overflow-hidden">
        <motion.div
          className="h-full bg-[#00c9a7]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl"
          >
            {/* Case number label */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-[#163040]" />
              <span className="text-[#163040] text-xs font-mono uppercase tracking-widest">
                Case {index + 1} of {questions.length}
              </span>
              <div className="h-px flex-1 bg-[#163040]" />
            </div>

            {/* Question card */}
            <div
              className={`border rounded-2xl p-7 mb-6 transition-all duration-300 relative overflow-hidden ${
                phase === "correct"
                  ? "border-[#22c55e] bg-[#22c55e08] border-glow-green"
                  : phase === "wrong"
                  ? "border-[#ef4444] bg-[#ef444408] border-glow-red"
                  : "border-[#163040] bg-[#091418] border-glow"
              }`}
            >
              {/* Subtle cross watermark */}
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="0" width="8" height="32" rx="2" fill="#00c9a7"/>
                  <rect x="0" y="12" width="32" height="8" rx="2" fill="#00c9a7"/>
                </svg>
              </div>

              <p className="text-[#e2f4f1] text-xl leading-relaxed text-center">
                {current.prompt}
              </p>

              {showHint && current.hint && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-[#163040] text-center"
                >
                  <p className="text-[#6b9ea8] font-mono text-sm">
                    <span className="text-[#00c9a7]">Rx: </span>{current.hint} = ?
                  </p>
                </motion.div>
              )}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {phase === "correct" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-[#22c55e] font-bold text-lg mb-4 glow-green"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Correct — well done!
                </motion.div>
              )}
              {phase === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-1.5 mb-4"
                >
                  <div className="flex items-center gap-2 text-[#ef4444] font-bold text-lg glow-red">
                    <XCircle className="w-6 h-6" />
                    Correct answer:{" "}
                    <span className="text-[#e2f4f1]">{current.answer.toLocaleString()}</span>
                  </div>
                  {current.hint && (
                    <p className="text-[#6b9ea8] font-mono text-sm">{current.hint}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            {phase === "question" && (
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your answer..."
                  className="flex-1 bg-[#091418] border border-[#163040] rounded-xl px-4 py-3 text-[#e2f4f1] font-mono text-xl text-center focus:outline-none focus:border-[#00c9a7] transition-colors placeholder:text-[#163040]"
                />
                <button
                  onClick={submit}
                  className="bg-[#00c9a7] text-[#060e10] px-5 py-3 rounded-xl font-bold hover:bg-[#00b896] transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Hint */}
            {phase === "question" && current.hint && !showHint && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-[#6b9ea8] hover:text-[#00c9a7] transition-colors text-sm cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" />
                  Show calculation hint
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
