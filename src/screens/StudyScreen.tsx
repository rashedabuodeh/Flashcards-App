import { Button, StyleSheet, Text, View } from 'react-native';
import { ScreenProps } from '../navigation/types';

export default function StudyScreen({ navigation, route }: ScreenProps<'Study'>) {
  const { deckId } = route.params;

  const finish = () => {
    navigation.replace('Results', {
      result: { deckId, known: [], unknown: [], finishedAt: Date.now() },
      isReview: false,
    });
  };

  return (
    <View style={styles.container}>
      <Text>Studying: {deckId}</Text>
      <Button title="Finish" onPress={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
