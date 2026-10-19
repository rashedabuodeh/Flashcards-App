import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDeckById } from '../data/decks';
import { ScreenProps } from '../navigation/types';
import { common } from '../styles/common';
import { colors, fontSize, spacing } from '../theme';

function messageFor(percent: number): string {
  if (percent === 100) return 'Perfect!';
  if (percent >= 80) return 'Great job!';
  if (percent >= 50) return 'Getting there.';
  return 'Keep practicing.';
}

export default function ResultsScreen({ navigation, route }: ScreenProps<'Results'>) {
  const { result, isReview } = route.params;
  const deck = getDeckById(result.deckId);

  const total = result.known.length + result.unknown.length;
  const percent = total === 0 ? 0 : Math.round((result.known.length / total) * 100);
  const missedCards = deck?.cards.filter((card) => result.unknown.includes(card.id)) ?? [];

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.screenContent}>
      <Text style={[common.muted, common.textCenter, styles.deckTitle]}>
        {deck?.title ?? result.deckId}
        {isReview ? ' · Review' : ''}
      </Text>
      <Text style={[common.textCenter, styles.percent]}>{percent}%</Text>
      <Text style={[common.body, common.textCenter]}>
        {result.known.length} of {total} correct · {messageFor(percent)}
      </Text>

      {missedCards.length > 0 && (
        <View style={common.card}>
          <Text style={common.heading}>Cards you missed</Text>
          {missedCards.map((card) => (
            <View key={card.id} style={styles.missedRow}>
              <Text style={[common.body, styles.missedFront]}>{card.front}</Text>
              <Text style={[common.body, styles.missedBack]}>{card.back}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {missedCards.length > 0 && (
          <Pressable
            style={({ pressed }) => [common.button, common.buttonPrimary, pressed && common.pressed]}
            onPress={() =>
              navigation.replace('Study', { deckId: result.deckId, cardIds: result.unknown })
            }
          >
            <Text style={common.buttonText}>Review missed ({missedCards.length})</Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [common.button, common.buttonSecondary, pressed && common.pressed]}
          onPress={() => navigation.replace('Study', { deckId: result.deckId })}
        >
          <Text style={[common.buttonText, common.buttonTextSecondary]}>Study whole deck again</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [common.button, common.buttonSecondary, pressed && common.pressed]}
          onPress={() => navigation.popToTop()}
        >
          <Text style={[common.buttonText, common.buttonTextSecondary]}>Back to decks</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deckTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  percent: {
    fontSize: fontSize.display,
    fontWeight: '800',
    color: colors.primary,
  },
  missedRow: {
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  missedFront: {
    fontWeight: '600',
  },
  missedBack: {
    color: colors.success,
  },
  actions: {
    gap: spacing.sm,
  },
});
