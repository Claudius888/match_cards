import { View } from "@/components/Themed";
import {
  Canvas,
  DiffRect,
  Group,
  rect,
  rrect,
} from "@shopify/react-native-skia";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  FadeInUp,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { AnimatedSvgCard } from "../components/AnimatedSvgCard";
import { _lightPurple } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export default function HomeScreen() {
  const logoAnimation = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    logoAnimation.value = withDelay(1100, withTiming(1, { duration: 2500 }));
  });

  // Define the outer and inner rectangles as rrect objects
  const outer = useDerivedValue(
    () =>
      rrect(
        rect(0, 0, width, height), // Full-screen dimensions
        25, // Corner radius for the outer rectangle
        25
      ),
    []
  );

  const inner = useDerivedValue(() => {
    const widthScale = width - (width - 200) * logoAnimation.value; // Animate width from full screen to 200
    const heightScale = height - (height - 200) * logoAnimation.value; // Animate height from full screen to 200

    const x = (width - widthScale) / 2; // Center the rectangle horizontally
    const y = (height - heightScale) / 2.5; // Center the rectangle vertically

    return rrect(
      rect(x, y, widthScale, heightScale), // Dynamically calculate size and position
      15, // Corner radius for the inner rectangle
      15
    );
  }, [logoAnimation]);

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1, backgroundColor: "#000" }}>
        <Group>
          {Array.from({ length: 40 }).map((item, index) => (
            <AnimatedSvgCard index={index} key={`item-${index}`} />
          ))}
        </Group>
        <DiffRect outer={outer} inner={inner}></DiffRect>
      </Canvas>
      <Animated.Text
        style={{
          position: "absolute",
          zIndex: 100,
          color: "#fff",
          fontSize: 50,
          top: "55%",
          left: "20%",
        }}
        entering={FadeInUp.springify().damping(80).stiffness(100).delay(3750)}
      >
        Match Cards
      </Animated.Text>
      <AnimatedPressable
        onPress={() => router.push("/game")}
        entering={ZoomIn.delay(3750).springify().damping(80).stiffness(200)}
        style={[
          {
            position: "absolute",
            top: "70%",
            left: "25%",
            borderRadius: width * 0.05,
            width: width * 0.5,
            height: height * 0.1,
            backgroundColor: _lightPurple,
            justifyContent: "center",
            alignItems: "center",
          },
          styles.boxShadow,
        ]}
      >
        <Text style={{ fontSize: 30, fontWeight: "600" }}>Start</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: _lightPurple,
    shadowOffset: { width: 10, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 16,
  },
});
