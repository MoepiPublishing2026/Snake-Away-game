import { Image, type ImageStyle, type StyleProp } from "react-native";
import type { Character } from "../storage";

type Mood = "" | "worried" | "scared" | "sad" | "happy";

const FACES: Record<Character, Record<Mood, number>> = {
  girl: {
    "": require("../../assets/learner-girl.png"),
    happy: require("../../assets/learner-girl-happy.png"),
    worried: require("../../assets/learner-girl-worried.png"),
    scared: require("../../assets/learner-girl-scared.png"),
    sad: require("../../assets/learner-girl-sad.png"),
  },
  boy: {
    "": require("../../assets/learner-boy.png"),
    happy: require("../../assets/learner-boy-happy.png"),
    worried: require("../../assets/learner-boy-worried.png"),
    scared: require("../../assets/learner-boy-scared.png"),
    sad: require("../../assets/learner-boy-sad.png"),
  },
};

export function Learner({
  mood,
  who,
  size = 124,
  style,
}: {
  mood: Mood;
  who: Character;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={FACES[who][mood]}
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      style={[{ width: size, height: Math.round(size * 1.15) }, style]}
    />
  );
}
