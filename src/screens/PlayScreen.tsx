import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { FAIL_PENALTY, QUIZ_PENALTY, TRACKS, WHEEL, type WheelSlice } from "../game/content";
import {
  GRACE_MS,
  creepStepMs,
  dealTiles,
  passReward,
  pressure,
  rewardLine,
  samplePath,
  shuffle as shuffleItems,
  SNAKE_KIND,
  type TileModel,
} from "../game/rules";
import { applyAudioSettings, playSfx, unlockAudio } from "../audio";
import { pulse } from "../vibration";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Character, type GameSettings, type School } from "../storage";
import { colors, LIFE_CAP, POWER_CAP, SHOP } from "../theme";
import { Star, StarAmount } from "../ui/Star";
import { GameButton } from "../ui/GameButton";
import { BrandMark } from "../ui/BrandMark";
import { SettingsPanel } from "../ui/SettingsPanel";
import { fontFace, fontScale } from "../ui/typeface";
import { Learner } from "../ui/Learner";
import { SnakeFace } from "../ui/SnakeMark";
import { BulbIcon, ItemMark, NothingIcon, PrizeGlyph, ShinyHeart, ShuffleIcon, SnowflakeIcon } from "../ui/ShineIcons";

export type RunSnapshot = {
  coins: number;
  lives: number;
  hint: number;
  shuffle: number;
  freeze: number;
  bestLevel: number;
  levelId: number;
};

type Phase = "play" | "pause" | "shop" | "settings" | "howto" | "quiz" | "box" | "reward" | "win" | "lose" | "confirm";

const VISUAL_BEADS = 9;

const HOW_TO_PLAY = [
  "Read the situation.",
  "Watch the snake approach.",
  "Select the correct harm words and safe responses.",
  "Correct answers push the snake back.",
  "Wrong answers let the snake move closer.",
  "Use power-ups: Freeze, Hint, and Shuffle.",
  "Protect the learner and complete the quiz.",
  "Pass the quiz to unlock the next level.",
];
type Mood = "" | "worried" | "scared" | "sad" | "happy";

type Run = {
  levelIndex: number;
  lives: number;
  matched: number;
  snakePos: number;
  maxPos: number;
  freeze: number;
  hint: number;
  shuffle: number;
  frozen: number;
  over: boolean;
  phase: Phase;
  shopFrom: "play" | "pause";
  settingsFrom: "play" | "pause";
  leaveFrom: Phase;
  quizIndex: number;
  quizBusy: boolean;
  quizPassed: boolean;
  hitCooldown: boolean;
  graceUntil: number;
  creepAcc: number;
  tickAt: number;
  coins: number;
  bestLevel: number;
  levelMark: number;
  boxOpenedFor: number;
  spinning: boolean;
  tiles: TileModel[];
  tileSeq: number;
  lifePop: boolean;
  mood: Mood;
  loseTitle: string;
  loseText: string;
  loseAmount: number;
  winTitle: string;
  winReward: string;
  winAmount: number;
  rewardText: string;
  rewardAmount: number;
  rewardType: string;
  rewardMiss: boolean;
  sceneW: number;
  sceneH: number;
  shopNote: string;
};

type Props = {
  school: School;
  character: Character;
  coins: number;
  lives: number;
  hint: number;
  shuffle: number;
  freeze: number;
  bestLevel: number;
  startLevel: number;
  onSync: (next: RunSnapshot) => void;
  onExit: () => void;
};

function snapshot(g: Run): RunSnapshot {
  return {
    coins: g.coins,
    lives: g.lives,
    hint: g.hint,
    shuffle: g.shuffle,
    freeze: g.freeze,
    bestLevel: g.bestLevel,
    levelId: g.levelMark,
  };
}

export function PlayScreen({ school, character, coins, lives, hint, shuffle, freeze, bestLevel, startLevel, onSync, onExit }: Props) {
  const run = useRef<Run | null>(null);
  const onSyncRef = useRef(onSync);
  const onExitRef = useRef(onExit);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [, setVersion] = useState(0);
  const [settings, setSettings] = useState<GameSettings>({ ...DEFAULT_SETTINGS });

  onSyncRef.current = onSync;
  onExitRef.current = onExit;

  if (run.current === null) {
    const g: Run = {
      levelIndex: 0,
      lives: Math.max(3, lives),
      matched: 0,
      snakePos: 0,
      maxPos: 12,
      freeze,
      hint,
      shuffle,
      frozen: 0,
      over: false,
      phase: "play",
      shopFrom: "play",
      settingsFrom: "play",
      leaveFrom: "play",
      quizIndex: 0,
      quizBusy: false,
      quizPassed: false,
      hitCooldown: false,
      graceUntil: 0,
      creepAcc: 0,
      tickAt: Date.now(),
      coins,
      bestLevel,
      levelMark: 1,
      boxOpenedFor: 0,
      spinning: false,
      tiles: [],
      tileSeq: 0,
      lifePop: false,
      mood: "",
      loseTitle: "",
      loseText: "",
      loseAmount: 0,
      winTitle: "",
      winReward: "",
      winAmount: 0,
      rewardText: "",
      rewardAmount: 0,
      rewardType: "none",
      rewardMiss: false,
      sceneW: 0,
      sceneH: 0,
      shopNote: "",
    };
    const track = TRACKS[school];
    const startIndex = Math.max(0, Math.min(track.length - 1, startLevel - 1));
    prepareLevel(g, school, startIndex, false);
    run.current = g;
  }

  const g = run.current;
  const refresh = () => setVersion((n) => n + 1);
  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  const publish = () => onSyncRef.current(snapshot(g));
  const levels = TRACKS[school];
  const level = levels[g.levelIndex];

  function loseLife() {
    if (g.hitCooldown || g.over) return;
    g.hitCooldown = true;
    g.lives -= 1;
    g.lifePop = true;
    g.mood = "sad";
    publish();
    if (g.lives <= 0) {
      playSfx("lose");
      g.over = true;
      g.coins = Math.max(0, g.coins - FAIL_PENALTY);
      g.loseTitle = "Out of lives";
      g.loseAmount = FAIL_PENALTY;
      g.loseText = "Those stars stay lost. Pass this level to earn a new reward.";
      g.phase = "lose";
      publish();
      refresh();
      return;
    }
    playSfx("hit");
    g.snakePos = Math.max(0, g.snakePos - 10);
    refresh();
    later(() => {
      g.hitCooldown = false;
      g.lifePop = false;
      if (g.mood === "sad") g.mood = "";
      refresh();
    }, 1400);
  }

  function maybeTouch() {
    if (g.over || g.hitCooldown || g.phase !== "play" || g.sceneW === 0) return;
    const progress = g.snakePos / g.maxPos;
    const head = boardPoint(g, progress);
    const learner = boardPoint(g, 1);
    const dist = Math.hypot(head.x - learner.x, head.y - learner.y);
    if (dist < 36 || g.snakePos >= g.maxPos) loseLife();
  }

  function openQuiz() {
    g.quizIndex = 0;
    g.quizBusy = false;
    g.quizPassed = false;
    g.phase = "quiz";
    g.mood = "happy";
    playSfx("quiz");
    refresh();
  }

  function unlockLevel() {
    g.quizPassed = true;
    g.bestLevel = Math.max(g.bestLevel, level.id);
    g.levelMark = Math.min(levels.length, g.levelIndex + 2);
    const reward = passReward(g.lives);
    g.coins += reward;
    g.winTitle = g.levelIndex >= levels.length - 1 ? "You win" : "Level clear";
    g.winAmount = reward;
    g.winReward = `+${reward} stars`;
    g.phase = "win";
    playSfx("win");
    publish();
    refresh();
  }

  function missQuiz() {
    g.quizPassed = false;
    g.coins = Math.max(0, g.coins - QUIZ_PENALTY);
    g.loseTitle = "Wrong answer";
    g.loseAmount = QUIZ_PENALTY;
    g.loseText = "The next level stays locked.";
    playSfx("lose");
    g.phase = "lose";
    publish();
    refresh();
  }

  function answerQuiz(index: number) {
    if (g.quizBusy || g.phase !== "quiz") return;
    g.quizBusy = true;
    const item = level.quiz[g.quizIndex];
    playSfx("click");
    refresh();
    later(() => {
      if (index === item.correct) {
        if (g.quizIndex < level.quiz.length - 1) {
          playSfx("quiz");
          g.quizIndex += 1;
          g.quizBusy = false;
          refresh();
        } else {
          unlockLevel();
        }
      } else {
        missQuiz();
      }
    }, 450);
  }

  function goToLevel(index: number, resetLives: boolean) {
    prepareLevel(g, school, index, resetLives);
    playSfx("start");
    publish();
    refresh();
  }

  function proceedAfterWin() {
    if (!g.quizPassed) return;
    if (level.id % 2 === 0 && g.boxOpenedFor !== level.id) {
      g.spinning = false;
      g.phase = "box";
      g.boxOpenedFor = level.id;
      refresh();
      return;
    }
    if (g.levelIndex >= levels.length - 1) {
      g.lives = Math.max(3, g.lives);
      g.boxOpenedFor = 0;
      goToLevel(0, false);
    } else {
      goToLevel(g.levelIndex + 1, false);
    }
  }

  function continueAfterReward() {
    if (g.levelIndex >= levels.length - 1) {
      g.lives = Math.max(3, g.lives);
      g.boxOpenedFor = 0;
      goToLevel(0, false);
    } else {
      goToLevel(g.levelIndex + 1, false);
    }
  }

  function applyWheel(slice: WheelSlice) {
    if (slice.type === "hint") g.hint += 1;
    else if (slice.type === "shuffle") g.shuffle += 1;
    else if (slice.type === "freeze") g.freeze += 1;
    else if (slice.type === "life") g.lives = Math.min(LIFE_CAP, g.lives + 1);
    else if (slice.type === "points") g.coins += slice.amount ?? 0;
    g.rewardAmount = slice.type === "points" ? slice.amount ?? 0 : 0;
    g.rewardMiss = slice.type === "none";
    g.rewardType = slice.type;
    g.rewardText = rewardLine(slice);
    g.phase = "reward";
    playSfx(slice.type === "none" ? "miss" : "reward");
    publish();
    refresh();
  }

  function openBox() {
    if (g.spinning) return;
    g.spinning = true;
    playSfx("click");
    refresh();
    const index = Math.floor(Math.random() * WHEEL.length);
    later(() => {
      g.spinning = false;
      applyWheel(WHEEL[index]);
    }, settings.reduceMotion ? 180 : 700);
  }

  function onTile(id: number) {
    if (g.over || g.phase !== "play" || g.hitCooldown) return;
    const tile = g.tiles.find((entry) => entry.id === id);
    if (!tile || tile.status === "gone" || tile.status === "correct") return;
    if (tile.good) {
      playSfx("correct");
      tile.status = "correct";
      g.matched += 1;
      g.snakePos = Math.max(0, g.snakePos - level.pull);
      later(() => {
        if (tile.status === "correct") tile.status = "gone";
        refresh();
      }, 280);
      if (g.matched >= level.need) {
        g.snakePos = Math.max(0, g.snakePos - 5);
        g.over = true;
        later(openQuiz, 350);
      }
    } else {
      tile.status = "wrong";
      const livesBefore = g.lives;
      g.snakePos = Math.min(g.maxPos, g.snakePos + level.push);
      later(() => {
        if (tile.status === "wrong") tile.status = "idle";
        refresh();
      }, 400);
      maybeTouch();
      if (g.lives === livesBefore) playSfx("wrong");
    }
    refresh();
  }

  function useFreeze() {
    if (g.freeze <= 0 || g.frozen > 0 || g.over || g.phase !== "play") return;
    g.freeze -= 1;
    g.frozen = 10;
    playSfx("freeze");
    publish();
    refresh();
  }

  function useHint() {
    if (g.hint <= 0 || g.over || g.phase !== "play") return;
    const tile = g.tiles.find((entry) => entry.good && entry.status === "idle");
    if (!tile) return;
    g.hint -= 1;
    tile.status = "hint";
    playSfx("hint");
    publish();
    later(() => {
      if (tile.status === "hint") tile.status = "idle";
      refresh();
    }, 1600);
    refresh();
  }

  function useShuffle() {
    if (g.shuffle <= 0 || g.over || g.phase !== "play") return;
    g.shuffle -= 1;
    playSfx("shuffle");
    const left = g.tiles.filter((tile) => tile.status !== "gone" && tile.status !== "correct");
    const gone = g.tiles.filter((tile) => tile.status === "gone" || tile.status === "correct");
    g.tiles = [...gone, ...shuffleItems(left)];
    publish();
    refresh();
  }

  function buy(id: (typeof SHOP)[number]["id"]) {
    const item = SHOP.find((entry) => entry.id === id);
    if (!item) return;
    const full = item.id === "life" ? g.lives >= LIFE_CAP : g[item.id] >= POWER_CAP;
    if (full) {
      playSfx("deny");
      g.shopNote = "That is full";
      refresh();
      return;
    }
    if (g.coins < item.price) {
      playSfx("deny");
      g.shopNote = "Not enough stars";
      refresh();
      return;
    }
    g.coins -= item.price;
    if (item.id === "life") g.lives += 1;
    if (item.id === "hint") g.hint += 1;
    if (item.id === "shuffle") g.shuffle += 1;
    if (item.id === "freeze") g.freeze += 1;
    g.shopNote = `You got ${item.name}`;
    playSfx("buy");
    publish();
    refresh();
  }

  function leave() {
    publish();
    onExitRef.current();
  }

  function requestLeave() {
    if (settings.confirmQuit && g.phase !== "confirm") {
      g.leaveFrom = g.phase;
      g.phase = "confirm";
      refresh();
      return;
    }
    leave();
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (g.phase !== "play" || g.over || g.hitCooldown) return;
      const now = Date.now();
      const elapsed = Math.min(250, now - g.tickAt);
      g.tickAt = now;
      if (now < g.graceUntil) return;
      if (g.frozen > 0) {
        g.frozen = Math.max(0, g.frozen - elapsed / 1000);
        refresh();
        return;
      }
      g.creepAcc += elapsed;
      const step = creepStepMs(school, level);
      let moved = false;
      while (g.creepAcc >= step && !g.over && !g.hitCooldown && g.phase === "play") {
        g.creepAcc -= step;
        g.snakePos = Math.min(g.maxPos, g.snakePos + 1);
        moved = true;
        maybeTouch();
      }
      if (moved) refresh();
    }, 100);
    return () => clearInterval(id);
  }, [school, g.levelIndex]);

  useEffect(() => {
    playSfx("start");
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    let active = true;
    loadSettings().then((saved) => {
      if (!active) return;
      setSettings(saved);
      applyAudioSettings(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  function patchSettings(partial: Partial<GameSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    void saveSettings(next);
    applyAudioSettings(next);
    unlockAudio();
    if (partial.sound) playSfx("buy");
    if (partial.vibration) pulse("tap");
  }

  function reading(base: number, line: number) {
    const scale = fontScale(settings.textSize);
    return {
      fontFamily: fontFace(settings.font),
      fontSize: Math.round(base * scale),
      lineHeight: Math.round(line * scale),
    };
  }

  function resume() {
    g.phase = "play";
    g.tickAt = Date.now();
    refresh();
  }

  const progress = g.maxPos ? g.snakePos / g.maxPos : 0;
  const mood: Mood =
    g.mood === "sad" || g.mood === "happy" ? g.mood : progress >= 0.78 ? "scared" : progress >= 0.5 ? "worried" : "";
  const heat = pressure(progress);
  const sentence = level.heading.includes(" ");
  const lastLevel = g.levelIndex >= levels.length - 1;
  const winAction = lastLevel ? "Play Again" : level.id % 2 === 0 ? "Mystery Box" : "Next Level";
  const learner = g.sceneW ? boardPoint(g, 1) : { x: 0, y: 0 };
  const learnerLeft = Math.max(8, Math.min(learner.x - 46, Math.max(8, g.sceneW - 100)));
  const visualGap = 0.0375;
  const bodySpan = (VISUAL_BEADS - 1) * visualGap;
  const headAt = bodySpan + progress * (1 - bodySpan);
  const trailMarks: number[] = [];
  if (g.sceneW > 0) {
    for (let t = headAt + 0.03; t <= 0.96; t += 0.036) trailMarks.push(Math.round(t * 1000) / 1000);
  }
  const quiz = level.quiz[g.quizIndex];

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Pressable style={styles.round} onPress={() => { playSfx("click"); g.phase = "pause"; refresh(); }}>
          <Text style={styles.roundText}>❚❚</Text>
        </Pressable>
        <Pressable
          style={styles.round}
          onPress={() => {
            g.settingsFrom = "play";
            g.phase = "settings";
            refresh();
          }}
        >
          <Text style={styles.roundText}>⚙</Text>
        </Pressable>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Lv {level.id}</Text>
        </View>
        <View style={[styles.pill, heat.tone === "hot" ? styles.hot : heat.tone === "warn" ? styles.warn : styles.safe]}>
          <Text style={[styles.pillText, heat.tone === "hot" ? styles.hotText : heat.tone === "warn" ? styles.warnText : styles.safeText]}>
            {heat.label}
          </Text>
        </View>
        <View style={styles.topSpacer} />
        <Pressable style={[styles.pill, styles.safe, styles.coinPill]} onPress={() => { g.shopFrom = "play"; g.shopNote = ""; g.phase = "shop"; refresh(); }}>
          <Star size={16} />
          <Text style={[styles.pillText, styles.safeText]}>{g.coins}</Text>
        </Pressable>
        <Pressable style={styles.round} onPress={requestLeave}>
          <Text style={styles.roundText}>←</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.scene,
          settings.bright && styles.sceneBright,
          settings.contrast && styles.sceneContrast,
          g.lifePop && styles.sceneHit,
        ]}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (width !== g.sceneW || height !== g.sceneH) {
            g.sceneW = width;
            g.sceneH = height;
            refresh();
          }
        }}
      >
        {!settings.reduceMotion && (
          <>
            <View style={[styles.glow, styles.glowViolet]} />
            <View style={[styles.glow, styles.glowPink]} />
            <View style={[styles.glow, styles.glowSky]} />
          </>
        )}
        {trailMarks.map((t) => {
          const point = boardPoint(g, t);
          const next = boardPoint(g, Math.min(1, t + 0.04));
          const turn = Math.atan2(next.y - point.y, next.x - point.x);
          return (
            <View
              key={t}
              style={[
                styles.dash,
                { left: point.x - 8, top: point.y - 4, transform: [{ rotate: `${turn}rad` }] },
              ]}
            />
          );
        })}
        {g.sceneW > 0 &&
          Array.from({ length: VISUAL_BEADS }, (_, index) => {
            const kind = SNAKE_KIND[school];
            const along = headAt - (VISUAL_BEADS - 1 - index) * visualGap;
            const point = boardPoint(g, along);
            const head = index === VISUAL_BEADS - 1;
            const size = head ? kind.headSize : kind.bodySize;
            return (
              <View
                key={index}
                style={[
                  styles.seg,
                  head && styles.segHead,
                  {
                    width: size,
                    height: size,
                    left: point.x - size / 2,
                    top: point.y - size / 2,
                    backgroundColor: head ? "transparent" : kind.body[index % kind.body.length],
                    zIndex: 2 + index,
                  },
                ]}
              >
                {head ? <SnakeFace size={size} /> : <View style={styles.shine} />}
              </View>
            );
          })}
        {g.sceneW > 0 && (
          <View style={[styles.goal, { left: learner.x - 14, top: learner.y - 14 }]} />
        )}
        {g.sceneW > 0 && (
          <View style={[styles.learner, { left: learnerLeft, top: 0, width: 92 }]}>
            <View style={styles.heartRow}>
              {Array.from({ length: Math.max(3, Math.min(6, g.lives)) }, (_, index) => (
                <ShinyHeart key={index} size={22} lit={index < g.lives} />
              ))}
            </View>
            <Learner mood={mood} who={character} size={88} />
          </View>
        )}
        {g.frozen > 0 && (
          <View style={styles.frozen}>
            <Text style={styles.frozenText}>FROZEN</Text>
          </View>
        )}
        {g.lifePop && <Text style={styles.lifePop}>-1 LIFE</Text>}
      </View>

      <View style={styles.category}>
        <View style={styles.categoryCopy}>
          {!sentence && <Text style={styles.categoryKicker}>Tap words about</Text>}
          <Text style={[styles.heading, sentence && styles.sentence, reading(sentence ? 16 : 18, sentence ? 21 : 24)]}>{level.heading}</Text>
        </View>
        <Text style={styles.count}>
          {g.matched}/{level.need}
        </Text>
      </View>

      <ScrollView style={styles.tileScroll} contentContainerStyle={styles.tiles} showsVerticalScrollIndicator={false}>
        {g.tiles.map((tile) => (
          <Pressable
            key={tile.id}
            onPress={() => onTile(tile.id)}
            style={[
              styles.tile,
              { backgroundColor: tile.color },
              settings.textSize === "large" && styles.tileLarge,
              settings.contrast && styles.tileContrast,
              tile.status === "gone" && styles.tileGone,
              tile.status === "hint" && styles.tileHint,
              tile.status === "wrong" && styles.tileWrong,
            ]}
          >
            <Text style={[styles.tileText, reading(15, 20)]}>{tile.text}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.powers}>
        <Power name="Hint" tint="#fff6cc" rim="#e2a400" count={g.hint} disabled={g.hint <= 0} onPress={useHint} mark={<BulbIcon color="#e2a400" />} />
        <Power name="Freeze" tint="#e7f6ff" rim="#1686d4" count={g.freeze} disabled={g.freeze <= 0 || g.frozen > 0} onPress={useFreeze} mark={<SnowflakeIcon color="#1686d4" />} />
        <Power name="Shuffle" tint="#ffe8f7" rim="#ff3ec4" count={g.shuffle} disabled={g.shuffle <= 0} onPress={useShuffle} mark={<ShuffleIcon color="#ff3ec4" />} />
      </View>

      {g.phase === "pause" && (
        <Overlay>
          <Text style={styles.pauseTitle}>Paused</Text>
          <View style={styles.pauseBadge}>
            <Text style={styles.pauseBadgeText}>❚❚</Text>
          </View>
          <ModalButton label="Resume" onPress={resume} />
          <ModalButton label="Shop" soft onPress={() => { g.shopFrom = "pause"; g.shopNote = ""; g.phase = "shop"; refresh(); }} />
          <ModalButton label="Settings" soft onPress={() => { g.settingsFrom = "pause"; g.phase = "settings"; refresh(); }} />
          <ModalButton label="How to Play" soft onPress={() => { g.phase = "howto"; refresh(); }} />
          <ModalButton label="Quit" soft onPress={requestLeave} />
        </Overlay>
      )}

      {g.phase === "shop" && (
        <Overlay>
          <Text style={styles.pauseTitle}>Shop</Text>
          <StarAmount amount={g.coins} color={colors.white} size={26} textSize={28} style={styles.balance} />
          {SHOP.map((item) => (
            <Pressable key={item.id} style={styles.shopRow} onPress={() => buy(item.id)}>
              <View style={[styles.shopBadge, { backgroundColor: item.tint }]}>
                <ItemMark id={item.id} />
              </View>
              <Text style={styles.shopName}>{item.name}</Text>
              <View style={styles.price}>
                <Star size={16} />
                <Text style={styles.shopPrice}>{item.price}</Text>
              </View>
            </Pressable>
          ))}
          <Text style={styles.note}>{g.shopNote}</Text>
          <ModalButton
            label="Close"
            onPress={() => {
              g.phase = g.shopFrom === "pause" ? "pause" : "play";
              g.tickAt = Date.now();
              refresh();
            }}
          />
        </Overlay>
      )}

      {g.phase === "settings" && (
        <Overlay start>
          <Text style={[styles.kicker, styles.center]}>OPTIONS</Text>
          <Text style={styles.modalTitle}>Settings</Text>
          <SettingsPanel settings={settings} onChange={patchSettings} />
          <ModalButton
            label="Back"
            onPress={() => {
              g.phase = g.settingsFrom === "pause" ? "pause" : "play";
              g.tickAt = Date.now();
              refresh();
            }}
          />
        </Overlay>
      )}

      {g.phase === "howto" && (
        <Overlay start>
          <Text style={[styles.kicker, styles.center]}>SNAKE AWAY</Text>
          <Text style={styles.modalTitle}>How to Play</Text>
          {HOW_TO_PLAY.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNum}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          <ModalButton label="Start Playing" onPress={resume} />
        </Overlay>
      )}

      {g.phase === "quiz" && quiz && (
        <Overlay>
          <BrandMark width={36} style={styles.brand} />
          <Text style={styles.saved}>Learner saved</Text>
          <Text style={styles.modalTitle}>Quiz</Text>
          <Text style={styles.quizProgress}>
            Q {g.quizIndex + 1}/{level.quiz.length}
          </Text>
          <Text style={[styles.question, reading(20, 26)]}>{quiz.q}</Text>
          {quiz.options.map((option, index) => (
            <Pressable key={option} style={styles.answer} disabled={g.quizBusy} onPress={() => answerQuiz(index)}>
              <Text style={[styles.answerText, reading(16, 22)]}>{option}</Text>
            </Pressable>
          ))}
        </Overlay>
      )}

      {g.phase === "win" && (
        <Overlay>
          <Image
            source={require("../../assets/level-clear.png")}
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            style={styles.clearArt}
          />
          <Text style={styles.modalTitle}>{g.winTitle}</Text>
          <View style={styles.coinPillCard}>
            <StarAmount amount={`+${g.winAmount} stars`} color={colors.lime} size={22} textSize={18} />
          </View>
          <ModalButton label={winAction} onPress={proceedAfterWin} />
        </Overlay>
      )}

      {g.phase === "box" && (
        <Overlay>
          <Text style={styles.pauseTitle}>Mystery box</Text>
          <MysteryBox opening={g.spinning} />
          <ModalButton label={g.spinning ? "Opening" : "Open"} onPress={openBox} />
        </Overlay>
      )}

      {g.phase === "reward" && (
        <Overlay>
          {g.rewardMiss ? (
            <View style={styles.missBadge}>
              <NothingIcon color="#fff" />
            </View>
          ) : (
            <Celebration />
          )}
          <Text style={styles.pauseTitle}>{g.rewardMiss ? "Oops" : "Congratulations"}</Text>
          {!g.rewardMiss && (
            <View style={styles.prizeBadge}>
              {g.rewardType === "points" ? <Star size={28} /> : <PrizeGlyph type={g.rewardType} ink="#1a1048" />}
            </View>
          )}
          {g.rewardAmount > 0 ? (
            <View style={styles.coinPillCard}>
              <StarAmount amount={`${g.rewardAmount}`} color={colors.lime} size={22} textSize={18} />
            </View>
          ) : null}
          <Text style={styles.modalTitle}>{g.rewardAmount > 0 ? `You got ${g.rewardAmount} stars!` : g.rewardText}</Text>
          <ModalButton label="Continue" onPress={continueAfterReward} />
        </Overlay>
      )}

      {g.phase === "confirm" && (
        <Overlay>
          <Text style={styles.modalTitle}>Leave game?</Text>
          <Text style={styles.body}>This level will stop.</Text>
          <View style={styles.keepRow}>
            <Star size={16} />
            <Text style={styles.keepText}>Your stars stay saved.</Text>
          </View>
          <ModalButton
            label="Stay"
            onPress={() => {
              g.phase = g.leaveFrom === "confirm" ? "play" : g.leaveFrom;
              if (g.phase === "play") g.tickAt = Date.now();
              refresh();
            }}
          />
          <ModalButton label="Leave" soft onPress={leave} />
        </Overlay>
      )}

      {g.phase === "lose" && (
        <Overlay>
          <Text style={styles.locked}>LOCKED</Text>
          <Text style={styles.modalTitle}>{g.loseTitle}</Text>
          {g.loseAmount > 0 && <StarAmount amount={`-${g.loseAmount}`} color="#ff8fa3" size={22} textSize={20} style={styles.balance} />}
          <Text style={styles.body}>{g.loseText}</Text>
          <ModalButton label="Retry level" onPress={() => goToLevel(g.levelIndex, true)} />
          <ModalButton label="Menu" soft onPress={requestLeave} />
        </Overlay>
      )}
    </View>
  );
}

function MysteryBox({ opening }: { opening: boolean }) {
  return (
    <Image
      source={require("../../assets/mystery-box.png")}
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      style={[styles.boxArt, opening && styles.boxArtOpen]}
    />
  );
}

function boardPoint(g: Run, t: number) {
  const padX = 26;
  const padY = 16;
  const point = samplePath(t, Math.max(1, g.sceneW - padX * 2), Math.max(1, g.sceneH - padY * 2));
  return { x: point.x + padX, y: point.y + padY };
}

function prepareLevel(g: Run, school: School, index: number, resetLives: boolean) {
  const level = TRACKS[school][index];
  g.levelIndex = index;
  if (resetLives) g.lives = 3;
  g.matched = 0;
  g.maxPos = level.maxPos;
  g.snakePos = level.startAdvance;
  g.levelMark = index + 1;
  g.graceUntil = Date.now() + GRACE_MS;
  g.creepAcc = 0;
  g.tickAt = Date.now();
  g.frozen = 0;
  g.over = false;
  g.hitCooldown = false;
  g.lifePop = false;
  g.mood = "";
  g.quizBusy = false;
  g.phase = "play";
  g.tiles = dealTiles(level, () => {
    g.tileSeq += 1;
    return g.tileSeq;
  });
}

function Power({
  name,
  mark,
  tint,
  rim = "#ffffff",
  count,
  disabled,
  onPress,
}: {
  name: string;
  mark: ReactNode;
  tint: string;
  rim?: string;
  count: number;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.powerWrap, disabled && styles.powerOff]} disabled={disabled} onPress={onPress}>
      <View style={styles.powerSlot}>
        <View style={[styles.power, { backgroundColor: tint, borderColor: rim }]}>
          <View style={styles.powerGloss} />
          {mark}
        </View>
        <Text style={styles.bubble}>{count}</Text>
      </View>
      <Text style={styles.powerName}>{name}</Text>
    </Pressable>
  );
}

function Celebration() {
  const bits = [
    { color: "#ff6ad5", left: 6, top: 8 },
    { color: "#e8ff6a", left: 36, top: 0 },
    { color: "#38b6ff", left: 118, top: 6 },
    { color: "#7b5cff", left: 86, top: 0 },
    { color: "#e8ff6a", left: 12, top: 78 },
    { color: "#ff6ad5", left: 112, top: 74 },
    { color: "#ffe14a", left: 64, top: 4 },
    { color: "#38b6ff", left: 20, top: 40 },
  ];
  return (
    <View style={styles.burst}>
      {bits.map((bit, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            left: bit.left,
            top: bit.top,
            width: 8,
            height: 18,
            borderRadius: 4,
            backgroundColor: bit.color,
            transform: [{ rotate: `${index * 28}deg` }],
          }}
        />
      ))}
      <View style={styles.starCore}>
        <View style={styles.starPoint} />
        <View style={[styles.starPoint, styles.starPointTurn]} />
        <View style={styles.starHeart} />
      </View>
    </View>
  );
}

function Overlay({ children, start }: { children: ReactNode; start?: boolean }) {
  return (
    <View style={styles.overlay}>
      <View style={[styles.float, styles.floatViolet]} />
      <View style={[styles.float, styles.floatPink]} />
      <View style={[styles.float, styles.floatSky]} />
      <View style={[styles.float, styles.floatLime]} />
      <ScrollView style={styles.overlayScroll} contentContainerStyle={[styles.modalWrap, start && styles.modalWrapStart]} bounces={false}>
        <View style={styles.modal}>{children}</View>
      </ScrollView>
    </View>
  );
}

function ModalButton({ label, onPress, soft }: { label: string; onPress: () => void; soft?: boolean }) {
  return (
    <GameButton
      label={label}
      soft={soft}
      onPress={() => {
        playSfx("click");
        onPress();
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 12, paddingTop: 18 },
  top: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  topSpacer: { flex: 1 },
  round: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "#241556",
    alignItems: "center",
    justifyContent: "center",
  },
  roundText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  pill: {
    backgroundColor: "#241556",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
  },
  pillText: { color: colors.white, fontWeight: "800", fontSize: 14 },
  coinPill: { flexDirection: "row", alignItems: "center", gap: 6 },
  safe: { backgroundColor: colors.lime, borderColor: "#c7da30" },
  warn: { backgroundColor: "#ffd79a", borderColor: "#e0b56a" },
  hot: { backgroundColor: "#ff8fa3", borderColor: "#ff4d6d" },
  safeText: { color: "#1a1048" },
  warnText: { color: "#1a1048" },
  hotText: { color: "#1a1048" },
  scene: {
    height: 272,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#1a1048",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 8,
  },
  glow: { position: "absolute", borderRadius: 999 },
  glowViolet: { width: 160, height: 160, top: -30, left: "30%", backgroundColor: "rgba(123,92,255,0.55)" },
  glowPink: { width: 110, height: 110, top: 8, right: -10, backgroundColor: "rgba(255,106,213,0.38)" },
  glowSky: { width: 90, height: 90, bottom: -10, left: -8, backgroundColor: "rgba(56,182,255,0.32)" },
  sceneHit: { borderColor: "#ff4d6d" },
  sceneBright: { backgroundColor: "#3d2d86" },
  sceneContrast: { borderColor: "#ffffff", borderWidth: 3 },
  dash: {
    position: "absolute",
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ade80",
    borderWidth: 2,
    borderColor: "#168a3a",
    zIndex: 1,
  },
  goal: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: "#4ade80",
    backgroundColor: "rgba(74,222,128,0.2)",
    zIndex: 3,
  },
  seg: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  segHead: { borderWidth: 0, backgroundColor: "transparent" },
  belly: {},
  eyes: { flexDirection: "row", gap: 8 },
  eye: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#243249" },
  eyesSoft: { flexDirection: "row", gap: 10 },
  eyeSoft: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#1d3a22", borderWidth: 2, borderColor: "#f4fff0" },
  eyesSharp: { flexDirection: "row", gap: 6 },
  eyeSharp: { width: 8, height: 4, borderRadius: 2, backgroundColor: "#2a1a10", borderWidth: 1, borderColor: "#fff6e0" },
  shine: {
    position: "absolute",
    top: 4,
    left: 6,
    width: 8,
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  smile: {
    marginTop: 2,
    width: 12,
    height: 6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#243249",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  learner: { position: "absolute", zIndex: 20, width: 108, alignItems: "center" },
  heartRow: { flexDirection: "row", gap: 4, marginBottom: 2 },
  heart: { color: "#ff3d68", fontSize: 22, fontWeight: "800" },
  heartEmpty: { color: "#e4b8c8" },
  frozen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(180,230,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
  frozenText: { color: "#0b6ebd", fontWeight: "800", letterSpacing: 2 },
  lifePop: {
    position: "absolute",
    top: "42%",
    alignSelf: "center",
    zIndex: 10,
    color: "#ff4d6d",
    fontWeight: "800",
    fontSize: 22,
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.35)",
    borderRadius: 22,
    padding: 10,
    marginBottom: 8,
    gap: 10,
  },
  categoryCopy: { flex: 1 },
  kicker: { color: "#ffc2ec", letterSpacing: 1.4, fontWeight: "800", fontSize: 12 },
  brand: { alignSelf: "center", marginBottom: 6 },
  center: { textAlign: "center" },
  heading: { color: colors.white, fontWeight: "800", fontSize: 18 },
  categoryKicker: { color: "#ffc2ec", letterSpacing: 1.2, fontWeight: "800", fontSize: 12 },
  largeHeading: { fontSize: 24, lineHeight: 30 },
  sentence: { fontSize: 16, fontWeight: "700", lineHeight: 21 },
  count: {
    backgroundColor: colors.pink,
    color: colors.white,
    fontWeight: "800",
    borderRadius: 999,
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: "#c2188b",
  },
  tileScroll: { flex: 1, minHeight: 168 },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingBottom: 8 },
  tile: {
    width: "48%",
    flexGrow: 1,
    maxWidth: "48%",
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.95)",
    borderBottomWidth: 5,
    borderBottomColor: "rgba(26,16,72,0.28)",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  tileLarge: { minHeight: 84 },
  tileContrast: { borderColor: "#ffffff", borderWidth: 4 },
  tileText: { color: colors.white, fontWeight: "800", fontSize: 15, textAlign: "center" },
  tileTextLarge: { fontSize: 18, lineHeight: 22 },
  tileGone: { opacity: 0 },
  tileHint: { borderColor: colors.lime },
  tileWrong: { opacity: 0.55 },
  powers: { flexDirection: "row", justifyContent: "center", gap: 22, paddingTop: 4, paddingBottom: 4 },
  powerWrap: { alignItems: "center", width: 78 },
  powerSlot: { width: 68, height: 68 },
  power: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  powerGloss: {
    position: "absolute",
    top: 8,
    left: 16,
    width: 16,
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  powerOff: { opacity: 0.4 },
  powerIcon: { color: "#1a1048", fontSize: 26, fontWeight: "800" },
  powerName: { color: colors.white, fontWeight: "800", fontSize: 13, marginTop: 4 },
  bubble: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.lime,
    color: "#1a1048",
    fontWeight: "800",
    fontSize: 12,
    minWidth: 18,
    textAlign: "center",
    borderRadius: 9,
    overflow: "hidden",
    paddingHorizontal: 4,
  },
  overlayScroll: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 16,
  },
  modalWrap: { flexGrow: 1, justifyContent: "center" },
  modalWrapStart: { justifyContent: "flex-start", paddingVertical: 28 },
  modal: {
    backgroundColor: "#160d36",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.35)",
    padding: 18,
    shadowColor: "#ff6ad5",
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalTitle: { color: colors.white, fontSize: 30, fontWeight: "800", textAlign: "center", marginVertical: 8 },
  pauseTitle: { color: colors.white, fontSize: 40, fontWeight: "800", textAlign: "center" },
  pauseBadge: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  pauseBadgeText: { color: colors.lime, fontWeight: "800", fontSize: 22 },
  clearArt: { width: 260, height: 244, alignSelf: "center", marginBottom: 8, backgroundColor: "transparent" },
  coinPillCard: {
    alignSelf: "center",
    backgroundColor: "#241556",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(232,255,106,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  burst: { height: 108, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  starCore: { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  starPoint: { position: "absolute", width: 28, height: 28, borderRadius: 6, backgroundColor: "#ffe14a" },
  starPointTurn: { transform: [{ rotate: "45deg" }], backgroundColor: "#ff6ad5" },
  starHeart: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff" },
  missBadge: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3a245f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  prizeBadge: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  float: { position: "absolute", borderRadius: 999 },
  floatViolet: { width: 200, height: 200, top: -60, left: -70, backgroundColor: "rgba(123,92,255,0.45)" },
  floatPink: { width: 150, height: 150, top: 30, right: -60, backgroundColor: "rgba(255,106,213,0.32)" },
  floatSky: { width: 170, height: 170, bottom: -40, left: -50, backgroundColor: "rgba(56,182,255,0.28)" },
  floatLime: { width: 90, height: 90, bottom: 80, right: 16, backgroundColor: "rgba(232,255,106,0.2)" },
  saved: { color: colors.lime, fontWeight: "800", textAlign: "center", letterSpacing: 1 },
  locked: { color: "#ff8fa3", fontWeight: "800", textAlign: "center", letterSpacing: 1 },
  reward: { color: colors.lime, fontWeight: "800", textAlign: "center", fontSize: 18, marginBottom: 12 },
  body: { color: colors.muted, textAlign: "center", lineHeight: 22, marginBottom: 12 },
  btn: { backgroundColor: colors.pink, borderRadius: 999, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  btnSoft: { backgroundColor: "transparent", borderWidth: 2, borderColor: "rgba(255,255,255,0.2)" },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 18 },
  quizProgress: { color: colors.sky, fontWeight: "800", textAlign: "center" },
  question: { color: colors.white, fontWeight: "800", fontSize: 20, textAlign: "center", marginVertical: 12 },
  largeQuestion: { fontSize: 24, lineHeight: 30 },
  answer: {
    backgroundColor: "#241556",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.4)",
    borderBottomWidth: 4,
    borderBottomColor: "#120a32",
    padding: 14,
    marginBottom: 8,
  },
  answerText: { color: colors.white, fontWeight: "800", textAlign: "center" },
  largeAnswer: { fontSize: 18, lineHeight: 24 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.28)",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 12,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.lime,
    color: "#1a1048",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 32,
  },
  stepText: { flex: 1, color: colors.white, fontWeight: "700", fontSize: 15, lineHeight: 20 },
  settingSection: {
    color: "#ffc2ec",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.6,
    marginTop: 8,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 10,
  },
  settingIcon: { fontSize: 22, width: 32 },
  settingLabel: { flex: 1, color: colors.white, fontWeight: "800", fontSize: 16 },
  settingState: { fontWeight: "800", fontSize: 13, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: "hidden" },
  settingOn: { backgroundColor: "rgba(232,255,106,0.2)", color: colors.lime },
  settingOff: { backgroundColor: "rgba(255,255,255,0.08)", color: colors.muted },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  shopBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  shopIcon: { color: "#1a1048", fontSize: 18, fontWeight: "800" },
  shopName: { flex: 1, color: colors.white, fontWeight: "800", fontSize: 18 },
  shopPrice: { color: colors.lime, fontWeight: "800" },
  price: { flexDirection: "row", alignItems: "center", gap: 4 },
  balance: { alignSelf: "center", marginBottom: 12 },
  keepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
  keepText: { color: colors.muted, fontWeight: "700" },
  note: { minHeight: 22, color: colors.lime, fontWeight: "800", textAlign: "center" },
  boxArt: { width: 250, height: 314, alignSelf: "center" },
  boxArtOpen: { transform: [{ scale: 1.04 }] },
});
