import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionResult } from '../types';

const STORAGE_KEY = 'flashcards:progress';

export type DeckProgress = {
  known: number;
  total: number;
  finishedAt: number;
};

// deckId -> last full-deck session for that deck
export type ProgressMap = Record<string, DeckProgress>;

export async function loadProgress(): Promise<ProgressMap> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as ProgressMap) : {};
  } catch (error) {
    console.warn('Could not load progress', error);
    return {};
  }
}

export async function saveResult(result: SessionResult): Promise<void> {
  const progress = await loadProgress();
  progress[result.deckId] = {
    known: result.known.length,
    total: result.known.length + result.unknown.length,
    finishedAt: result.finishedAt,
  };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Could not save progress', error);
  }
}
