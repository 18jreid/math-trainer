"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Home } from "lucide-react";
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
    }, isCorrect ? 800 : 1600);
  }, [phase, input, current, startTime, results, index, questions.length, onFinish]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  const opLabel: Record<string, string> = {
    division: "÷",
    multiplication: "×",
    addition: "+",
    subtraction: "−",
  };

  const opColor: Record<string, string> = {
    division: "text-[#00e5ff]",
    multiplication: "text-[#a78bfa]",
    addition: "text-[#39d353]",
    subtraction: "text-[#fb923c]",
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d3d]">
        <button
          onClick={onHome}
          className="text-[#8b949e] hover:text-[#e6edf3] transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <span className="font-mono text-[#8b949e] text-sm">
          {index + 1} / {questions.length}
        </span>
        <span className={`font-mono text-sm font-bold ${opColor[current.operation] ?? "text-[#00e5ff]"}`}>
          {opLabel[current.operation]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#1e2d3d]">
        <motion.div
          className="h-full bg-[#00e5ff]"
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
            {/* Question card */}
            <div
              className={`border rounded-xl p-6 mb-6 transition-colors duration-300 ${
                phase === "correct"
                  ? "border-[#39d353] bg-[#39d35308] border-glow-green"
                  : phase === "wrong"
                  ? "border-[#f75555] bg-[#f7555508] border-glow-red"
                  : "border-[#1e2d3d] bg-[#0d1117] border-glow"
              }`}
            >
              <p className="text-[#e6edf3] text-xl leading-relaxed text-center mb-2">
                {current.prompt}
              </p>

              {showHint && current.hint && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-[#8b949e] font-mono text-sm mt-3"
                >
                  Hint: {current.hint} = ?
                </motion.p>
              )}
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
              {phase === "correct" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-[#39d353] font-bold text-lg mb-4 glow-green"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Correct!
                </motion.div>
              )}
              {phase === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-1 mb-4"
                >
                  <div className="flex items-center gap-2 text-[#f75555] font-bold text-lg glow-red">
                    <XCircle className="w-6 h-6" />
                    The answer is{" "}
                    <span className="text-[#e6edf3]">
                      {current.answer.toLocaleString()}
                    </span>
                  </div>
                  {current.hint && (
                    <p className="text-[#8b949e] font-mono text-sm">{current.hint}</p>
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
                  placeholder="Your answer..."
                  className="flex-1 bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-4 py-3 text-[#e6edf3] font-mono text-xl text-center focus:outline-none focus:border-[#00e5ff] transition-colors placeholder:text-[#8b949e]"
                />
                <button
                  onClick={submit}
                  className="bg-[#00e5ff] text-[#080c14] px-5 py-3 rounded-lg font-bold hover:bg-[#00cfea] transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Hint button */}
            {phase === "question" && current.hint && !showHint && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#00e5ff] transition-colors text-sm cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  Show hint
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
