import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { View } from "./Themed";

import { usePathname, useRouter } from "expo-router";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";
import { _yellow } from "../constants/Colors";
import { generateCardPairs } from "../utils/utils";
import { AnimatedCard } from "./AnimatedCard";
import { GameTimer } from "./GameTimer";

type CardState = {
  id: number;
  emoji: string;
  isMatched: boolean; // to track whether the card has been matched
  isFlipped: boolean;
};

const emojis = ["👻", "🐼", "🦋", "🏀"];
export default function EditScreenInfo({ path }: { path: string }) {
  const router = useRouter();

  const sharedState = useSharedValue<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  });

  const [firstCard, setFirstCard] = useState<{
    emoji: string;
    index: number;
  } | null>(null);

  const [cardState, setCardState] = useState<CardState[]>(() =>
    generateCardPairs(emojis)
  );

  const [endGame, setEndGame] = useState<boolean>(false);

  const totalMatches = useMemo(() => {
    if (cardState.length > 1) {
      return cardState.filter((item) => item.isMatched).length / 2;
    } else {
      return 0;
    }
  }, [cardState]);

  useEffect(() => {
    if (totalMatches === 4) {
      setEndGame(true);
    }
  }, [totalMatches]);

  const toggleCard = (index: number, emoji: string) => {
    if (index === firstCard?.index) return;
    if (cardState[index].isMatched) return;

    setCardState((prevCardState) => {
      const currentCardState = [...prevCardState];
      if (firstCard && emoji === firstCard.emoji) {
        // console.log("First Index", firstCard);
        currentCardState[index].isMatched = true;
        currentCardState[firstCard.index].isMatched = true;
        return currentCardState;
      } else if (firstCard && emoji !== firstCard.emoji) {
        // No match found
        return currentCardState;
      }
      return currentCardState;
    });

    if (!firstCard) {
      // First card selected
      sharedState.value = {
        ...sharedState.value,
        [index]: !sharedState.value[index],
      };
      setFirstCard({ emoji, index });
    } else if (firstCard && emoji !== firstCard.emoji) {
      sharedState.value = {
        ...sharedState.value,
        [index]: !sharedState.value[index],
      };

      const timeout = setTimeout(() => {
        sharedState.value = {
          ...sharedState.value,
          [firstCard.index]: !sharedState.value[firstCard.index],
          [index]: !sharedState.value[index],
        };
        clearTimeout(timeout);
      }, 300);
      setFirstCard(null); // Reset `firstCard`
    } else if (firstCard && emoji === firstCard.emoji) {
      sharedState.value = {
        ...sharedState.value,
        [index]: !sharedState.value[index],
      };
      setFirstCard(null);
    }
  };

  const getFinalTiming = (t: SharedValue<number>) => {
    console.log("TIming ", t);
  };

  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const navigate = () => {
    // setEndGame(true);
    // router.replace("/game");
    router.dismissTo("/");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <View style={[{ height: "40%", backgroundColor: "#000" }, styles.center]}>
        <GameTimer endGame={endGame} getFinalTiming={getFinalTiming} />
      </View>
      {/* {!endGame ? ( */}
      {!endGame ? (
        <View
          style={[
            styles.cardContainer,
            styles.center,
            { backgroundColor: "#000" },
          ]}
        >
          {cardState ? (
            Array.from({ length: 9 }).map((item, index) => {
              return (
                <AnimatedCard
                  key={`${index}`}
                  emoji={cardState[index]?.emoji ?? "🏀"}
                  index={index}
                  isFlipped={sharedState}
                  flipTrigger={toggleCard}
                />
              );
            })
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      ) : (
        <Animated.View
          style={{
            width: "90%",
            height: "55%",
            backgroundColor: _yellow,
            alignSelf: "center",
            borderRadius: 20,
            paddingVertical: 20,
            paddingHorizontal: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 65, lineHeight: 72 }}>
            ️‍🔥 {"\n"} You are on {"\n"} fire!
          </Text>

          {/* <Link
            href={"/game"}
            style={[
              {
                width: "95%",
                height: "12%",
                borderColor: "#000",
                borderRadius: 5,
                borderWidth: 1.5,
                alignSelf: "center",
              },
              styles.center,
            ]}
          > */}
          <Pressable
            onPress={() => navigate()}
            style={[
              {
                width: "95%",
                height: "12%",
                borderColor: "#000",
                borderRadius: 5,
                borderWidth: 1.5,
                alignSelf: "center",
              },
              styles.center,
            ]}
          >
            <Text style={{ fontSize: 20 }}>New Game</Text>
          </Pressable>
          {/* </Link> */}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexWrap: "wrap",
    width: "100%",
    height: "60%",
    flexDirection: "row",
    gap: 2,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
