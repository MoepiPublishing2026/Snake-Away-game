import type { School } from "../storage";
import { PASS_BASE, PASS_PER_LIFE, TILE_COLORS, type Level, type WheelSlice } from "./content";

export const SNAKE_SEGMENTS = 12;
export const SEG_GAP = 0.042;
export const GRACE_MS = 1500;
export const SAVE_SECONDS: Record<School, number> = { primary: 60, secondary: 45 };
export const SEG_COLORS = [
  "#ff6ad5",
  "#7b5cff",
  "#c7da30",
  "#38b6ff",
  "#a78bfa",
  "#f472b6",
  "#22d3ee",
  "#facc15",
  "#4ade80",
  "#fb7185",
  "#c084fc",
  "#60a5fa",
];

export type SnakeEyes = "soft" | "round" | "sharp";

export type SnakeKind = {
  name: string;
  board: string;
  head: string;
  body: string[];
  headSize: number;
  bodySize: number;
  eyes: SnakeEyes;
  belly?: string;
};

const LONG_BODY = ["#22d3ee", "#7b5cff", "#3b82f6", "#7dff6a", "#ff8a3d", "#ff6ad5", "#f9a8d4", "#ffe14a"];

export const SNAKE_KIND: Record<School, SnakeKind> = {
  primary: {
    name: "Garden snake",
    board: "#1a1048",
    head: "#3ec8ff",
    body: LONG_BODY,
    headSize: 50,
    bodySize: 22,
    eyes: "round",
  },
  secondary: {
    name: "Ribbon snake",
    board: "#1a1048",
    head: "#3ec8ff",
    body: LONG_BODY,
    headSize: 50,
    bodySize: 22,
    eyes: "round",
  },
};

const PATH_POINTS = [
  { x: -0.34, y: 0.82 },
  { x: 0.0, y: 0.76 },
  { x: 0.16, y: 0.74 },
  { x: 0.32, y: 0.76 },
  { x: 0.48, y: 0.84 },
  { x: 0.66, y: 0.92 },
  { x: 0.82, y: 0.8 },
  { x: 0.86, y: 0.6 },
  { x: 0.74, y: 0.44 },
  { x: 0.56, y: 0.4 },
];

export type TileModel = {
  id: number;
  text: string;
  good: boolean;
  color: string;
  status: "idle" | "correct" | "gone" | "wrong" | "hint";
};

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function samplePath(t: number, width: number, height: number) {
  const pts = PATH_POINTS.map((point) => ({ x: point.x * width, y: point.y * height }));
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const distance = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    lens.push(distance);
    total += distance;
  }
  if (total === 0) return { x: pts[0].x, y: pts[0].y };
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    if (target <= lens[i - 1] || i === pts.length - 1) {
      const fraction = lens[i - 1] ? target / lens[i - 1] : 0;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * fraction,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * fraction,
      };
    }
    target -= lens[i - 1];
  }
  return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
}

export function creepStepMs(school: School, level: Level) {
  const steps = Math.max(1, level.maxPos - (level.startAdvance || 0));
  return (SAVE_SECONDS[school] * 1000) / steps;
}

export function pressure(ratio: number): { label: string; tone: "safe" | "warn" | "hot" } {
  if (ratio >= 0.75) return { label: "DANGER", tone: "hot" };
  if (ratio >= 0.45) return { label: "CLOSE", tone: "warn" };
  return { label: "SAFE", tone: "safe" };
}

export function dealTiles(level: Level, nextId: () => number): TileModel[] {
  const harm = shuffle(level.harm).slice(0, level.harmShow);
  const safe = shuffle(level.safe).slice(0, level.safeShow);
  const decoys = shuffle(level.decoys).slice(0, level.decoyShow);
  const words = [
    ...harm.map((text) => ({ text, good: true })),
    ...safe.map((text) => ({ text, good: true })),
    ...decoys.map((text) => ({ text, good: false })),
  ];
  return shuffle(words).map((word, index) => ({
    id: nextId(),
    text: word.text,
    good: word.good,
    color: TILE_COLORS[index % TILE_COLORS.length],
    status: "idle",
  }));
}

export function rewardLine(slice: WheelSlice) {
  if (slice.type === "hint") return "You got a Hint!";
  if (slice.type === "shuffle") return "You got a Shuffle!";
  if (slice.type === "freeze") return "You got a Freeze!";
  if (slice.type === "life") return "You got a Life!";
  if (slice.type === "points") return "Added to your stars";
  return  "Try again next time";
}

export function passReward(lives: number) {
  return PASS_BASE + lives * PASS_PER_LIFE;
}
