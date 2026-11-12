import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  soft?: boolean;
  large?: boolean;
};

export function GameButton({ label, onPress, soft, large }: Props) {
  return (
    <Pressable style={[styles.btn, large && styles.large, soft && styles.soft]} onPress={onPress}>
      <Text style={[styles.text, large && styles.largeText, soft && styles.softText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.pink,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: "#c2188b",
  },
  large: { paddingVertical: 16 },
  soft: {
    backgroundColor: "#241556",
    borderWidth: 2,
    borderColor: "rgba(232,255,106,0.85)",
    borderBottomWidth: 4,
    borderBottomColor: "rgba(232,255,106,0.55)",
  },
  text: { color: colors.white, fontWeight: "800", fontSize: 18 },
  largeText: { fontSize: 26 },
  softText: { color: colors.white },
});
