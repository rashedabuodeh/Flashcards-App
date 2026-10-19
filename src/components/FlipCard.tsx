import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontSize, radius, spacing } from '../theme';

type Props = {
  front: string;
  back: string;
  flipped: boolean;
};

// Distance of the "camera" from the card. Smaller = stronger 3D depth.
const PERSPECTIVE = 800;
// How dark a face gets when it is edge-on (turned away from the light)
const MAX_SHADE = 0.35;

export default function FlipCard({ front, back, flipped }: Props) {
  // 0 = front showing, 180 = back showing
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(flipped ? 180 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [flipped, rotation]);

  // The card lifts slightly toward you halfway through the turn, like a real card being flipped
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(rotation.value, [0, 90, 180], [1, 1.06, 1]) }],
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: PERSPECTIVE }, { rotateY: `${rotation.value}deg` }],
    // Hide each face once it turns past 90° (backfaceVisibility alone is unreliable on Android)
    opacity: rotation.value < 90 ? 1 : 0,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: PERSPECTIVE }, { rotateY: `${rotation.value + 180}deg` }],
    opacity: rotation.value < 90 ? 0 : 1,
  }));

  // Each face darkens as it turns edge-on, which is what makes the turn read as 3D
  const frontShade = useAnimatedStyle(() => ({
    opacity: interpolate(rotation.value, [0, 90], [0, MAX_SHADE], Extrapolation.CLAMP),
  }));
  const backShade = useAnimatedStyle(() => ({
    opacity: interpolate(rotation.value, [90, 180], [MAX_SHADE, 0], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={[styles.container, liftStyle]}>
      <Animated.View style={[styles.face, frontStyle]}>
        <Text style={styles.label}>Question</Text>
        <Text style={styles.text}>{front}</Text>
        <Text style={styles.hint}>Tap to flip</Text>
        <Animated.View style={[styles.shade, frontShade]} />
      </Animated.View>
      <Animated.View style={[styles.face, styles.backFace, backStyle]}>
        <Text style={styles.label}>Answer</Text>
        <Text style={styles.text}>{back}</Text>
        <Animated.View style={[styles.shade, backShade]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 320,
  },
  face: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  backFace: {
    backgroundColor: colors.primarySoft,
  },
  shade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    pointerEvents: 'none',
  },
  label: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.muted,
  },
  text: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
  },
  hint: {
    position: 'absolute',
    bottom: spacing.md,
    fontSize: fontSize.xs,
    color: colors.muted,
  },
});
