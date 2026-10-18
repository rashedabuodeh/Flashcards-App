import { Button, StyleSheet, Text, View } from 'react-native';
import { ScreenProps } from '../navigation/types';

export default function ResultsScreen({ navigation, route }: ScreenProps<'Results'>) {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text>Results for: {result.deckId}</Text>
      <Button title="Back to decks" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
