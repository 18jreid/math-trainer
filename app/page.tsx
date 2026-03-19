"use client";

import React, { useState, useCallback, useRef } from "react";
import HomeScreen from "@/components/HomeScreen";
import TrainingSession, { type SessionResult } from "@/components/TrainingSession";
import ResultsScreen from "@/components/ResultsScreen";
import ProgressDashboard from "@/components/ProgressDashboard";
import DailyChallenge from "@/components/DailyChallenge";
import ScenarioBuilder from "@/components/ScenarioBuilder";
import { generateQuestions, type Question, type Operation, type Difficulty } from "@/lib/questions";
import { saveSession, checkAndSavePersonalBest, markDailyComplete, getLocalDate } from "@/lib/storage";
import type { NavView } from "@/lib/storage";

type AppView = "home" | "session" | "results" | "progress" | "daily" | "scenarios";

interface LastConfig {
  op: Operation;
  diff: Difficulty;
  count: number;
  isDaily: boolean;
}

interface NewRecord {
  isNewRecord: boolean;
  field: "score" | "time" | "both" | null;
  op: Operation;
  diff: Difficulty;
}

export default function Page() {
  const [view, setView]           = useState<AppView>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const lastConfigRef             = useRef<LastConfig | null>(null);
  const [results, setResults]     = useState<SessionResult[]>([]);
  const [newRecord, setNewRecord] = useState<NewRecord | null>(null);

  const startSession = useCallback((qs: Question[], op: Operation, diff: Difficulty, isDaily = false) => {
    lastConfigRef.current = { op, diff, count: qs.length, isDaily };
    setQuestions(qs);
    setNewRecord(null);
    setView("session");
  }, []);

  const handleStart = useCallback((op: Operation, diff: Difficulty, count: number) => {
    startSession(generateQuestions(op, diff, count), op, diff, false);
  }, [startSession]);

  const handleFinish = useCallback((sessionResults: SessionResult[]) => {
    setResults(sessionResults);

    const lastConfig = lastConfigRef.current;
    if (lastConfig) {
      const { op, diff, isDaily } = lastConfig;
      const correct   = sessionResults.filter((r) => r.correct).length;
      const total     = sessionResults.length;
      const scorePct  = Math.round((correct / total) * 100);
      const avgTimeMs = Math.round(sessionResults.reduce((s, r) => s + r.timeMs, 0) / total);

      // Save session record
      saveSession({
        id: crypto.randomUUID(),
        date: getLocalDate(),
        timestamp: Date.now(),
        operation: op,
        difficulty: diff,
        questionCount: total,
        correctCount: correct,
        scorePct,
        avgTimeMs,
        isDaily,
        perOp: sessionResults.map((r) => ({
          operation: r.question.operation,
          correct: r.correct,
          timeMs: r.timeMs,
        })),
      });

      // Check personal bests
      const pb = checkAndSavePersonalBest(op, diff, scorePct, avgTimeMs);
      setNewRecord({ ...pb, op, diff });

      // Mark daily complete if applicable
      if (isDaily) markDailyComplete();
    }

    setView("results");
  }, []);

  const handleRetry = useCallback(() => {
    const lastConfig = lastConfigRef.current;
    if (!lastConfig) return;
    startSession(generateQuestions(lastConfig.op, lastConfig.diff, lastConfig.count), lastConfig.op, lastConfig.diff, false);
  }, [startSession]);

  const handleHome = useCallback(() => setView("home"), []);

  const handleNavigate = useCallback((navView: NavView) => {
    setView(navView as AppView);
  }, []);

  const handleDrill = useCallback((op: Operation, diff: Difficulty) => {
    handleStart(op, diff, 10);
  }, [handleStart]);

  const handleDailyStart = useCallback((qs: Question[], isDaily: boolean) => {
    startSession(qs, "mixed", "easy", isDaily);
  }, [startSession]);

  if (view === "session") {
    return (
      <TrainingSession
        questions={questions}
        onFinish={handleFinish}
        onHome={handleHome}
      />
    );
  }

  if (view === "results") {
    return (
      <ResultsScreen
        results={results}
        onRetry={handleRetry}
        onHome={handleHome}
        newRecord={newRecord}
      />
    );
  }

  if (view === "progress") {
    return (
      <ProgressDashboard
        onNavigate={handleNavigate}
        onDrill={handleDrill}
      />
    );
  }

  if (view === "daily") {
    return (
      <DailyChallenge
        onStartChallenge={handleDailyStart}
        onNavigate={handleNavigate}
      />
    );
  }

  if (view === "scenarios") {
    return (
      <ScenarioBuilder
        onPracticeScenarios={(qs) => startSession(qs, "mixed", "easy", false)}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <HomeScreen
      onStart={handleStart}
      onNavigate={handleNavigate}
    />
  );
}
