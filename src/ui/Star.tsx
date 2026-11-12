import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../theme";

export function Star({ size = 18 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Text style={[styles.star, { fontSize: size, lineHeight: size }]}>★</Text>
    </View>
  );
}

export function StarAmount({
  amount,
  color = colors.lime,
  size = 18,
  textSize = 16,
  style,
}: {
  amount: string | number;
  color?: string;
  size?: number;
  textSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.row, style]}>
      <Star size={size} />
      <Text style={[styles.amount, { color, fontSize: textSize }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  star: { color: "#ffe14a", fontWeight: "800", textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  amount: { fontWeight: "800" },
});
