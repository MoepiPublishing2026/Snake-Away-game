import { Platform } from "react-native";

export type TextSize = "small" | "medium" | "large";
export type FontChoice = "clean" | "round" | "serif" | "mono";

export const TEXT_SIZES: { id: TextSize; label: string; sample: number }[] = [
  { id: "small", label: "Small", sample: 12 },
  { id: "medium", label: "Medium", sample: 14 },
  { id: "large", label: "Large", sample: 16 },
];

export const FONT_OPTIONS: { id: FontChoice; label: string }[] = [
  { id: "clean", label: "Clean" },
  { id: "round", label: "Round" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
];

export function fontFace(choice: FontChoice) {
  if (choice === "round") {
    return Platform.select({ ios: "Avenir-Medium", android: "sans-serif-medium", default: "Trebuchet MS" }) ?? "Trebuchet MS";
  }
  if (choice === "serif") {
    return Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }) ?? "Georgia";
  }
  if (choice === "mono") {
    return Platform.select({ ios: "Courier", android: "monospace", default: "Consolas" }) ?? "Consolas";
  }
  return Platform.select({ ios: "System", android: "sans-serif", default: "Segoe UI" }) ?? "Segoe UI";
}

export function fontScale(size: TextSize) {
  if (size === "small") return 0.86;
  if (size === "large") return 1.28;
  return 1;
}
