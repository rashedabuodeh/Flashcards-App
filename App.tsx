import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/navigation/types';
import DeckListScreen from './src/screens/DeckListScreen';
import StudyScreen from './src/screens/StudyScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="DeckList" component={DeckListScreen} options={{ title: 'Flashcards' }} />
          <Stack.Screen name="Study" component={StudyScreen} options={{ title: 'Study' }} />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{ title: 'Results', headerBackVisible: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
