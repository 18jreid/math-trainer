"use client";

import React, { useState, useCallback } from "react";
import HomeScreen from "@/components/HomeScreen";
import TrainingSession, { type SessionResult } from "@/components/TrainingSession";
import ResultsScreen from "@/components/ResultsScreen";
import { generateQuestions, type Operation, type Difficulty } from "@/lib/questions";
import type { Question } from "@/lib/questions";

type AppView = "home" | "session" | "results";

export default function Page() {
  const [view, setView] = useState<AppView>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [lastConfig, setLastConfig] = useState<{ op: Operation; diff: Difficulty; count: number } | null>(null);
  const [results, setResults] = useState<SessionResult[]>([]);

  const handleStart = useCallback((op: Operation, diff: Difficulty, count: number) => {
    setLastConfig({ op, diff, count });
    setQuestions(generateQuestions(op, diff, count));
    setView("session");
  }, []);

  const handleFinish = useCallback((sessionResults: SessionResult[]) => {
    setResults(sessionResults);
    setView("results");
  }, []);

  const handleRetry = useCallback(() => {
    if (!lastConfig) return;
    setQuestions(generateQuestions(lastConfig.op, lastConfig.diff, lastConfig.count));
    setView("session");
  }, [lastConfig]);

  const handleHome = useCallback(() => {
    setView("home");
  }, []);

  if (view === "home") {
    return <HomeScreen onStart={handleStart} />;
  }

  if (view === "session") {
    return (
      <TrainingSession
        questions={questions}
        onFinish={handleFinish}
        onHome={handleHome}
      />
    );
  }

  return (
    <ResultsScreen
      results={results}
      onRetry={handleRetry}
      onHome={handleHome}
    />
  );
}
