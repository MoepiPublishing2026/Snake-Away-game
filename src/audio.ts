import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import type { GameSettings } from "./storage";
import { pulse, setVibrationEnabled, type Pulse } from "./vibration";

const SOURCES = {
  correct: require("../assets/sfx/correct.wav"),
  wrong: require("../assets/sfx/wrong.wav"),
  hit: require("../assets/sfx/hit.wav"),
  lose: require("../assets/sfx/lose.wav"),
  win: require("../assets/sfx/win.wav"),
  quiz: require("../assets/sfx/quiz.wav"),
  freeze: require("../assets/sfx/freeze.wav"),
  hint: require("../assets/sfx/hint.wav"),
  shuffle: require("../assets/sfx/shuffle.wav"),
  buy: require("../assets/sfx/buy.wav"),
  deny: require("../assets/sfx/deny.wav"),
  spin: require("../assets/sfx/spin.wav"),
  tick: require("../assets/sfx/tick.wav"),
  reward: require("../assets/sfx/reward.wav"),
  miss: require("../assets/sfx/miss.wav"),
  click: require("../assets/sfx/click.wav"),
  start: require("../assets/sfx/start.wav"),
  music: require("../assets/sfx/music.wav"),
} as const;

export type SfxName = Exclude<keyof typeof SOURCES, "music">;

const LOUD = new Set<SfxName>(["win", "lose", "reward"]);

const PULSE: Partial<Record<SfxName, Pulse>> = {
  correct: "tap",
  quiz: "tap",
  hint: "tap",
  freeze: "tap",
  shuffle: "tap",
  buy: "tap",
  start: "tap",
  click: "tap",
  wrong: "warn",
  deny: "warn",
  miss: "warn",
  hit: "heavy",
  spin: "heavy",
  win: "success",
  reward: "success",
  lose: "error",
};

let soundOn = true;
let musicOn = true;
let unlocked = false;
let music: AudioPlayer | null = null;
let duckToken = 0;
let wheelTimers: ReturnType<typeof setTimeout>[] = [];
const effects = new Map<SfxName, AudioPlayer>();

export function prepareAudio() {
  void setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: "mixWithOthers",
    shouldPlayInBackground: false,
    allowsRecording: false,
  });
}

export function applyAudioSettings(settings: Pick<GameSettings, "sound" | "music" | "vibration">) {
  soundOn = settings.sound;
  musicOn = settings.music;
  setVibrationEnabled(settings.vibration);
  if (!soundOn) {
    for (const player of effects.values()) {
      if (!player.paused) player.pause();
    }
  }
  syncMusic();
}

export function unlockAudio() {
  unlocked = true;
  syncMusic();
}

export function playSfx(name: SfxName) {
  unlockAudio();
  const kind = PULSE[name];
  if (kind) pulse(kind);
  if (!soundOn) return;
  const player = effectPlayer(name);
  player.volume = LOUD.has(name) ? 1 : name === "tick" ? 0.7 : 0.85;
  player.pause();
  void player.seekTo(0);
  player.play();
  if (LOUD.has(name)) duckMusic(name === "win" ? 1500 : 1200);
}

export function stopWheelSpin() {
  for (const id of wheelTimers) clearTimeout(id);
  wheelTimers = [];
}

export function playWheelSpin(durationMs = 4300) {
  stopWheelSpin();
  playSfx("spin");
  const started = Date.now();
  const step = () => {
    const elapsed = (Date.now() - started) / durationMs;
    if (elapsed >= 0.98) return;
    playSfx("tick");
    const gap = 65 + elapsed * elapsed * 340;
    wheelTimers.push(setTimeout(step, gap));
  };
  wheelTimers.push(setTimeout(step, 80));
}

function duckMusic(ms: number) {
  if (!music) return;
  duckToken += 1;
  const token = duckToken;
  music.volume = 0.04;
  setTimeout(() => {
    if (token === duckToken && music && musicOn) music.volume = 0.2;
  }, ms);
}

function effectPlayer(name: SfxName) {
  const existing = effects.get(name);
  if (existing) return existing;
  const player = createAudioPlayer(SOURCES[name]);
  player.volume = 0.85;
  effects.set(name, player);
  return player;
}

function syncMusic() {
  if (!musicOn || !unlocked) {
    if (music && !music.paused) music.pause();
    return;
  }
  if (!music) {
    music = createAudioPlayer(SOURCES.music);
    music.loop = true;
    music.volume = 0.2;
  }
  if (music.paused) music.play();
}
