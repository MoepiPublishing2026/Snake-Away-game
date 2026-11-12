import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { GameSettings } from "../storage";
import { colors } from "../theme";
import { FONT_OPTIONS, TEXT_SIZES, fontFace } from "./typeface";

type Props = {
  settings: GameSettings;
  onChange: (partial: Partial<GameSettings>) => void;
};

export function SettingsPanel({ settings, onChange }: Props) {
  return (
    <View>
      <Text style={styles.section}>SOUND</Text>
      <ToggleRow icon={<SpeakerIcon />} tint="#ff6ad5" label="Sound effects" on={settings.sound} onPress={() => onChange({ sound: !settings.sound })} />
      <ToggleRow icon={<NoteIcon />} tint="#7b5cff" label="Music" on={settings.music} onPress={() => onChange({ music: !settings.music })} />
      <ToggleRow icon={<VibrateIcon />} tint="#38b6ff" label="Vibration" on={settings.vibration} onPress={() => onChange({ vibration: !settings.vibration })} />

      <Text style={styles.section}>TEXT SIZE</Text>
      <View style={styles.choiceRow}>
        {TEXT_SIZES.map((size) => {
          const selected = settings.textSize === size.id;
          return (
            <Pressable
              key={size.id}
              style={[styles.choice, selected && styles.choiceOn]}
              onPress={() => onChange({ textSize: size.id })}
              accessibilityRole="button"
            >
              <Text style={[styles.sample, { fontSize: size.sample }, selected && styles.sampleOn]}>{size.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>FONT</Text>
      <View style={styles.fontGrid}>
        {FONT_OPTIONS.map((font) => {
          const selected = settings.font === font.id;
          return (
            <Pressable
              key={font.id}
              style={[styles.fontCard, selected && styles.choiceOn]}
              onPress={() => onChange({ font: font.id })}
              accessibilityRole="button"
            >
              <Text style={[styles.fontSample, { fontFamily: fontFace(font.id) }, selected && styles.sampleOn]}>Aa</Text>
              <Text style={[styles.fontName, selected && styles.sampleOn]}>{font.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>DISPLAY</Text>
      <ToggleRow icon={<ContrastIcon />} tint="#e8ff6a" label="High contrast" on={settings.contrast} onPress={() => onChange({ contrast: !settings.contrast })} />
      <ToggleRow icon={<SunIcon />} tint="#ffe14a" label="Bright board" on={settings.bright} onPress={() => onChange({ bright: !settings.bright })} />
      <ToggleRow icon={<MotionIcon />} tint="#ff6ad5" label="Reduce motion" on={settings.reduceMotion} onPress={() => onChange({ reduceMotion: !settings.reduceMotion })} />

      <Text style={styles.section}>GAME</Text>
      <ToggleRow icon={<QuitIcon />} tint="#38b6ff" label="Confirm before quit" on={settings.confirmQuit} onPress={() => onChange({ confirmQuit: !settings.confirmQuit })} />
    </View>
  );
}

function ToggleRow({
  icon,
  tint,
  label,
  on,
  onPress,
}: {
  icon: ReactNode;
  tint: string;
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBubble, { backgroundColor: tint }]}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.stateBtn, on ? styles.stateOn : styles.stateOff]}
        onPress={onPress}
        accessibilityRole="switch"
        accessibilityState={{ checked: on }}
      >
        <Text style={[styles.stateText, on ? styles.stateTextOn : styles.stateTextOff]}>{on ? "On" : "Off"}</Text>
      </Pressable>
    </View>
  );
}

function SpeakerIcon() {
  return (
    <View style={styles.speaker}>
      <View style={styles.speakerBody} />
      <View style={styles.speakerHorn} />
      <View style={styles.speakerWave} />
    </View>
  );
}

function NoteIcon() {
  return (
    <View style={styles.note}>
      <View style={styles.noteStem} />
      <View style={styles.noteFlag} />
      <View style={styles.noteHead} />
    </View>
  );
}

function VibrateIcon() {
  return (
    <View style={styles.phoneWrap}>
      <View style={styles.phone} />
      <View style={styles.waveA} />
      <View style={styles.waveB} />
    </View>
  );
}

function ContrastIcon() {
  return (
    <View style={styles.contrast}>
      <View style={styles.contrastHalf} />
    </View>
  );
}

function SunIcon() {
  return (
    <View style={styles.sun}>
      {[0, 45, 90, 135].map((turn) => (
        <View key={turn} style={[styles.sunRay, { transform: [{ rotate: `${turn}deg` }] }]} />
      ))}
      <View style={styles.sunCore} />
    </View>
  );
}

function MotionIcon() {
  return (
    <View style={styles.motion}>
      <View style={styles.motionBar} />
      <View style={[styles.motionBar, styles.motionBarMid]} />
      <View style={[styles.motionBar, styles.motionBarShort]} />
    </View>
  );
}

function QuitIcon() {
  return (
    <View style={styles.door}>
      <View style={styles.doorKnob} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { color: "#ffc2ec", fontWeight: "800", fontSize: 12, letterSpacing: 1.4, marginTop: 10, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  iconBubble: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, color: colors.white, fontWeight: "800", fontSize: 16 },
  stateBtn: {
    minWidth: 68,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  stateOn: { backgroundColor: colors.lime, borderBottomWidth: 4, borderBottomColor: "#8fb01a" },
  stateOff: {
    backgroundColor: "#120a32",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    borderBottomWidth: 4,
    borderBottomColor: "#070412",
  },
  stateText: { fontWeight: "800", fontSize: 14 },
  stateTextOn: { color: "#1a1048" },
  stateTextOff: { color: "#c5cbe0" },
  choiceRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  choice: {
    flex: 1,
    minHeight: 36,
    borderRadius: 12,
    backgroundColor: "#241556",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#120a32",
  },
  choiceOn: { backgroundColor: colors.lime, borderBottomColor: "#8fb01a" },
  sample: { color: colors.white, fontWeight: "800" },
  sampleOn: { color: "#1a1048" },
  fontGrid: { flexDirection: "row", gap: 6, marginBottom: 4 },
  fontCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#241556",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 4,
    borderBottomColor: "#120a32",
  },
  fontSample: { color: colors.white, fontSize: 16, fontWeight: "800" },
  fontName: { color: colors.white, fontWeight: "800", fontSize: 11, marginTop: 1 },
  speaker: { width: 22, height: 16, justifyContent: "center" },
  speakerBody: { width: 7, height: 8, borderRadius: 2, backgroundColor: "#1a1048" },
  speakerHorn: {
    position: "absolute",
    left: 6,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 8,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#1a1048",
  },
  speakerWave: {
    position: "absolute",
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#1a1048",
    borderLeftColor: "transparent",
  },
  note: { width: 18, height: 20 },
  noteStem: { position: "absolute", left: 4, top: 2, width: 2, height: 13, backgroundColor: "#fff" },
  noteFlag: { position: "absolute", left: 4, top: 2, width: 10, height: 2, backgroundColor: "#fff" },
  noteHead: { position: "absolute", left: 0, bottom: 0, width: 8, height: 6, borderRadius: 4, backgroundColor: "#fff" },
  phoneWrap: { width: 22, height: 20, alignItems: "center", justifyContent: "center" },
  phone: { width: 10, height: 16, borderRadius: 2, borderWidth: 2, borderColor: "#042033", backgroundColor: "#fff" },
  waveA: { position: "absolute", left: 0, width: 3, height: 8, borderRadius: 2, backgroundColor: "#042033" },
  waveB: { position: "absolute", right: 0, width: 3, height: 12, borderRadius: 2, backgroundColor: "#042033" },
  contrast: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1a1048",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#1a1048",
  },
  contrastHalf: { width: 9, height: 18, backgroundColor: colors.lime },
  sun: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  sunRay: { position: "absolute", left: 8, top: 0, width: 3, height: 20, borderRadius: 2, backgroundColor: "#3a2a00" },
  sunCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
  motion: { width: 18, gap: 3 },
  motionBar: { height: 3, borderRadius: 2, backgroundColor: "#1a1048", width: 18 },
  motionBarMid: { width: 13 },
  motionBarShort: { width: 8 },
  door: {
    width: 14,
    height: 18,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#042033",
    backgroundColor: "#fff",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 2,
  },
  doorKnob: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#042033" },
});
