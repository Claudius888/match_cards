import React, { useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

interface AppProps {
  width: number;
  endGame: boolean;
  getFinalTiming: (t: SharedValue<number>) => void;
}

const { width } = Dimensions.get("window");
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

export function GameTimer({ width, endGame, getFinalTiming }: AppProps) {
  const t = useSharedValue<number>(0);
  const startTime = useSharedValue(Date.now());

  // highlight-start
  const frameCallback = useFrameCallback((frameInfo) => {
    t.value = Date.now() - startTime.value;
  });
  // highlight-end

  const retriveFinalTiming = useCallback(() => {
    if (endGame) {
      frameCallback.setActive(false);
      getFinalTiming(t.value);
    }
  }, [endGame]);

  useEffect(() => {
    retriveFinalTiming();
  }, [retriveFinalTiming]);

  const formattedTime = useDerivedValue(() => {
    const totalMilliseconds = t.value; // Total elapsed time in milliseconds
    const minutes = Math.floor(totalMilliseconds / 60000); // Minutes
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000); // Seconds
    return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Format as MM:SS:MS
  });

  const formattedMs = useDerivedValue(() => {
    const ms = Math.floor(t.value % 1000); // Milliseconds
    return `.${ms.toString().padStart(3, "0")}`;
  });

  const scaleAnimatedProps = useAnimatedProps(() => {
    //change text of scale in UI thread itself.
    return {
      text: formattedTime.value,
      defaultValue: formattedTime.value,
    };
  });

  const msAnimatedProps = useAnimatedProps(() => {
    return {
      text: formattedMs.value,
      defaultValue: formattedMs.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          style={[styles.scaleText]}
          animatedProps={scaleAnimatedProps}
        />
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          style={[styles.msText]}
          animatedProps={msAnimatedProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: width * 0.05,
    paddingLeft: width * 0.05,
    width: width,
    height: 150,
  },
  scaleText: {
    fontSize: 50,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    color: "#fff",
  },
  msText: {
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    color: "#fff",
  },
});
