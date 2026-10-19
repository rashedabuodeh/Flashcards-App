import { ReactNode, Ref, useImperativeHandle } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors, fontSize, radius, spacing } from '../theme';

export type SwipeDirection = 'left' | 'right';

// Lets the parent throw the card away from code, e.g. from the Got it / Missed it buttons
export type SwipeCardHandle = {
  swipe: (direction: SwipeDirection) => void;
};

type Props = {
  children: ReactNode;
  onTap: () => void;
  onSwiped: (direction: SwipeDirection) => void;
  ref?: Ref<SwipeCardHandle>;
};

const MAX_TILT = 12; // degrees of tilt when dragged a full screen width
const FLY_OUT_DURATION = 250;

export default function SwipeCard({ children, onTap, onSwiped, ref }: Props) {
  const { width } = useWindowDimensions();
  // How far the card has to travel (including the fling) to count as an answer
  const threshold = width * 0.3;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  // Set once the card starts leaving, so one card can never be answered twice
  const gone = useSharedValue(false);

  const flyOut = (direction: SwipeDirection) => {
    'worklet';
    if (gone.value) return;
    gone.value = true;
    const toX = (direction === 'right' ? 1 : -1) * width * 1.5;
    // Keep going along the same diagonal the finger was moving on
    translateY.value = withTiming(translateY.value * 2, { duration: FLY_OUT_DURATION });
    translateX.value = withTiming(toX, { duration: FLY_OUT_DURATION }, (finished) => {
      if (finished) scheduleOnRN(onSwiped, direction);
    });
  };

  useImperativeHandle(ref, () => ({ swipe: flyOut }));

  const pan = Gesture.Pan()
    // Only start on a sideways drag, so a plain tap still flips the card
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (gone.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (gone.value) return;
      // Where the card would end up if it kept its speed for a moment, so a quick flick counts too
      const projectedX = event.translationX + event.velocityX * 0.2;
      if (projectedX > threshold) {
        flyOut('right');
      } else if (projectedX < -threshold) {
        flyOut('left');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    scheduleOnRN(onTap);
  });

  // Whichever gesture is recognized first wins: a drag swipes, a quick touch flips
  const gesture = Gesture.Race(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${interpolate(translateX.value, [-width, 0, width], [-MAX_TILT, 0, MAX_TILT])}deg` },
    ],
  }));

  const knownLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, threshold], [0, 1], Extrapolation.CLAMP),
  }));
  const missedLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-threshold, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View entering={FadeIn.duration(200)} style={cardStyle}>
        {children}
        <Animated.View style={[styles.label, styles.knownLabel, knownLabelStyle]}>
          <Text style={[styles.labelText, styles.knownText]}>Got it</Text>
        </Animated.View>
        <Animated.View style={[styles.label, styles.missedLabel, missedLabelStyle]}>
          <Text style={[styles.labelText, styles.missedText]}>Missed</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 3,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  knownLabel: {
    left: spacing.lg,
    borderColor: colors.success,
    transform: [{ rotate: '-12deg' }],
  },
  missedLabel: {
    right: spacing.lg,
    borderColor: colors.danger,
    transform: [{ rotate: '12deg' }],
  },
  labelText: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  knownText: {
    color: colors.success,
  },
  missedText: {
    color: colors.danger,
  },
});
