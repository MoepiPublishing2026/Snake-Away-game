import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, SHOP } from "../theme";
import { Star, StarAmount } from "../ui/Star";
import { GameButton } from "../ui/GameButton";
import { ItemMark } from "../ui/ShineIcons";
import { StageFrame } from "../ui/SnakeMark";

type Props = {
  coins: number;
  note: string;
  onBuy: (id: (typeof SHOP)[number]["id"]) => void;
  onClose: () => void;
};

export function ShopScreen({ coins, note, onBuy, onClose }: Props) {
  return (
    <StageFrame>
    <View style={styles.wrap}>
      <Text style={styles.title}>Shop</Text>
      <StarAmount amount={coins} color={colors.white} size={28} textSize={28} style={styles.balance} />
      {SHOP.map((item) => (
        <Pressable key={item.id} style={styles.item} onPress={() => onBuy(item.id)}>
          <View style={[styles.badge, { backgroundColor: item.tint }]}>
            <ItemMark id={item.id} />
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.price}>
            <Star size={16} />
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </Pressable>
      ))}
      <Text style={styles.note}>{note}</Text>
      <GameButton label="Close" onPress={onClose} />
    </View>
    </StageFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 24 },
  title: { color: colors.white, fontSize: 40, fontWeight: "800", textAlign: "center" },
  balance: { alignSelf: "center", marginVertical: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#241556",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,106,213,0.28)",
    padding: 14,
    marginBottom: 10,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  ico: { color: "#1a1048", fontSize: 18, fontWeight: "800" },
  name: { flex: 1, color: colors.white, fontWeight: "800", fontSize: 18 },
  price: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { color: colors.lime, fontWeight: "800", fontSize: 16 },
  note: { minHeight: 22, color: colors.lime, fontWeight: "800", textAlign: "center", marginVertical: 8 },
  btn: {
    backgroundColor: colors.pink,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 18 },
});
