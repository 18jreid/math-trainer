"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Plus, Trash2, ChevronRight, Play } from "lucide-react";
import {
  loadScenarios, saveScenario, deleteScenario,
  type CustomScenario, type CoreOperation, type NavView,
} from "@/lib/storage";
import { generateCustomQuestions } from "@/lib/questions";
import type { Question } from "@/lib/questions";
import AppNav from "./AppNav";

interface ScenarioBuilderProps {
  onPracticeScenarios: (questions: Question[]) => void;
  onNavigate: (view: NavView) => void;
}

const OP_OPTIONS: { value: CoreOperation; label: string; aLabel: string; bLabel: string }[] = [
  { value: "division",       label: "Division",       aLabel: "Total amount",     bLabel: "Per unit (divisor)" },
  { value: "multiplication", label: "Multiplication", aLabel: "Count",            bLabel: "Per unit"           },
  { value: "addition",       label: "Addition",       aLabel: "First value",      bLabel: "Second value"       },
  { value: "subtraction",    label: "Subtraction",    aLabel: "Starting amount",  bLabel: "Amount to remove"   },
];

const OP_COLORS: Record<CoreOperation, string> = {
  division: "text-[#00c9a7]", multiplication: "text-[#38bdf8]",
  addition: "text-[#4ade80]", subtraction: "text-[#fb923c]",
};

export default function ScenarioBuilder({ onPracticeScenarios, onNavigate }: ScenarioBuilderProps) {
  const [scenarios, setScenarios] = useState<CustomScenario[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [op, setOp]               = useState<CoreOperation>("division");
  const [aVal, setAVal]           = useState("");
  const [bVal, setBVal]           = useState("");
  const [label, setLabel]         = useState("");
  const [error, setError]         = useState("");

  useEffect(() => { setScenarios(loadScenarios()); }, []);

  const opDef = OP_OPTIONS.find((o) => o.value === op)!;

  function computeAnswer(operation: CoreOperation, a: number, b: number): number {
    switch (operation) {
      case "division":       return Math.round(a / b);
      case "multiplication": return a * b;
      case "addition":       return a + b;
      case "subtraction":    return a - b;
    }
  }

  function handleAdd() {
    const a = parseInt(aVal, 10);
    const b = parseInt(bVal, 10);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { setError("Both values must be positive numbers."); return; }
    if (op === "division" && a % b !== 0)           { setError("For division, the total must divide evenly by the per-unit value."); return; }
    if (op === "subtraction" && b >= a)             { setError("Amount to remove must be less than the starting amount."); return; }

    const scenario: CustomScenario = {
      id: crypto.randomUUID(),
      label: label.trim() || `${opDef.label}: ${a.toLocaleString()} / ${b}`,
      a, b, operation: op,
      createdAt: Date.now(),
    };
    saveScenario(scenario);
    setScenarios(loadScenarios());
    setAVal(""); setBVal(""); setLabel(""); setError(""); setShowForm(false);
  }

  function handleDelete(id: string) {
    deleteScenario(id);
    setScenarios(loadScenarios());
  }

  function handlePracticeOne(s: CustomScenario) {
    onPracticeScenarios(generateCustomQuestions(s.operation, s.a, s.b, 10));
  }

  function handlePracticeAll() {
    if (!scenarios.length) return;
    const qs: Question[] = [];
    scenarios.forEach((s) => { qs.push(...generateCustomQuestions(s.operation, s.a, s.b, 3)); });
    qs.sort(() => Math.random() - 0.5);
    onPracticeScenarios(qs);
  }

  return (
    <div className="min-h-screen grid-bg flex flex-col pb-20">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#163040]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-[#00c9a7]" />
          <h1 className="text-sm font-mono uppercase tracking-widest text-[#00c9a7]">My Scenarios</h1>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(""); }}
          className="flex items-center gap-1.5 text-[#00c9a7] text-sm border border-[#00c9a740] rounded-lg px-3 py-1.5 hover:bg-[#00c9a712] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="flex-1 px-4 py-6 max-w-xl mx-auto w-full space-y-4">

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="border border-[#00c9a740] rounded-2xl bg-[#091418] p-5 space-y-4 overflow-hidden"
            >
              {/* Operation */}
              <div>
                <label className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest block mb-2">Procedure Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {OP_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setOp(o.value)}
                      className={`py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                        op === o.value
                          ? `border-current bg-current/10 ${OP_COLORS[o.value]}`
                          : "border-[#163040] text-[#6b9ea8] hover:border-[#6b9ea8]"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { placeholder: opDef.aLabel, val: aVal, set: setAVal },
                  { placeholder: opDef.bLabel, val: bVal, set: setBVal },
                ].map(({ placeholder, val, set }) => (
                  <div key={placeholder}>
                    <label className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest block mb-1">{placeholder}</label>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      className="w-full bg-[#0e1f24] border border-[#163040] rounded-xl px-3 py-2.5 text-[#e2f4f1] font-mono text-center focus:outline-none focus:border-[#00c9a7] transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Label (optional) */}
              <div>
                <label className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest block mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={`e.g. "Standard B12 order"`}
                  className="w-full bg-[#0e1f24] border border-[#163040] rounded-xl px-3 py-2.5 text-[#e2f4f1] text-sm focus:outline-none focus:border-[#00c9a7] transition-colors placeholder:text-[#163040]"
                />
              </div>

              {/* Preview */}
              {aVal && bVal && !isNaN(parseInt(aVal)) && !isNaN(parseInt(bVal)) && parseInt(aVal) > 0 && parseInt(bVal) > 0 && (
                <div className="bg-[#0e1f24] rounded-xl px-4 py-3 text-center">
                  <p className="text-[#6b9ea8] text-xs font-mono mb-1">Answer preview</p>
                  <p className="text-[#00c9a7] font-mono font-bold text-lg">
                    {computeAnswer(op, parseInt(aVal), parseInt(bVal)).toLocaleString()}
                  </p>
                </div>
              )}

              {error && <p className="text-[#ef4444] text-xs text-center">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="w-full bg-[#00c9a7] text-[#060e10] font-bold py-3 rounded-xl cursor-pointer hover:bg-[#00b896] transition-colors"
              >
                Save Scenario
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved list */}
        {scenarios.length === 0 && !showForm ? (
          <div className="border border-[#163040] rounded-2xl bg-[#091418] p-8 text-center">
            <FlaskConical className="w-8 h-8 text-[#163040] mx-auto mb-3" />
            <p className="text-[#6b9ea8] text-sm">No scenarios saved yet.</p>
            <p className="text-[#163040] text-xs mt-1">Add your most common clinic calculations to practice them repeatedly.</p>
          </div>
        ) : (
          <>
            {scenarios.length >= 2 && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handlePracticeAll}
                className="w-full bg-[#00c9a7] text-[#060e10] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#00b896] transition-colors"
              >
                <Play className="w-4 h-4" />
                Practice All ({scenarios.length} scenarios)
              </motion.button>
            )}

            <div className="border border-[#163040] rounded-2xl bg-[#091418] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#163040]">
                <h2 className="text-[#6b9ea8] text-xs font-mono uppercase tracking-widest">Saved Scenarios</h2>
              </div>
              <div className="divide-y divide-[#0e1f24]">
                {scenarios.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-5 py-4 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e2f4f1] text-sm font-semibold truncate">{s.label}</p>
                      <p className={`text-xs font-mono mt-0.5 ${OP_COLORS[s.operation]}`}>
                        {s.a.toLocaleString()} · {s.b.toLocaleString()} · ans: {computeAnswer(s.operation, s.a, s.b).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePracticeOne(s)}
                      className="shrink-0 p-2 rounded-lg bg-[#00c9a712] border border-[#00c9a740] text-[#00c9a7] hover:bg-[#00c9a720] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="shrink-0 p-2 rounded-lg text-[#163040] hover:text-[#ef4444] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AppNav current="scenarios" onNavigate={onNavigate} />
    </div>
  );
}
