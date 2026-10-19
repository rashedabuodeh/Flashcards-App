import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { decks } from '../data/decks';
import { ScreenProps } from '../navigation/types';
import { loadProgress, ProgressMap } from '../storage/progress';
import { common } from '../styles/common';
import { colors } from '../theme';

export default function DeckListScreen({ navigation }: ScreenProps<'DeckList'>) {
  const [progress, setProgress] = useState<ProgressMap>({});

  // Re-read saved scores every time this screen comes back into view
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadProgress().then((saved) => {
        if (active) setProgress(saved);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <FlatList
      style={common.screen}
      contentContainerStyle={common.screenContent}
      data={decks}
      keyExtractor={(deck) => deck.id}
      renderItem={({ item: deck }) => {
        const last = progress[deck.id];
        return (
          <Pressable
            style={({ pressed }) => [common.card, pressed && common.pressed]}
            onPress={() => navigation.navigate('Study', { deckId: deck.id })}
          >
            <View style={common.rowBetween}>
              <Text style={common.title}>{deck.title}</Text>
              <Text style={common.muted}>{deck.cards.length} cards</Text>
            </View>
            <Text style={[common.muted, styles.score]}>
              {last
                ? `Last score: ${Math.round((last.known / last.total) * 100)}% (${last.known}/${last.total})`
                : 'Not studied yet'}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  score: {
    color: colors.primary,
  },
});
