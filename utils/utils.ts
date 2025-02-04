/* eslint-disable no-underscore-dangle */
import { makeMutable } from 'react-native-reanimated';

import type { AnyFunction } from './coreTypes';

const RUNNING_INTERVALS = makeMutable<Record<string, boolean>>({});
const INTERVAL_ID = makeMutable(0);

export type AnimatedIntervalID = number;

export function setAnimatedInterval<F extends AnyFunction>(
  callback: F,
  interval: number
): AnimatedIntervalID {
  'worklet';
  let startTimestamp: number;

  const currentId = INTERVAL_ID.value;
  RUNNING_INTERVALS.value[currentId] = true;
  INTERVAL_ID.value += 1;

  const step = (newTimestamp: number) => {
    if (!RUNNING_INTERVALS.value[currentId]) {
      return;
    }
    if (startTimestamp === undefined) {
      startTimestamp = newTimestamp;
    }
    if (newTimestamp >= startTimestamp + interval) {
      startTimestamp = newTimestamp;
      callback();
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  return currentId;
}

export function clearAnimatedInterval(handle: AnimatedIntervalID): void {
  'worklet';
  RUNNING_INTERVALS.modify(runningIntervals => {
    'worklet';
    delete runningIntervals[handle];
    return runningIntervals;
  });
}

export const generateCardPairs = (emojiList: string[]) => {
  // console.log(emojiList)
  // Step 1: Duplicate the emojis to make pairs
  const cardPairs = [...emojiList, ...emojiList, "🙊"];

  // Step 2: Shuffle the array using Fisher-Yates algorithm
  for (let i = cardPairs.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[randomIndex]] = [cardPairs[randomIndex], cardPairs[i]];
  }

  // Step 3: Map shuffled emojis to a card object array
  const cards = cardPairs.map((emoji, index) => ({
    id: index,
    emoji: emoji,
    isMatched: false, // to track whether the card has been matched
    isFlipped: false, // to track whether the card is currently flipped
  }));

  return cards;
}