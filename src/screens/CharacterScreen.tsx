import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Character } from "../storage";
import { colors } from "../theme";
import { Learner } from "../ui/Learner";
import { StageFrame } from "../ui/SnakeMark";

type Props = { onChoose: (who: Character) => void };

const OPTIONS: { id: Character; label: string }[] = [
  { id: "girl", label: "Girl" },
  { id: "boy", label: "Boy" },
];

export function CharacterScreen({ onChoose }: Props) {
  return (
    <StageFrame>
      <View style={styles.wrap}>
        <Text style={styles.kicker}>Your learner</Text>
        <Text style={styles.title}>Who do you want to play as?</Text>
        <View style={styles.row}>
          {OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={styles.card}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => onChoose(option.id)}
            >
              <Learner mood="happy" who={option.id} size={118} />
              <Text style={styles.label}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </StageFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24 },
  kicker: { color: "#ffc2ec", letterSpacing: 2.4, fontWeight: "800", fontSize: 13, textAlign: "center" },
  title: { color: colors.white, fontSize: 30, fontWeight: "800", textAlign: "center", marginTop: 10, marginBottom: 18 },
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(232,255,106,0.85)",
    paddingTop: 8,
    paddingBottom: 16,
  },
  label: { color: colors.white, fontWeight: "800", fontSize: 20, marginTop: 4 },
});
