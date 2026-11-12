import { Image, type ImageStyle, type StyleProp } from "react-native";

const source = require("../../assets/tekete-safe-space.png");

export function BrandMark({ width = 88, style }: { width?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={source}
      accessibilityLabel="Tekete Safe Space"
      resizeMode="contain"
      style={[{ width, height: Math.round((width * 126) / 109) }, style]}
    />
  );
}
