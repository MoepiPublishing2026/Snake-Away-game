import { StyleSheet, Text, View } from "react-native";
import { SCHOOLS } from "../game/content";
import type { School } from "../storage";
import { colors } from "../theme";
import { GameButton } from "../ui/GameButton";
import { StageFrame } from "../ui/SnakeMark";

type Props = { onChoose: (school: School) => void };

const OPTIONS: School[] = ["primary", "secondary"];

export function SchoolScreen({ onChoose }: Props) {
  return (
    <StageFrame>
      <View style={styles.wrap}>
        <Text style={styles.kicker}>School level</Text>
        <Text style={styles.title}>What's your school level?</Text>
        {OPTIONS.map((id) => (
          <GameButton key={id} soft label={SCHOOLS[id].label} onPress={() => onChoose(id)} />
        ))}
      </View>
    </StageFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24 },
  kicker: { color: "#ffc2ec", letterSpacing: 2.4, fontWeight: "800", fontSize: 13, textAlign: "center" },
  title: { color: colors.white, fontSize: 30, fontWeight: "800", textAlign: "center", marginTop: 10, marginBottom: 8 },
});
