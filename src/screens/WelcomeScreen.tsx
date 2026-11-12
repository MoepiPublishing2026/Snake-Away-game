import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { GameButton } from "../ui/GameButton";
import { BrandMark } from "../ui/BrandMark";
import { SnakeMark, StageFrame } from "../ui/SnakeMark";

type Props = {
  returning: boolean;
  onContinue: () => void;
};

export function WelcomeScreen({ returning, onContinue }: Props) {
  return (
    <StageFrame>
      <View style={styles.wrap}>
        <SnakeMark />
        <BrandMark width={48} style={styles.brand} />
        <Text style={styles.title}>{returning ? "Welcome back" : "Welcome"}</Text>
        <GameButton large label={returning ? "Continue" : "Start"} onPress={onContinue} />
      </View>
    </StageFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  brand: { marginTop: 8 },
  title: { color: colors.white, fontSize: 42, fontWeight: "800", marginTop: 8, marginBottom: 8 },
});
