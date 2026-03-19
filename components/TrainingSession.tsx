"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, FlaskConical, Delete, Stethoscope } from "lucide-react";
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

const PAD_KEYS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["C", "0", "⌫"],
];

export default function TrainingSession({ questions, onFinish, onHome }: TrainingSessionProps) {
  const [index, setIndex]       = useState(0);
  const [input, setInput]       = useState("");
  const [phase, setPhase]       = useState<Phase>("question");
  const [showHint, setShowHint] = useState(false);
  const [results, setResults]   = useState<SessionResult[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  const current  = questions[index];
  const progress = (index / questions.length) * 100;

  useEffect(() => {
    setStartTime(Date.now());
    setInput("");
    setShowHint(false);
    setPhase("question");
  }, [index]);

  const submit = useCallback(() => {
    if (phase !== "question" || input === "") return;
    const num = parseInt(input, 10);
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

  const pressKey = useCallback((key: string) => {
    if (phase !== "question") return;
    if (key === "C") { setInput(""); return; }
    if (key === "⌫") { setInput((v) => v.slice(0, -1)); return; }
    if (input.length >= 7) return;
    setInput((v) => v + key);
  }, [phase, input]);

  // Physical keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "question") return;
      if (e.key >= "0" && e.key <= "9") pressKey(e.key);
      else if (e.key === "Backspace")    pressKey("⌫");
      else if (e.key === "Escape")       pressKey("C");
      else if (e.key === "Enter")        submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, pressKey, submit]);

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

      {/* Progress bar */}
      <div className="h-1 bg-[#163040]">
        <motion.div
          className="h-full bg-[#00c9a7]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm flex flex-col gap-4"
          >
            {/* Case label */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[#163040]" />
              <span className="text-[#163040] text-xs font-mono uppercase tracking-widest">
                Case {index + 1} of {questions.length}
              </span>
              <div className="h-px flex-1 bg-[#163040]" />
            </div>

            {/* Question card */}
            <div className={`border rounded-2xl p-5 transition-all duration-300 relative overflow-hidden ${
              phase === "correct" ? "border-[#22c55e] bg-[#22c55e08] border-glow-green"
              : phase === "wrong" ? "border-[#ef4444] bg-[#ef444408] border-glow-red"
              : "border-[#163040] bg-[#091418] border-glow"
            }`}>
              <div className="absolute top-3 right-3 opacity-5 pointer-events-none">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="0" width="8" height="32" rx="2" fill="#00c9a7"/>
                  <rect x="0" y="12" width="32" height="8" rx="2" fill="#00c9a7"/>
                </svg>
              </div>
              <p className="text-[#e2f4f1] text-base leading-relaxed text-center">
                {current.prompt}
              </p>
              {showHint && current.hint && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 pt-3 border-t border-[#163040] text-center"
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
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-[#22c55e] font-bold text-base glow-green"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Correct — well done!
                </motion.div>
              )}
              {phase === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex items-center gap-2 text-[#ef4444] font-bold text-base glow-red">
                    <XCircle className="w-5 h-5" />
                    Correct answer:{" "}
                    <span className="text-[#e2f4f1]">{current.answer.toLocaleString()}</span>
                  </div>
                  {current.hint && (
                    <p className="text-[#6b9ea8] font-mono text-xs">{current.hint}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numpad */}
            {phase === "question" && (
              <div className="flex flex-col gap-2">
                {/* Display */}
                <div className="bg-[#091418] border border-[#163040] rounded-xl px-5 py-3 text-center font-mono text-3xl text-[#e2f4f1] tracking-widest min-h-[60px] flex items-center justify-center">
                  {input === "" ? (
                    <span className="text-[#163040]">—</span>
                  ) : (
                    <motion.span
                      key={input}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.08 }}
                    >
                      {parseInt(input, 10).toLocaleString()}
                    </motion.span>
                  )}
                </div>

                {/* Digit grid */}
                <div className="grid grid-cols-3 gap-2">
                  {PAD_KEYS.flat().map((key) => {
                    const isBackspace = key === "⌫";
                    const isClear     = key === "C";
                    return (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => pressKey(key)}
                        className={`py-4 rounded-xl font-mono font-bold text-xl cursor-pointer transition-colors select-none ${
                          isBackspace
                            ? "bg-[#0e1f24] border border-[#163040] text-[#6b9ea8] hover:bg-[#163040] hover:text-[#e2f4f1]"
                            : isClear
                            ? "bg-[#0e1f24] border border-[#ef444430] text-[#ef4444] hover:bg-[#ef444412]"
                            : "bg-[#0e1f24] border border-[#163040] text-[#e2f4f1] hover:bg-[#163040] hover:border-[#00c9a740]"
                        }`}
                      >
                        {isBackspace ? <Delete className="w-5 h-5 mx-auto" /> : key}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Confirm */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={submit}
                  disabled={input === ""}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-colors cursor-pointer ${
                    input === ""
                      ? "bg-[#163040] text-[#6b9ea8] cursor-not-allowed"
                      : "bg-[#00c9a7] text-[#060e10] hover:bg-[#00b896]"
                  }`}
                >
                  Confirm
                </motion.button>

                {/* Hint */}
                {current.hint && !showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center justify-center gap-1.5 text-[#6b9ea8] hover:text-[#00c9a7] transition-colors text-sm cursor-pointer pt-1"
                  >
                    <FlaskConical className="w-4 h-4" />
                    Show calculation hint
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
