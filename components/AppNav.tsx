"use client";

import React from "react";
import { Home, TrendingUp, CalendarDays, FlaskConical, BookOpenText, Volume2, VolumeX } from "lucide-react";
import { loadSoundEnabled, saveSoundEnabled } from "@/lib/storage";

export type NavView = "home" | "progress" | "daily" | "scenarios";

interface AppNavProps {
  current: NavView;
  onNavigate: (view: NavView) => void;
}

const TABS: { id: NavView; icon: React.ReactNode; label: string }[] = [
  { id: "home",      icon: <Home className="w-5 h-5" />,         label: "Train"    },
  { id: "progress",  icon: <TrendingUp className="w-5 h-5" />,   label: "Progress" },
  { id: "daily",     icon: <CalendarDays className="w-5 h-5" />, label: "Daily"    },
  { id: "scenarios", icon: <FlaskConical className="w-5 h-5" />, label: "Scenarios" },
];

export default function AppNav({ current, onNavigate }: AppNavProps) {
  const [soundOn, setSoundOn] = React.useState(true);

  React.useEffect(() => { setSoundOn(loadSoundEnabled()); }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    saveSoundEnabled(next);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-[#163040] bg-[#060e10]/95 backdrop-blur-sm z-50">
      <div className="flex items-center max-w-2xl mx-auto">
        {TABS.map((tab) => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors cursor-pointer ${
                active ? "text-[#00c9a7]" : "text-[#163040] hover:text-[#6b9ea8]"
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-mono uppercase tracking-wider">{tab.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-[#00c9a7] mt-0.5" />}
            </button>
          );
        })}

        {/* Reference link */}
        <a
          href="/reference"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[#163040] hover:text-[#6b9ea8] transition-colors cursor-pointer"
        >
          <BookOpenText className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider">Reference</span>
        </a>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors cursor-pointer ${
            soundOn ? "text-[#6b9ea8]" : "text-[#163040] hover:text-[#6b9ea8]"
          }`}
        >
          {soundOn
            ? <Volume2 className="w-5 h-5" />
            : <VolumeX  className="w-5 h-5" />
          }
          <span className="text-[9px] font-mono uppercase tracking-wider">Sound</span>
        </button>
      </div>
    </div>
  );
}
