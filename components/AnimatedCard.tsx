import React from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewProps,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  SlideInDown,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const AnimatedPresable = Animated.createAnimatedComponent(Pressable);
type CardProps = {
  isFlipped: SharedValue<{ [key: number]: boolean }>;
  cardStyle?: StyleProp<ViewProps>;
  direction?: "x" | "y";
  duration?: number;
  RegularContent?: ChildNode;
  FlippedContent?: ChildNode;
  index: number;
  flipTrigger: (index: number, emoji: string) => void;
  emoji: string;
};

export function AnimatedCard({
  isFlipped,
  direction = "x",
  duration = 300,
  index,
  flipTrigger,
  emoji,
}: CardProps) {
  const isDirectionX = false;

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(
      Number(isFlipped.value[index]),
      [0, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(
      Number(isFlipped.value[index]),
      [0, 1],
      [180, 360],
      Extrapolation.CLAMP
    );
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <AnimatedPresable
      onPress={() => flipTrigger(index, emoji)}
      entering={SlideInDown.springify()
        .damping(80)
        .stiffness(200)
        .delay(index * 100)}
    >
      <Animated.View
        style={[
          {
            width: width * 0.3,
            height: width * 0.3,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "yellow",
            backfaceVisibility: "hidden",
          },
          flipCardStyles.regularCard,
          regularCardAnimatedStyle,
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          {
            width: width * 0.3,
            height: width * 0.3,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "blue",
            backfaceVisibility: "hidden",
          },
          flipCardStyles.flippedCard,
          flippedCardAnimatedStyle,
        ]}
      >
        <Text style={{ fontSize: 60, lineHeight: 100 }}>{emoji}</Text>
      </Animated.View>
    </AnimatedPresable>
  );
}

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    zIndex: 1,
  },
  flippedCard: {
    // position: "absolute",
    zIndex: 10,
  },
});
