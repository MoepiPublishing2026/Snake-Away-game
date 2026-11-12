import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

export type Pulse = "tap" | "warn" | "heavy" | "success" | "error";

const ANDROID: Record<Pulse, number | number[]> = {
  tap: 20,
  warn: 45,
  heavy: 80,
  success: [0, 28, 36, 42],
  error: [0, 70, 50, 90],
};

let enabled = false;

export function setVibrationEnabled(on: boolean) {
  enabled = on;
  if (!on) Vibration.cancel();
}

export function pulse(kind: Pulse) {
  if (!enabled) return;
  if (Platform.OS === "ios") {
    void iosPulse(kind);
    return;
  }
  Vibration.vibrate(ANDROID[kind]);
}

async function iosPulse(kind: Pulse) {
  try {
    if (kind === "success") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (kind === "error") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (kind === "warn") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (kind === "heavy") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      await Haptics.selectionAsync();
    }
  } catch {
    // Haptics are unavailable on some devices.
  }
}
