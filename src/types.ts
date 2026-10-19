export type Card = {
  id: string;
  front: string; // question
  back: string;  // answer
};

export type Deck = {
  id: string;
  title: string;
  cards: Card[];
};

export type SessionResult = {
  deckId: string;
  known: string[]; // card ids
  unknown: string[]; // card ids
  finishedAt: number;
};
