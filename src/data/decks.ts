import rawDecks from './decks.json';
import { Deck } from '../types';

export const decks: Deck[] = rawDecks;

export function getDeckById(id: string): Deck | undefined {
  return decks.find((deck) => deck.id === id);
}
