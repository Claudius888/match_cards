import {
  Extrapolate,
  Group,
  ImageSVG,
  interpolate,
  interpolateColors,
  RoundedRect,
  Skia,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { _lightPurple, _lightYellow, _yellow } from "../constants/Colors";
import { svg_string } from "../constants/svg_string";
const { width, height } = Dimensions.get("window");

type SvgCard = {
  index: number;
};

export function AnimatedSvgCard({ index }: SvgCard) {
  const rotationY = useSharedValue(0); // Shared value for Y-axis rotation

  const animatedStyle = useDerivedValue(() => {
    return [
      // { perspective: 1000 }, // Adds depth for the 3D effect
      {
        rotateY: rotationY.value >= 0.5 ? (rotationY.value - 0.5) * Math.PI : 0,
      }, // Rotate along the Y-axis
      {
        rotateZ: interpolate(
          rotationY.value,
          [0.1, 0.25, 0.4],
          [Math.PI / 4, Math.PI / 2, 0],
          Extrapolate.CLAMP
        ),
      },
    ];
  });

  const reverseAnimatedStyle = useDerivedValue(() => {
    return [
      // { perspective: 1000 }, // Adds depth for the 3D effect
      {
        rotateY:
          rotationY.value >= 0.5 ? (1 - rotationY.value) * Math.PI : Math.PI,
      }, // Rotate along the Y-axis
      {
        rotateZ: interpolate(
          rotationY.value,
          [0.1, 0.25, 0.4],
          [Math.PI / 4, Math.PI / 2, 0],
          Extrapolate.CLAMP
        ),
      },
    ];
  });

  const animateColor = useDerivedValue(() => {
    return interpolateColors(
      rotationY.value,
      [0, 0.5, 0.8, 1],
      [_yellow, _yellow, _lightYellow, _lightPurple]
    );
  });

  const animateColorRev = useDerivedValue(() => {
    return interpolateColors(
      rotationY.value,
      [0, 0.5, 0.8, 1],
      [_yellow, _yellow, _lightYellow, _lightPurple]
    );
  });

  useEffect(() => {
    // Calculate row and column based on index
    const row = Math.floor(index / numColumns); // Current row (0-based)
    const col = index % numColumns; // Current column (0-based)

    rotationY.value = withSequence(
      withDelay((row + col) * 100, withTiming(0.5, { duration: 500 })),
      withDelay((row + col) * 100, withTiming(1, { duration: 250 }))
    );

    if (index === 17) {
      rotationY.value = withSequence(
        withDelay((row + col) * 100, withTiming(0.5, { duration: 500 })),
        withDelay((row + col) * 100, withTiming(1, { duration: 250 })),
        withDelay(1000, withTiming(0.5, { duration: 500 }))
      );
    }
  }, []);

  const emojiT = useMemo(() => {
    const ids: string[] = Object.entries(svg_string).map(([key]) => key);
    const svg: string = ids[Math.floor(Math.random() * ids.length)];
    return Skia.SVG.MakeFromString(svg_string[svg]);
  }, [])!;

  const numColumns = 5; // Number of columns
  const numRows = 6; // Number of rows
  const cellSize = width * 0.25; // Size of each cell (width & height)
  const spacing = 7; // Spacing between cells

  // Calculate row and column based on index
  const row = Math.floor(index / numColumns); // Current row (0-based)
  const col = index % numColumns; // Current column (0-based)

  // Calculate x and y positions
  const x = -(cellSize / 2) + col * (cellSize + spacing); // X-position based on column
  const y = row * (cellSize + spacing);

  const groupX = col;
  const groupY = row;

  const midpoint = (cellSize + spacing) / 2;

  const animateX = useDerivedValue(() => {
    return [
      {
        translateX: interpolate(
          rotationY.value,
          [0, 0.5],
          [width + width / 2, groupX],
          Extrapolate.CLAMP
        ),
      },
      {
        translateY: interpolate(
          rotationY.value,
          [0, 0.5],
          [height * (col / 100), groupY],
          Extrapolate.CLAMP
        ),
      },
    ];
  });

  return (
    <React.Fragment key={`frag-${index}`}>
      <Group
        key={`grp-${index}`}
        transform={animateX}
        origin={{ x: width, y: height / 2 }}
      >
        <RoundedRect
          origin={{ x: x + midpoint, y: y + midpoint }}
          key={`rev_bg_sq${index}`}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          r={15}
          color={animateColorRev}
          transform={animatedStyle}
        ></RoundedRect>
        <RoundedRect
          origin={{ x: x + midpoint, y: y + midpoint }}
          key={`bg_sq${index}`}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          r={15}
          color={animateColor}
          transform={reverseAnimatedStyle}
        />
        <ImageSVG
          origin={{ x: x + midpoint / 2.5, y: y + midpoint / 2.5 }}
          svg={emojiT}
          height={72}
          width={72}
          transform={animatedStyle}
          x={x + midpoint / 2.5} // Center the text inside the rectangle horizontally
          y={y + midpoint / 2.5} // Center the text inside the rectangle vertically
        />
      </Group>
    </React.Fragment>
  );
}
