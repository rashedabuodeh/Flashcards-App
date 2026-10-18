export type Card = {
  id: string;
  front: string;
  back: string;
};

export type Deck = {
  id: string;
  title: string;
  cards: Card[];
};

export type SessionResult = {
  deckId: string;
  known: string[];
  unknown: string[];
  finishedAt: number;
};
