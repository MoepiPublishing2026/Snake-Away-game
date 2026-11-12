import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIFE_CAP, POWER_CAP, START_COINS } from "./theme";
import type { FontChoice, TextSize } from "./ui/typeface";

export type School = "primary" | "secondary";
export type Character = "girl" | "boy";

export type Inventory = {
  lives: number;
  hint: number;
  shuffle: number;
  freeze: number;
};

const SETTINGS_KEY = "snake-away-settings-v1";
const SCHOOL_KEY = "snake-away-school-v1";
const CHARACTER_KEY = "snake-away-character-v1";
const coinsKey = (school: School) => `snake-away-score-v2-${school}`;
const bestKey = (school: School) => `snake-away-best-v7-${school}`;
const inventoryKey = (school: School) => `snake-away-pack-v1-${school}`;
const levelKey = (school: School) => `snake-away-level-v1-${school}`;

export const DEFAULT_INVENTORY: Inventory = { lives: 3, hint: 1, shuffle: 1, freeze: 1 };

export type GameSettings = {
  sound: boolean;
  music: boolean;
  vibration: boolean;
  textSize: TextSize;
  font: FontChoice;
  contrast: boolean;
  bright: boolean;
  reduceMotion: boolean;
  confirmQuit: boolean;
};

export const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  music: true,
  vibration: false,
  textSize: "medium",
  font: "clean",
  contrast: false,
  bright: false,
  reduceMotion: false,
  confirmQuit: false,
};

function flag(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function textSizeOf(parsed: { textSize?: unknown; largeText?: boolean }): TextSize {
  if (parsed.textSize === "small" || parsed.textSize === "medium" || parsed.textSize === "large") return parsed.textSize;
  if (parsed.largeText) return "large";
  return "medium";
}

function fontOf(value: unknown): FontChoice {
  if (value === "clean" || value === "round" || value === "serif" || value === "mono") return value;
  return "clean";
}

function clampCount(value: unknown, max: number, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(0, Math.floor(n)));
}

const HIGH_LEVEL_OFFSET = 8;

export async function getSavedSchool(): Promise<School | null> {
  const value = await AsyncStorage.getItem(SCHOOL_KEY);
  if (value === "high") {
    await mergeHighSchoolIntoSecondary();
    return "secondary";
  }
  if (value === "primary" || value === "secondary") return value;
  return null;
}

async function mergeHighSchoolIntoSecondary() {
  const [highCoins, highBest, highLevel, highPack, secCoins, secBest, secLevel, secPack] = await Promise.all([
    AsyncStorage.getItem("snake-away-score-v2-high"),
    AsyncStorage.getItem("snake-away-best-v7-high"),
    AsyncStorage.getItem("snake-away-level-v1-high"),
    AsyncStorage.getItem("snake-away-pack-v1-high"),
    AsyncStorage.getItem(coinsKey("secondary")),
    AsyncStorage.getItem(bestKey("secondary")),
    AsyncStorage.getItem(levelKey("secondary")),
    AsyncStorage.getItem(inventoryKey("secondary")),
  ]);

  const highBestN = Number(highBest);
  const secBestN = Number(secBest);
  if (Number.isFinite(highBestN) && highBestN > 0) {
    const merged = Math.max(Number.isFinite(secBestN) ? secBestN : 0, highBestN + HIGH_LEVEL_OFFSET);
    await AsyncStorage.setItem(bestKey("secondary"), String(merged));
  }

  const highLevelN = Number(highLevel);
  const secLevelN = Number(secLevel);
  if (Number.isFinite(highLevelN) && highLevelN > 0) {
    const merged = Math.max(Number.isFinite(secLevelN) ? secLevelN : 0, highLevelN + HIGH_LEVEL_OFFSET);
    await AsyncStorage.setItem(levelKey("secondary"), String(merged));
  }

  if (highCoins !== null) {
    const highCoinsN = Number(highCoins);
    const secCoinsN = secCoins === null ? null : Number(secCoins);
    if (Number.isFinite(highCoinsN)) {
      const kept = secCoinsN !== null && Number.isFinite(secCoinsN) ? secCoinsN : 0;
      await AsyncStorage.setItem(coinsKey("secondary"), String(Math.max(0, Math.max(kept, highCoinsN))));
    }
  }

  if (secPack === null && highPack) {
    await AsyncStorage.setItem(inventoryKey("secondary"), highPack);
  }

  await AsyncStorage.setItem(SCHOOL_KEY, "secondary");
}

export async function saveSchool(school: School): Promise<void> {
  await AsyncStorage.setItem(SCHOOL_KEY, school);
}

export async function getSavedCharacter(): Promise<Character | null> {
  const value = await AsyncStorage.getItem(CHARACTER_KEY);
  if (value === "girl" || value === "boy") return value;
  return null;
}

export async function saveCharacter(who: Character): Promise<void> {
  await AsyncStorage.setItem(CHARACTER_KEY, who);
}

export async function loadCoins(school: School): Promise<number> {
  const saved = await AsyncStorage.getItem(coinsKey(school));
  if (saved === null) {
    await AsyncStorage.setItem(coinsKey(school), String(START_COINS));
    return START_COINS;
  }
  const n = Number(saved);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export async function saveCoins(school: School, coins: number): Promise<void> {
  await AsyncStorage.setItem(coinsKey(school), String(Math.max(0, coins)));
}

export async function loadBestLevel(school: School): Promise<number> {
  const saved = await AsyncStorage.getItem(bestKey(school));
  const n = Number(saved || 1);
  return Number.isFinite(n) ? Math.max(1, n) : 1;
}

export async function saveBestLevel(school: School, level: number): Promise<void> {
  await AsyncStorage.setItem(bestKey(school), String(Math.max(1, level)));
}

export async function loadLevel(school: School): Promise<number | null> {
  const saved = await AsyncStorage.getItem(levelKey(school));
  if (saved === null) return null;
  const n = Number(saved);
  return Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
}

export async function saveLevel(school: School, level: number): Promise<void> {
  await AsyncStorage.setItem(levelKey(school), String(Math.max(1, Math.floor(level))));
}

export async function loadInventory(school: School): Promise<Inventory> {
  const saved = await AsyncStorage.getItem(inventoryKey(school));
  if (!saved) return { ...DEFAULT_INVENTORY };
  try {
    const parsed = JSON.parse(saved) as Partial<Inventory>;
    return {
      lives: clampCount(parsed.lives, LIFE_CAP, DEFAULT_INVENTORY.lives),
      hint: clampCount(parsed.hint, POWER_CAP, DEFAULT_INVENTORY.hint),
      shuffle: clampCount(parsed.shuffle, POWER_CAP, DEFAULT_INVENTORY.shuffle),
      freeze: clampCount(parsed.freeze, POWER_CAP, DEFAULT_INVENTORY.freeze),
    };
  } catch {
    return { ...DEFAULT_INVENTORY };
  }
}

export async function loadSettings(): Promise<GameSettings> {
  const saved = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!saved) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(saved) as Partial<GameSettings> & { largeText?: boolean };
    return {
      sound: flag(parsed.sound, DEFAULT_SETTINGS.sound),
      music: flag(parsed.music, DEFAULT_SETTINGS.music),
      vibration: flag(parsed.vibration, DEFAULT_SETTINGS.vibration),
      textSize: textSizeOf(parsed),
      font: fontOf(parsed.font),
      contrast: flag(parsed.contrast, DEFAULT_SETTINGS.contrast),
      bright: flag(parsed.bright, DEFAULT_SETTINGS.bright),
      reduceMotion: flag(parsed.reduceMotion, DEFAULT_SETTINGS.reduceMotion),
      confirmQuit: flag(parsed.confirmQuit, DEFAULT_SETTINGS.confirmQuit),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function saveInventory(school: School, inventory: Inventory): Promise<void> {
  const packed: Inventory = {
    lives: clampCount(inventory.lives, LIFE_CAP, DEFAULT_INVENTORY.lives),
    hint: clampCount(inventory.hint, POWER_CAP, DEFAULT_INVENTORY.hint),
    shuffle: clampCount(inventory.shuffle, POWER_CAP, DEFAULT_INVENTORY.shuffle),
    freeze: clampCount(inventory.freeze, POWER_CAP, DEFAULT_INVENTORY.freeze),
  };
  await AsyncStorage.setItem(inventoryKey(school), JSON.stringify(packed));
}
