import { type ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../theme";

const HERO = ["#22d3ee", "#7b5cff", "#7dff6a", "#ff8a3d", "#ffe14a", "#ff6ad5"];

const BEADS = [
  { x: 8, y: 62 },
  { x: 42, y: 40 },
  { x: 78, y: 56 },
  { x: 114, y: 30 },
  { x: 150, y: 48 },
];

export function SnakeFace({ size }: { size: number }) {
  return (
    <Image
      source={require("../../assets/snake-head.png")}
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}

export function StageFrame({ children }: { children: ReactNode }) {
  return (
    <View style={styles.frame}>
      <View style={[styles.orb, styles.orbViolet]} />
      <View style={[styles.orb, styles.orbPink]} />
      <View style={[styles.orb, styles.orbSky]} />
      <View style={[styles.orb, styles.orbLime]} />
      <View style={[styles.spark, styles.sparkA]} />
      <View style={[styles.spark, styles.sparkB]} />
      <View style={[styles.spark, styles.sparkC]} />
      {children}
    </View>
  );
}

export function SnakeMark({ body }: { body?: string[] } = {}) {
  const beads = body && body.length ? body : HERO;
  return (
    <View style={styles.mark}>
      {BEADS.map((spot, index) => {
        const size = 26 + index * 4;
        return (
          <View
            key={spot.x}
            style={[
              styles.bead,
              {
                left: spot.x,
                top: spot.y,
                width: size,
                height: size,
                backgroundColor: beads[index % beads.length],
                zIndex: index,
              },
            ]}
          >
            <View style={styles.shine} />
          </View>
        );
      })}
      <View style={styles.head}>
        <SnakeFace size={56} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, backgroundColor: colors.bg, overflow: "hidden" },
  orb: { position: "absolute", borderRadius: 999 },
  orbViolet: { width: 220, height: 220, top: -70, left: -70, backgroundColor: "rgba(123,92,255,0.45)" },
  orbPink: { width: 160, height: 160, top: 40, right: -70, backgroundColor: "rgba(255,106,213,0.28)" },
  orbSky: { width: 140, height: 140, bottom: 140, left: -40, backgroundColor: "rgba(56,182,255,0.22)" },
  orbLime: { width: 90, height: 90, top: 150, right: 18, backgroundColor: "rgba(232,255,106,0.18)" },
  spark: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  sparkA: { top: 86, left: 28, backgroundColor: colors.lime },
  sparkB: { top: 210, right: 36, backgroundColor: colors.pink },
  sparkC: { bottom: 210, left: 48, backgroundColor: colors.sky },
  mark: { width: 250, height: 120, marginBottom: 8 },
  bead: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.95)",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  shine: {
    position: "absolute",
    top: 5,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  smile: {
    marginTop: 3,
    width: 14,
    height: 7,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#243249",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  head: {
    position: "absolute",
    left: 176,
    top: 16,
    width: 56,
    height: 56,
    zIndex: 8,
  },
  eyes: { flexDirection: "row", gap: 8 },
  eye: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#243249", alignItems: "flex-end" },
  catchlight: { width: 3, height: 3, borderRadius: 2, marginTop: 1, marginRight: 1, backgroundColor: "#fff" },
});
