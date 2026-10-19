import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FlipCard from '../components/FlipCard';
import SwipeCard, { SwipeCardHandle } from '../components/SwipeCard';
import { getDeckById } from '../data/decks';
import { ScreenProps } from '../navigation/types';
import { saveResult } from '../storage/progress';
import { common } from '../styles/common';
import { colors, radius, spacing } from '../theme';
import { SessionResult } from '../types';
import { shuffle } from '../utils/shuffle';

export default function StudyScreen({ navigation, route }: ScreenProps<'Study'>) {
  const { deckId, cardIds } = route.params;
  const deck = getDeckById(deckId);
  const isReview = cardIds !== undefined;

  // The function form runs only on the first render, so the order stays fixed for the session
  const [cards] = useState(() => {
    const all = deck?.cards ?? [];
    return shuffle(cardIds ? all.filter((card) => cardIds.includes(card.id)) : all);
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const swipeRef = useRef<SwipeCardHandle>(null);

  if (cards.length === 0) {
    return (
      <View style={[common.screen, common.center]}>
        <Text style={common.muted}>No cards to study.</Text>
      </View>
    );
  }

  const card = cards[index];

  const answer = async (gotIt: boolean) => {
    const nextKnown = gotIt ? [...known, card.id] : known;
    const nextUnknown = gotIt ? unknown : [...unknown, card.id];

    if (index + 1 < cards.length) {
      setKnown(nextKnown);
      setUnknown(nextUnknown);
      setIndex(index + 1);
      setFlipped(false);
      return;
    }

    const result: SessionResult = {
      deckId,
      known: nextKnown,
      unknown: nextUnknown,
      finishedAt: Date.now(),
    };
    // Review sessions only cover the missed cards, so saving them would skew the deck score
    if (!isReview) {
      await saveResult(result);
    }
    navigation.replace('Results', { result, isReview });
  };

  return (
    <View style={[common.screen, common.screenContent]}>
      <Text style={[common.muted, common.textCenter]}>
        Card {index + 1} of {cards.length}
        {isReview ? ' · Review' : ''}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(index / cards.length) * 100}%` }]} />
      </View>

      {/* key gives every card a fresh SwipeCard + FlipCard, so it starts centered and face-down */}
      <SwipeCard
        key={card.id}
        ref={swipeRef}
        onTap={() => setFlipped((f) => !f)}
        onSwiped={(direction) => answer(direction === 'right')}
      >
        <FlipCard front={card.front} back={card.back} flipped={flipped} />
      </SwipeCard>

      {flipped ? (
        <View style={[common.row, styles.answerRow]}>
          <Pressable
            style={({ pressed }) => [
              common.button,
              common.buttonDanger,
              styles.answerButton,
              pressed && common.pressed,
            ]}
            onPress={() => swipeRef.current?.swipe('left')}
          >
            <Text style={common.buttonText}>Missed it</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              common.button,
              common.buttonSuccess,
              styles.answerButton,
              pressed && common.pressed,
            ]}
            onPress={() => swipeRef.current?.swipe('right')}
          >
            <Text style={common.buttonText}>Got it</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={[common.muted, common.textCenter, styles.instructions]}>
          Tap to flip · Swipe right if you knew it, left if you missed it
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  answerRow: {
    gap: spacing.md,
  },
  answerButton: {
    flex: 1,
  },
  instructions: {
    paddingVertical: spacing.md,
  },
});
