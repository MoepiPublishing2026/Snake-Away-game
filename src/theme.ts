export const colors = {
  bg: "#0a0618",
  panel: "#1a1048",
  pink: "#ff6ad5",
  violet: "#7b5cff",
  sky: "#38b6ff",
  lime: "#e8ff6a",
  muted: "#b7c0dc",
  white: "#ffffff",
};

export const START_COINS = 200;
export const LIFE_CAP = 6;
export const POWER_CAP = 9;

export const SHOP = [
  { id: "life" as const, icon: "❤", name: "Life", price: 80, tint: "#fff0f3" },
  { id: "hint" as const, icon: "💡", name: "Hint", price: 40, tint: "#fff6cc" },
  { id: "shuffle" as const, icon: "⟲", name: "Shuffle", price: 50, tint: "#ffe8f7" },
  { id: "freeze" as const, icon: "❄", name: "Freeze", price: 60, tint: "#e7f6ff" },
];
