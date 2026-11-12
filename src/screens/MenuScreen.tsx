import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { applyAudioSettings, playSfx } from "../audio";
import { PASS_BASE, PASS_PER_LIFE, WHEEL } from "../game/content";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Character, type GameSettings, type School } from "../storage";
import { colors } from "../theme";
import { Star, StarAmount } from "../ui/Star";
import { GameButton } from "../ui/GameButton";
import { BrandMark } from "../ui/BrandMark";
import { SettingsPanel } from "../ui/SettingsPanel";
import { Learner } from "../ui/Learner";
import { ItemMark, NothingIcon, ShinyHeart } from "../ui/ShineIcons";
import { SnakeFace, StageFrame } from "../ui/SnakeMark";

type Props = {
  school: School;
  character: Character;
  coins: number;
  lives: number;
  level: number;
  onPlay: () => void;
  onShop: () => void;
  onChangeSchool: () => void;
};

type Panel = "settings" | "instructions" | "rewards";

const INSTRUCTIONS = [
  "Read the situation.",
  "Watch the snake approach.",
  "Select the correct harm words and safe responses.",
  "Correct answers push the snake back.",
  "Wrong answers let the snake move closer.",
  "Use power-ups: Freeze, Hint, and Shuffle.",
  "Protect the learner and complete the quiz.",
  "Pass the quiz to unlock the next level.",
];

const BEADS = ["#22d3ee", "#7b5cff", "#7dff6a", "#ff8a3d", "#ffe14a", "#ff6ad5"];

function Companion() {
  const spots = [
    { x: 0, y: 48, s: 16 },
    { x: 16, y: 52, s: 18 },
    { x: 34, y: 40, s: 20 },
    { x: 50, y: 26, s: 20 },
  ];
  return (
    <View style={styles.snake}>
      {spots.map((spot, index) => (
        <View
          key={spot.x}
          style={[
            styles.bead,
            {
              left: spot.x,
              top: spot.y,
              width: spot.s,
              height: spot.s,
              borderRadius: spot.s / 2,
              backgroundColor: BEADS[index],
              zIndex: index,
            },
          ]}
        >
          <View style={styles.beadShine} />
        </View>
      ))}
      <View style={styles.snakeHead}>
        <SnakeFace size={40} />
      </View>
    </View>
  );
}

function GearIcon() {
  return (
    <View style={styles.gear}>
      {[0, 45, 90, 135].map((turn) => (
        <View key={turn} style={[styles.gearTooth, { transform: [{ rotate: `${turn}deg` }] }]} />
      ))}
      <View style={styles.gearHole} />
    </View>
  );
}

function ListIcon() {
  return (
    <View style={styles.list}>
      {[14, 14, 9].map((width, index) => (
        <View key={width + index} style={styles.listRow}>
          <View style={styles.listDot} />
          <View style={[styles.listLine, { width }]} />
        </View>
      ))}
    </View>
  );
}

function GiftIcon() {
  return (
    <View style={styles.gift}>
      <View style={styles.giftLid} />
      <View style={styles.giftBox}>
        <View style={styles.giftBand} />
      </View>
    </View>
  );
}

function prizeKey(type: string, amount?: number) {
  return type === "points" ? `points-${amount}` : type;
}

function prizePlate(type: string) {
  if (type === "life") return "#fff0f3";
  if (type === "hint") return "#fff6cc";
  if (type === "shuffle") return "#ffe8f7";
  if (type === "freeze") return "#e7f6ff";
  if (type === "points") return "#f4ffd4";
  return "#f3f1fb";
}

function prizeLine(type: string, amount?: number) {
  if (type === "points") return `${amount} stars`;
  if (type === "life") return "An extra life";
  if (type === "hint") return "A hint";
  if (type === "shuffle") return "A shuffle";
  if (type === "freeze") return "A freeze";
  return "No prize this spin";
}

export function MenuScreen({ character, coins, lives, level, onPlay, onShop, onChangeSchool }: Props) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [settings, setSettings] = useState<GameSettings>({ ...DEFAULT_SETTINGS });
  const prizes = WHEEL.filter((slice, index) => WHEEL.findIndex((item) => prizeKey(item.type, item.amount) === prizeKey(slice.type, slice.amount)) === index);

  useEffect(() => {
    void loadSettings().then(setSettings);
  }, []);

  function openPanel(next: Panel) {
    playSfx("click");
    setPanel(next);
  }

  function patchSettings(partial: Partial<GameSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    void saveSettings(next);
    applyAudioSettings(next);
    playSfx("click");
  }

  return (
    <StageFrame>
      <View style={styles.wrap}>
        <View style={styles.top}>
          <BrandMark width={28} />
          <View style={styles.chips}>
            <View style={styles.lifeChip}>
              <ShinyHeart size={18} />
              <Text style={styles.lifeCount}>{lives}</Text>
            </View>
            <View style={styles.coinChip}>
              <StarAmount amount={coins} color={colors.lime} size={20} textSize={16} />
            </View>
          </View>
        </View>

        <View style={styles.stage}>
          <View style={styles.curtainL} />
          <View style={styles.curtainR} />
          <View style={styles.island}>
          <View style={styles.window}>
            <View style={styles.windowCore} />
          </View>
          <View style={styles.floor} />
          <View style={styles.rug} />

          <View style={styles.heartA} pointerEvents="none">
            <ShinyHeart size={22} />
          </View>
          <View style={styles.heartB} pointerEvents="none">
            <ShinyHeart size={14} />
          </View>
          <View style={[styles.spark, styles.sparkA]} pointerEvents="none" />
          <View style={[styles.spark, styles.sparkB]} pointerEvents="none" />
          <View style={[styles.spark, styles.sparkC]} pointerEvents="none" />
          <View style={[styles.floatBead, styles.floatBeadA]} pointerEvents="none" />
          <View style={[styles.floatBead, styles.floatBeadB]} pointerEvents="none" />

          <View style={styles.companion} pointerEvents="none">
            <Companion />
          </View>
          <View style={styles.learner} pointerEvents="none">
            <Learner mood="happy" who={character} size={112} />
          </View>

          <Pressable style={[styles.hub, styles.hubLeft, styles.hubHigh]} onPress={onShop} accessibilityRole="button">
            <View style={styles.bubbleShop}>
              <Star size={26} />
            </View>
            <Text style={styles.sideLabel}>Shop</Text>
          </Pressable>
          <Pressable style={[styles.hub, styles.hubLeft, styles.hubMid]} onPress={() => openPanel("settings")} accessibilityRole="button">
            <View style={styles.bubbleSky}>
              <GearIcon />
            </View>
            <Text style={styles.sideLabel}>Settings</Text>
          </Pressable>
          <Pressable style={[styles.hub, styles.hubLeft, styles.hubLow]} onPress={() => openPanel("instructions")} accessibilityRole="button">
            <View style={styles.bubbleViolet}>
              <ListIcon />
            </View>
            <Text style={styles.sideLabel}>Instructions</Text>
          </Pressable>
          <Pressable style={[styles.hub, styles.hubRight, styles.hubHigh]} onPress={() => openPanel("rewards")} accessibilityRole="button">
            <View style={styles.bubbleLime}>
              <GiftIcon />
            </View>
            <Text style={styles.sideLabel}>Rewards</Text>
          </Pressable>
          <Pressable style={[styles.hub, styles.hubRight, styles.hubMid]} onPress={onChangeSchool} accessibilityRole="button">
            <View style={styles.bubbleSchool}>
              <View style={styles.roof} />
              <View style={styles.house}>
                <View style={styles.door} />
              </View>
            </View>
            <Text style={styles.sideLabel}>School level</Text>
          </Pressable>
          </View>
        </View>

        <GameButton large label={`Level ${level}`} onPress={onPlay} />
      </View>
      {panel && (
        <View style={styles.overlay}>
          <ScrollView style={styles.overlayScroll} contentContainerStyle={styles.sheetWrap} bounces={false}>
            <View style={styles.sheet}>
              {panel === "settings" && (
                <>
                  <Text style={styles.sheetKicker}>OPTIONS</Text>
                  <Text style={styles.sheetTitle}>Settings</Text>
                  <SettingsPanel settings={settings} onChange={patchSettings} />
                </>
              )}
              {panel === "instructions" && (
                <>
                  <Text style={styles.sheetKicker}>HOW TO PLAY</Text>
                  <Text style={styles.sheetTitle}>Instructions</Text>
                  {INSTRUCTIONS.map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                      <Text style={styles.stepNum}>{index + 1}</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </>
              )}
              {panel === "rewards" && (
                <>
                  <Text style={styles.sheetKicker}>PRIZES</Text>
                  <Text style={styles.sheetTitle}>Rewards</Text>
                  <View style={styles.prizeRow}>
                    <Star size={22} />
                    <View style={styles.prizeCopy}>
                      <Text style={styles.prizeName}>Level clear</Text>
                      <Text style={styles.prizeDetail}>
                        {PASS_BASE} stars, plus {PASS_PER_LIFE} for each life you keep
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sheetSection}>MYSTERY BOX</Text>
                  <Image
                    source={require("../../assets/mystery-box.png")}
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    style={styles.boxArt}
                  />
                  {prizes.map((slice) => (
                    <View key={prizeKey(slice.type, slice.amount)} style={styles.prizeRow}>
                      <View style={[styles.prizeMark, { backgroundColor: prizePlate(slice.type) }]}>
                        {slice.type === "points" ? (
                          <Text style={[styles.prizeGlyph, { color: "#3d4a08" }]}>{slice.amount}</Text>
                        ) : slice.type === "none" ? (
                          <NothingIcon color="#3a245f" />
                        ) : (
                          <ItemMark id={slice.type} />
                        )}
                      </View>
                      <View style={styles.prizeCopy}>
                        <Text style={styles.prizeName}>{slice.type === "points" ? "Stars" : slice.label}</Text>
                        <Text style={styles.prizeDetail}>{prizeLine(slice.type, slice.amount)}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
              <GameButton label="Back" onPress={() => { playSfx("click"); setPanel(null); }} />
            </View>
          </ScrollView>
        </View>
      )}
    </StageFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  chips: { flexDirection: "row", alignItems: "center", gap: 8 },
  lifeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#241556",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  lifeCount: { color: colors.white, fontWeight: "800", fontSize: 16 },
  coinChip: {
    backgroundColor: colors.panel,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(246,196,69,0.45)",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  stage: {
    flex: 1,
    minHeight: 340,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#120a32",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 4,
    justifyContent: "center",
  },
  island: { height: 460, width: "100%" },
  curtainL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 34,
    height: "72%",
    backgroundColor: "rgba(255,106,213,0.55)",
    borderBottomRightRadius: 18,
  },
  curtainR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 34,
    height: "72%",
    backgroundColor: "rgba(123,92,255,0.7)",
    borderBottomLeftRadius: 18,
  },
  window: {
    position: "absolute",
    top: 18,
    left: "50%",
    marginLeft: -54,
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#243e88",
    borderWidth: 6,
    borderColor: "#7b5cff",
    alignItems: "center",
    justifyContent: "center",
  },
  windowCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lime,
  },
  floor: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 18,
    height: 54,
    borderRadius: 40,
    backgroundColor: "#0c0724",
  },
  rug: {
    position: "absolute",
    left: "50%",
    marginLeft: -110,
    bottom: 18,
    width: 220,
    height: 28,
    borderRadius: 40,
    backgroundColor: "#3a2288",
    borderWidth: 4,
    borderColor: colors.pink,
  },
  heartA: { position: "absolute", top: 22, left: 86 },
  heartB: { position: "absolute", top: 128, right: 78 },
  spark: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  sparkA: { top: 46, right: 64, backgroundColor: colors.lime },
  sparkB: { top: 150, left: 56, backgroundColor: colors.sky },
  sparkC: { bottom: 118, right: 48, backgroundColor: colors.pink },
  floatBead: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  floatBeadA: { top: 78, left: 78, backgroundColor: colors.sky },
  floatBeadB: { bottom: 108, right: 86, backgroundColor: colors.lime },
  companion: { position: "absolute", left: 8, bottom: 16, zIndex: 3 },
  learner: { position: "absolute", left: "50%", marginLeft: -56, bottom: 18, zIndex: 4 },
  snake: { width: 130, height: 78 },
  bead: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.95)",
  },
  beadShine: {
    position: "absolute",
    top: 3,
    left: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  snakeHead: {
    position: "absolute",
    left: 64,
    top: 0,
    width: 40,
    height: 40,
    zIndex: 6,
  },
  snakeEyes: { flexDirection: "row", gap: 5 },
  snakeEye: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#243249" },
  snakeCatch: { width: 2, height: 2, borderRadius: 1, marginTop: 1, marginLeft: 3, backgroundColor: "#fff" },
  hub: { position: "absolute", alignItems: "center", zIndex: 6, width: 92 },
  hubLeft: { left: 4 },
  hubRight: { right: 4 },
  hubHigh: { top: 78 },
  hubMid: { top: 176 },
  hubLow: { top: 274 },
  bubbleShop: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.pink,
    borderBottomWidth: 5,
    borderBottomColor: "#c2188b",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleSchool: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#241556",
    borderWidth: 3,
    borderColor: colors.lime,
    borderBottomWidth: 5,
    borderBottomColor: "#8fb01a",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleSky: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#163a66",
    borderWidth: 3,
    borderColor: colors.sky,
    borderBottomWidth: 5,
    borderBottomColor: "#1d6ea8",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleViolet: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.violet,
    borderBottomWidth: 5,
    borderBottomColor: "#4a2ec4",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleLime: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#24320a",
    borderWidth: 3,
    borderColor: colors.lime,
    borderBottomWidth: 5,
    borderBottomColor: "#8fb01a",
    alignItems: "center",
    justifyContent: "center",
  },
  gear: { width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  gearTooth: {
    position: "absolute",
    left: 10,
    top: 0,
    width: 6,
    height: 26,
    borderRadius: 2,
    backgroundColor: colors.lime,
  },
  gearHole: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#163a66",
    borderWidth: 2,
    borderColor: colors.white,
  },
  list: { gap: 4 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  listDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.lime },
  listLine: { height: 3, borderRadius: 2, backgroundColor: colors.white },
  gift: { alignItems: "center" },
  giftLid: { width: 18, height: 6, borderRadius: 2, backgroundColor: colors.pink },
  giftBox: {
    width: 22,
    height: 14,
    marginTop: -1,
    borderRadius: 3,
    backgroundColor: colors.lime,
    alignItems: "center",
  },
  giftBand: { width: 4, height: 14, backgroundColor: colors.pink },
  overlayScroll: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(10,6,24,0.88)",
    zIndex: 30,
  },
  sheetWrap: { padding: 16, paddingTop: 28, paddingBottom: 28 },
  sheet: {
    backgroundColor: colors.panel,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 16,
  },
  sheetKicker: { color: "#ffc2ec", fontWeight: "800", fontSize: 12, letterSpacing: 1.4, textAlign: "center" },
  sheetTitle: { color: colors.white, fontSize: 32, fontWeight: "800", textAlign: "center", marginBottom: 12 },
  sheetSection: { color: "#ffc2ec", fontWeight: "800", fontSize: 12, letterSpacing: 1.4, marginTop: 8, marginBottom: 8 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  settingLabel: { flex: 1, color: colors.white, fontWeight: "800", fontSize: 16 },
  settingState: { fontWeight: "800", fontSize: 14 },
  settingOn: { color: colors.lime },
  settingOff: { color: "#8d93ad" },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 10,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.lime,
    color: "#1a1048",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 28,
  },
  stepText: { flex: 1, color: colors.white, fontWeight: "700", fontSize: 15, lineHeight: 20 },
  boxArt: { width: 210, height: 264, alignSelf: "center", marginBottom: 8 },
  prizeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#241556",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  prizeMark: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  prizeGlyph: { fontWeight: "800", fontSize: 12 },
  prizeCopy: { flex: 1 },
  prizeName: { color: colors.white, fontWeight: "800", fontSize: 16 },
  prizeDetail: { color: colors.muted, fontWeight: "700", fontSize: 13, marginTop: 2 },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.lime,
  },
  house: {
    width: 22,
    height: 14,
    marginTop: -1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  door: { width: 7, height: 8, backgroundColor: colors.violet, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  sideLabel: {
    marginTop: 4,
    color: colors.white,
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
    backgroundColor: "rgba(10,6,24,0.72)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
});
