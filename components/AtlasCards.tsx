import React, { useEffect, useReducer } from 'react';
import Animated, { 
    useAnimatedStyle,
    useSharedValue,
    css,
    withDelay,
    CSSAnimationKeyframes,
    useDerivedValue,
  } from 'react-native-reanimated';
import { View } from './Themed';
import { Dimensions, Platform, StyleSheet, Text } from 'react-native';
import { _lightPurple, _lightYellow, _yellow } from "../constants/Colors";
  
  const CARD_COUNT = 40;
  const COLUMNS = 5;
  const isAndroid = Platform.OS =='android'
  
  const { width, height } =  isAndroid ? Dimensions.get("screen") : Dimensions.get("window");

  const cellSize = width * 0.25; // Size of each cell (width & height)
  const spacing = 7; // Spacing between cells

  const CardFrontFlip:CSSAnimationKeyframes = {
    "0%": {
      transform: [
        {
          rotateY: "90deg"
        }
      ],
      backgroundColor: _yellow
    },
    "50%": {
      transform: [
        {
          rotateY: "180deg"
        }
      ],
      backgroundColor: _yellow
    },
    "75%": {
        transform: [
          {
            rotateY: "130deg"
          }
        ],
        backgroundColor: _lightYellow
      },
      "100%": {
        transform: [
          {
            rotateY: "90deg"
          }
        ],
        backgroundColor: _lightPurple
      }
  }


 const icons = ["👻", "🐼", "🦋", "🏀"]
  const CardTemplate =  React.memo(({position, isToggled, startTranslate}: {position: {row: number, col: number}, isToggled: boolean, startTranslate: boolean}) =>{
    const cardPosition = position.row + position.col


    return(
        <>
        <Animated.View
        style={[
            styles.card,
            styles.regularCard,
            {
            perspective: 1000,
            transform: [
                {rotateY: isToggled ? '0deg' :'180deg'},
                {translateX: startTranslate ?  position.row : width + width / 2},
                {translateY: startTranslate ?  position.col : height * (position.col / 100)}
            ],
            backgroundColor: isToggled ? _lightPurple : _yellow,
            transitionDuration: '500ms',
            transitionDelay: `${cardPosition * 100}ms`,
            backfaceVisibility: "hidden"
        }]}
        >    
        </Animated.View>  
      <Animated.View 
        style={[
          styles.card,
          styles.flippedCard,
          {
            justifyContent: "center",
            alignItems: "center"
          },
          {
            perspective: 1000,
            transform: [
                {rotateY: isToggled ? '180deg' :'0deg'},
                {translateX: startTranslate ?  position.row : width + width / 2},
                {translateY: startTranslate ?  position.col : height * (position.col / 100)}
            ],
            backgroundColor: isToggled ? _lightPurple : _yellow, 
            // backgroundColor:  _lightPurple, 
            transitionDuration: '500ms',
            transitionDelay: `${cardPosition * 100}ms`,
            backfaceVisibility: "hidden"
          }
        ]}
      >
        <Text style={{fontSize: 45, lineHeight: 59}}>{icons[Math.floor(Math.random() * 4)]}</Text>
        </Animated.View>
        </>
    )
  })

  
  function AnimatedCard({ index, isToggled, startTranslate }: { index: number, isToggled: boolean, startTranslate: boolean }) {
    const row = Math.floor(index / COLUMNS);
    const col = index % COLUMNS;
  
    return (
        <Animated.View style={{}}> 
        <CardTemplate position={{row: row, col: col}} isToggled={isToggled} startTranslate={startTranslate}/>
  
        </Animated.View>
    );
  }
  
  // Usage
  export default function CardGrid({isToggled}: {isToggled: boolean}) {
      const [startTranslate, toggle] = useReducer((s) => !s, false);
    
    useEffect(() => {
        toggle()
    }, [])

    return (
      <View style={styles.grid}>
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <AnimatedCard key={i} index={i} isToggled={isToggled} startTranslate={startTranslate}/>
        ))}

      </View>
    );
  }
  const styles = StyleSheet.create({
    grid :{
        flexDirection: "row",
        width: width + width  * 0.5,
        flexWrap: "wrap",
        transform: [
            {translateX: -width * 0.17}
        ]
    },
    card: {
        width: cellSize,
            height: cellSize,
            borderRadius: 15,
            // backgroundColor: _yellow,
            margin: 5
    },
    regularCard: {
        position: "absolute",
        zIndex: 1,
      },
      flippedCard: {
        // position: "absolute",
        zIndex: 10,
      },
  })