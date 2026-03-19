import { loadSoundEnabled } from "./storage";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!("AudioContext" in window)) return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.25,
): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g   = c.createGain();
  osc.connect(g);
  g.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + duration);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.01);
}

export function playCorrect(): void {
  if (!loadSoundEnabled()) return;
  tone(523, 0,    0.09); // C5
  tone(784, 0.09, 0.14); // G5
}

export function playWrong(): void {
  if (!loadSoundEnabled()) return;
  tone(200, 0, 0.28, "sawtooth", 0.15);
}

export function isSoundSupported(): boolean {
  return typeof window !== "undefined" && "AudioContext" in window;
}
