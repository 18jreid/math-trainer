"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Flame, CheckCircle2, ChevronRight } from "lucide-react";
import {
  loadDailyChallengeRecord, saveDailyChallengeRecord, getLocalDate,
  type DailyChallengeRecord,
} from "@/lib/storage";
import { generateQuestions } from "@/lib/questions";
import type { Question } from "@/lib/questions";
import type { NavView } from "@/lib/storage";
import AppNav from "./AppNav";

interface DailyChallengeProps {
  onStartChallenge: (questions: Question[], isDaily: boolean) => void;
  onNavigate: (view: NavView) => void;
}

function getOrCreateDailyRecord(): DailyChallengeRecord {
  const today    = getLocalDate();
  const existing = loadDailyChallengeRecord();

  if (existing && existing.date === today) return existing;

  // New day — generate fresh questions and handle streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toLocaleDateString("en-CA");

  const streak = existing?.lastCompletedDate === yStr ? existing.streak : 0;

  const record: DailyChallengeRecord = {
    date: today,
    questions: generateQuestions("mixed", "easy", 5),
    completed: false,
    streak,
    lastCompletedDate: existing?.lastCompletedDate ?? null,
  };
  saveDailyChallengeRecord(record);
  return record;
}

function weekdayLabel(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "long" });
}

export default function DailyChallenge({ onStartChallenge, onNavigate }: DailyChallengeProps) {
  const [record, setRecord] = useState<DailyChallengeRecord | null>(null);

  useEffect(() => {
    setRecord(getOrCreateDailyRecord());
  }, []);

  if (!record) return null;

  const streakDisplay = record.streak > 0
    ? `${record.streak} day${record.streak !== 1 ? "s" : ""} in a row`
    : "Start your streak today";

  return (
    <div className="min-h-screen grid-bg flex flex-col pb-20">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[#163040]">
        <CalendarDays className="w-4 h-4 text-[#00c9a7]" />
        <h1 className="text-sm font-mono uppercase tracking-widest text-[#00c9a7]">Daily Challenge</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full space-y-5"
        >
          {/* Streak card */}
          <div className="border border-[#163040] rounded-2xl bg-[#091418] p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className={`w-6 h-6 ${record.streak > 0 ? "text-[#fb923c]" : "text-[#163040]"}`} />
              <span className={`font-mono font-bold text-4xl ${record.streak > 0 ? "text-[#fb923c]" : "text-[#163040]"}`}>
                {record.streak}
              </span>
            </div>
            <p className="text-[#6b9ea8] text-sm">{streakDisplay}</p>
          </div>

          {/* Today card */}
          <div className={`border rounded-2xl p-5 ${
            record.completed
              ? "border-[#22c55e] bg-[#22c55e08]"
              : "border-[#163040] bg-[#091418] border-glow"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Today</p>
                <p className="text-[#e2f4f1] font-semibold">{weekdayLabel(record.date)}</p>
              </div>
              {record.completed && (
                <div className="flex items-center gap-1.5 text-[#22c55e]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Complete</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[#6b9ea8] text-sm mb-4">
              <span className="font-mono text-[#00c9a7]">5</span> mixed questions ·
              <span className="font-mono text-[#00c9a7]">easy</span> difficulty
            </div>

            {record.completed ? (
              <button
                onClick={() => onStartChallenge(record.questions, true)}
                className="w-full border border-[#22c55e40] rounded-xl py-3 text-[#22c55e] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#22c55e08] transition-colors"
              >
                Practice Again
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartChallenge(record.questions, true)}
                className="w-full bg-[#00c9a7] text-[#060e10] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00b896] transition-colors"
              >
                Begin Today&apos;s Challenge
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* How streaks work */}
          <div className="border border-[#163040] rounded-2xl bg-[#091418] p-4">
            <p className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest mb-2">How it works</p>
            <ul className="space-y-1.5 text-[#6b9ea8] text-sm">
              <li className="flex gap-2"><span className="text-[#00c9a7]">·</span> 5 new questions every day</li>
              <li className="flex gap-2"><span className="text-[#00c9a7]">·</span> Complete daily to build your streak</li>
              <li className="flex gap-2"><span className="text-[#fb923c]">·</span> Miss a day and the streak resets</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <AppNav current="daily" onNavigate={onNavigate} />
    </div>
  );
}
