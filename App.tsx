import { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { applyAudioSettings, playSfx, prepareAudio, unlockAudio } from "./src/audio";
import { LoadingScreen, SplashScreen } from "./src/screens/IntroScreens";
import { CharacterScreen } from "./src/screens/CharacterScreen";
import { MenuScreen } from "./src/screens/MenuScreen";
import { PlayScreen, type RunSnapshot } from "./src/screens/PlayScreen";
import { SchoolScreen } from "./src/screens/SchoolScreen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import {
  getSavedCharacter,
  getSavedSchool,
  loadBestLevel,
  loadCoins,
  loadInventory,
  loadLevel,
  loadSettings,
  saveBestLevel,
  saveCharacter,
  saveCoins,
  saveInventory,
  saveLevel,
  saveSchool,
  type Character,
  type School,
} from "./src/storage";
import { LIFE_CAP, POWER_CAP, SHOP, START_COINS, colors } from "./src/theme";

type Screen = "splash" | "loading" | "welcome" | "school" | "character" | "home" | "shop" | "play";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [returning, setReturning] = useState(false);
  const [school, setSchool] = useState<School>("primary");
  const [character, setCharacter] = useState<Character>("girl");
  const [hasCharacter, setHasCharacter] = useState(false);
  const [coins, setCoins] = useState(START_COINS);
  const [bestLevel, setBestLevel] = useState(1);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [hint, setHint] = useState(1);
  const [shuffle, setShuffle] = useState(1);
  const [freeze, setFreeze] = useState(1);
  const [shopNote, setShopNote] = useState("");

  const openSplashDone = useCallback(() => setScreen("loading"), []);

  const openAfterLoad = useCallback(() => {
    void (async () => {
      const [saved, savedCharacter] = await Promise.all([getSavedSchool(), getSavedCharacter()]);
      if (savedCharacter) {
        setCharacter(savedCharacter);
        setHasCharacter(true);
      }
      if (!saved) {
        setReturning(false);
        setScreen("welcome");
        return;
      }
      const [nextCoins, nextBest, pack, nextLevelSaved] = await Promise.all([
        loadCoins(saved),
        loadBestLevel(saved),
        loadInventory(saved),
        loadLevel(saved),
      ]);
      const nextLevel = nextLevelSaved ?? nextBest;
      setSchool(saved);
      setCoins(nextCoins);
      setBestLevel(nextBest);
      setLevel(nextLevel);
      setLives(pack.lives);
      setHint(pack.hint);
      setShuffle(pack.shuffle);
      setFreeze(pack.freeze);
      setReturning(true);
      setScreen("welcome");
    })();
  }, []);

  useEffect(() => {
    prepareAudio();
    void loadSettings().then(applyAudioSettings);
  }, []);

  useEffect(() => {
    if (!shopNote) return;
    const timer = setTimeout(() => setShopNote(""), 1400);
    return () => clearTimeout(timer);
  }, [shopNote]);

  async function chooseSchool(next: School) {
    unlockAudio();
    await saveSchool(next);
    const [nextCoins, nextBest, pack, nextLevelSaved] = await Promise.all([
      loadCoins(next),
      loadBestLevel(next),
      loadInventory(next),
      loadLevel(next),
    ]);
    setSchool(next);
    setCoins(nextCoins);
    setBestLevel(nextBest);
    setLevel(nextLevelSaved ?? nextBest);
    setLives(pack.lives);
    setHint(pack.hint);
    setShuffle(pack.shuffle);
    setFreeze(pack.freeze);
    setScreen("character");
  }

  async function chooseCharacter(next: Character) {
    unlockAudio();
    await saveCharacter(next);
    setCharacter(next);
    setHasCharacter(true);
    setScreen("home");
  }

  function applyRun(next: RunSnapshot) {
    setCoins(next.coins);
    setLives(next.lives);
    setHint(next.hint);
    setShuffle(next.shuffle);
    setFreeze(next.freeze);
    setBestLevel(next.bestLevel);
    setLevel(next.levelId);
    void saveCoins(school, next.coins);
    void saveBestLevel(school, next.bestLevel);
    void saveLevel(school, next.levelId);
    void saveInventory(school, {
      lives: next.lives,
      hint: next.hint,
      shuffle: next.shuffle,
      freeze: next.freeze,
    });
  }

  async function buy(id: (typeof SHOP)[number]["id"]) {
    const item = SHOP.find((entry) => entry.id === id);
    if (!item) return;
    const full =
      item.id === "life" ? lives >= LIFE_CAP : { hint, shuffle, freeze }[item.id] >= POWER_CAP;
    if (full) {
      playSfx("deny");
      setShopNote("That is full");
      return;
    }
    if (coins < item.price) {
      playSfx("deny");
      setShopNote("Not enough stars");
      return;
    }
    const nextCoins = coins - item.price;
    const pack = {
      lives: item.id === "life" ? lives + 1 : lives,
      hint: item.id === "hint" ? hint + 1 : hint,
      shuffle: item.id === "shuffle" ? shuffle + 1 : shuffle,
      freeze: item.id === "freeze" ? freeze + 1 : freeze,
    };
    setCoins(nextCoins);
    setLives(pack.lives);
    setHint(pack.hint);
    setShuffle(pack.shuffle);
    setFreeze(pack.freeze);
    await saveCoins(school, nextCoins);
    await saveInventory(school, pack);
    setShopNote(`You got ${item.name}`);
    playSfx("buy");
  }

  return (
    <View style={styles.stage}>
      <StatusBar style="light" />
      <View style={styles.phone}>
      {screen === "splash" && <SplashScreen onDone={openSplashDone} />}
      {screen === "loading" && <LoadingScreen onDone={openAfterLoad} />}
      {screen === "welcome" && (
        <WelcomeScreen
          returning={returning}
          onContinue={() => {
            unlockAudio();
            setScreen(!returning ? "school" : hasCharacter ? "home" : "character");
          }}
        />
      )}
      {screen === "school" && <SchoolScreen onChoose={chooseSchool} />}
      {screen === "character" && <CharacterScreen onChoose={chooseCharacter} />}
      {screen === "home" && (
        <MenuScreen
          school={school}
          character={character}
          coins={coins}
          lives={lives}
          level={level}
          onPlay={() => {
            unlockAudio();
            setScreen("play");
          }}
          onShop={() => {
            unlockAudio();
            setScreen("shop");
          }}
          onChangeSchool={() => {
            unlockAudio();
            setScreen("school");
          }}
        />
      )}
      {screen === "shop" && (
        <ShopScreen coins={coins} note={shopNote} onBuy={buy} onClose={() => setScreen("home")} />
      )}
      {screen === "play" && (
        <PlayScreen
          school={school}
          character={character}
          coins={coins}
          lives={lives}
          hint={hint}
          shuffle={shuffle}
          freeze={freeze}
          bestLevel={bestLevel}
          startLevel={level}
          onSync={applyRun}
          onExit={() => setScreen("home")}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.bg,
    borderLeftWidth: Platform.OS === "web" ? 1 : 0,
    borderRightWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "rgba(255,255,255,0.08)",
  },
});
