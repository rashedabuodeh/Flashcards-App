import { Button, StyleSheet, Text, View } from 'react-native';
import { ScreenProps } from '../navigation/types';

export default function DeckListScreen({ navigation }: ScreenProps<'DeckList'>) {
  return (
    <View style={styles.container}>
      <Text>Deck list</Text>
      <Button title="Open Math" onPress={() => navigation.navigate('Study', { deckId: 'math' })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
