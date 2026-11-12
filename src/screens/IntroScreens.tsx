import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { BrandMark } from "../ui/BrandMark";
import { SnakeMark, StageFrame } from "../ui/SnakeMark";

type SplashProps = { onDone: () => void };
type LoadingProps = { onDone: () => void };

export function SplashScreen({ onDone }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <StageFrame>
      <View style={splash.wrap}>
        <BrandMark width={56} style={splash.brand} />
        <Text style={splash.title}>Snake Away</Text>
        <View style={splash.rule} />
        <SnakeMark />
      </View>
    </StageFrame>
  );
}

export function LoadingScreen({ onDone }: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + 2);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const timer = setTimeout(onDone, 700);
    return () => clearTimeout(timer);
  }, [progress, onDone]);

  return (
    <StageFrame>
      <View style={load.wrap}>
        <BrandMark width={48} style={load.brand} />
        <Text style={load.title}>Snake Away</Text>
        <SnakeMark />
        <View style={load.track}>
          <View style={[load.fill, { width: `${progress}%` }]} />
          <Text style={load.percent}>{progress}%</Text>
        </View>
      </View>
    </StageFrame>
  );
}

const splash = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: colors.white, fontSize: 52, fontWeight: "800", letterSpacing: -1 },
  rule: { width: 92, height: 4, borderRadius: 2, backgroundColor: colors.pink, marginTop: 12 },
  brand: { marginBottom: 8 },
});

const load = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  brand: { marginBottom: 8 },
  title: { color: colors.white, fontSize: 42, fontWeight: "800", marginTop: 6, marginBottom: 12 },
  track: {
    width: "100%",
    maxWidth: 320,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#b6c44a",
    overflow: "hidden",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.16)",
    marginTop: 18,
  },
  fill: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: colors.lime, borderRadius: 14 },
  percent: { color: "#1a1048", fontWeight: "800", textAlign: "center" },
});
