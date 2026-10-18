import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SessionResult } from '../types';

export type RootStackParamList = {
  DeckList: undefined;
  // cardIds is only set for "Review missed" sessions
  Study: { deckId: string; cardIds?: string[] };
  Results: { result: SessionResult; isReview: boolean };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
