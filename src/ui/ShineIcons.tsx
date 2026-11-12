import { StyleSheet, View } from "react-native";

export function ShinyHeart({ size = 22, lit = true, color }: { size?: number; lit?: boolean; color?: string }) {
  const red = color ?? (lit ? "#ff2748" : "#8a2340");
  const lobe = size * 0.54;
  return (
    <View style={{ width: size, height: size * 0.92 }}>
      <View style={{ position: "absolute", width: lobe, height: lobe, borderRadius: lobe, backgroundColor: red, top: 0, left: 0 }} />
      <View style={{ position: "absolute", width: lobe, height: lobe, borderRadius: lobe, backgroundColor: red, top: 0, right: 0 }} />
      <View
        style={{
          position: "absolute",
          width: size * 0.64,
          height: size * 0.64,
          backgroundColor: red,
          top: size * 0.2,
          left: size * 0.18,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size * 0.26,
          height: size * 0.14,
          borderRadius: size,
          backgroundColor: lit ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
          top: size * 0.16,
          left: size * 0.16,
          transform: [{ rotate: "-28deg" }],
        }}
      />
    </View>
  );
}

export function BulbIcon({ color = "#fff" }: { color?: string }) {
  const filament = /^#[0-4]/i.test(color) ? "rgba(255,255,255,0.92)" : "#1a1048";
  return (
    <View style={styles.bulb}>
      <View style={[styles.bulbGlass, { backgroundColor: color }]}>
        <View style={styles.bulbShine} />
        <View style={[styles.bulbFilament, { backgroundColor: filament }]} />
      </View>
      <View style={[styles.bulbNeck, { backgroundColor: color }]} />
      <View style={[styles.bulbCap, { backgroundColor: color }]} />
    </View>
  );
}

export function SnowflakeIcon({ color = "#fff" }: { color?: string }) {
  return (
    <View style={styles.flake}>
      {[0, 60, 120].map((turn) => (
        <View key={turn} style={[styles.flakeArm, { transform: [{ rotate: `${turn}deg` }] }]}>
          <View style={[styles.flakeBar, { backgroundColor: color }]} />
          <View style={[styles.flakeTick, styles.flakeTickTop, { backgroundColor: color }]} />
          <View style={[styles.flakeTick, styles.flakeTickLow, { backgroundColor: color }]} />
        </View>
      ))}
      <View style={[styles.flakeHub, { borderColor: color }]} />
    </View>
  );
}

export function ShuffleIcon({ color = "#fff" }: { color?: string }) {
  return (
    <View style={styles.shuffle}>
      <View style={styles.shuffleRow}>
        <View style={[styles.shuffleBar, { backgroundColor: color }]} />
        <ArrowHead color={color} />
      </View>
      <View style={[styles.shuffleRow, styles.shuffleRowLow]}>
        <ArrowHead color={color} left />
        <View style={[styles.shuffleBar, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

function ArrowHead({ color, left }: { color: string; left?: boolean }) {
  return (
    <View
      style={
        left
          ? {
              width: 0,
              height: 0,
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderRightWidth: 7,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderRightColor: color,
            }
          : {
              width: 0,
              height: 0,
              borderTopWidth: 5,
              borderBottomWidth: 5,
              borderLeftWidth: 7,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: color,
            }
      }
    />
  );
}

export function NothingIcon({ color = "#fff" }: { color?: string }) {
  return (
    <View style={styles.nothing}>
      <View style={[styles.nothingBar, { backgroundColor: color, transform: [{ rotate: "45deg" }] }]} />
      <View style={[styles.nothingBar, { backgroundColor: color, transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
}

export function PrizeGlyph({ type, ink = "#1a1048" }: { type: string; ink?: string }) {
  if (type === "life") return <ShinyHeart size={18} color={ink === "#fff" ? "#ffffff" : "#ff2748"} />;
  if (type === "hint") return <BulbIcon color={ink} />;
  if (type === "freeze") return <SnowflakeIcon color={ink} />;
  if (type === "shuffle") return <ShuffleIcon color={ink} />;
  if (type === "none") return <NothingIcon color={ink} />;
  return null;
}

export function ItemMark({ id }: { id: string }) {
  if (id === "life") return <ShinyHeart size={16} />;
  if (id === "hint") return <BulbIcon color="#e2a400" />;
  if (id === "freeze") return <SnowflakeIcon color="#1686d4" />;
  if (id === "shuffle") return <ShuffleIcon color="#ff3ec4" />;
  return null;
}

const styles = StyleSheet.create({
  bulb: { width: 16, height: 22, alignItems: "center" },
  bulbGlass: {
    width: 16,
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    alignItems: "center",
    overflow: "hidden",
  },
  bulbShine: {
    position: "absolute",
    top: 2,
    left: 3,
    width: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  bulbFilament: { width: 2, height: 6, borderRadius: 1, marginTop: 5 },
  bulbNeck: { width: 10, height: 3, borderRadius: 1, marginTop: 1 },
  bulbCap: { width: 7, height: 2, borderRadius: 1, marginTop: 1 },
  flake: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  flakeArm: { position: "absolute", left: 4, top: 0, width: 14, height: 22, alignItems: "center" },
  flakeBar: { position: "absolute", left: 5, width: 3, height: 22, borderRadius: 2 },
  flakeTick: { position: "absolute", left: 2, width: 10, height: 3, borderRadius: 2 },
  flakeTickTop: { top: 4 },
  flakeTickLow: { bottom: 4 },
  flakeHub: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff", borderWidth: 2 },
  shuffle: { width: 22, height: 16, justifyContent: "space-between" },
  shuffleRow: { flexDirection: "row", alignItems: "center" },
  shuffleRowLow: { justifyContent: "flex-end" },
  shuffleBar: { width: 12, height: 3, borderRadius: 2 },
  nothing: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  nothingBar: { position: "absolute", left: 9, top: 0, width: 4, height: 22, borderRadius: 2 },
});