Flashcards App

A simple, interactive flashcard study app built with React Native, Expo, and TypeScript.

Flashcards App helps users practice recall through animated cards, intuitive swipe gestures, and immediate study feedback. Choose a subject, flip each card to reveal the answer, and track how many questions you knew. After a session, review only the cards you missed to focus on what needs more practice.

Features

- Subject-based decks: Ready-to-study Math, Science, and English decks with 10 questions each.
- 3D card flips: Tap a card to reveal its answer with a smooth, animated flip.
- Swipe-to-answer interaction: Swipe right for Got it or left for Missed it. Answer buttons are also available after flipping the card.
- Randomized sessions: Cards are shuffled when a study session begins.
- Live session progress: See your current card number and progress bar as you study.
- Results summary: View your score, number of correct answers, and the questions you missed.
- Focused review: Retry missed cards without repeating the whole deck, or restart a full study session.
- Locally saved scores: The latest completed full-deck score for each subject is stored on the device and shown on the deck list.

«Note: The History deck currently contains no cards and is a placeholder for future content.»

Tech Stack

Technology| Purpose
React Native| Cross-platform mobile UI
Expo (SDK 57)| App development and tooling
TypeScript| Type-safe application code
React Navigation| Native-stack screen navigation
React Native Reanimated| Animated 3D flips and card movement
React Native Gesture Handler| Tap and swipe gesture recognition
AsyncStorage| Persistent on-device study scores

How It Works

1. Select a deck from the home screen.
2. Read the question on the front of each card.
3. Tap to flip the card and reveal the answer.
4. Swipe right if you knew the answer, or left if you missed it. You can also use the on-screen buttons.
5. Check your results at the end of the session.
6. Review missed cards, study the entire deck again, or return to the deck list.


Project Structure

Flashcards-App/
├── assets/                    # App icons and other static assets
├── src/
│   ├── components/
│   │   ├── FlipCard.tsx       # Animated question/answer flip
│   │   └── SwipeCard.tsx      # Swipe gesture and card exit animations
│   ├── data/
│   │   ├── decks.json        # Flashcard deck content
│   │   └── decks.ts          # Deck loading and lookup
│   ├── navigation/
│   │   └── types.ts          # Typed navigation parameters
│   ├── screens/
│   │   ├── DeckListScreen.tsx # Available decks and saved scores
│   │   ├── StudyScreen.tsx    # Flashcard study session
│   │   └── ResultsScreen.tsx  # Score and missed-card review
│   ├── storage/
│   │   └── progress.ts       # AsyncStorage persistence
│   ├── styles/               # Shared styling
│   ├── theme.ts              # Colors and design tokens
│   ├── types.ts              # Card, deck, and session types
│   └── utils/                # Utility functions
├── App.tsx                   # App navigation and providers
├── app.json                  # Expo configuration
├── index.ts                  # Application entry point
└── package.json              # Dependencies and scripts

Customize the Flashcards

Deck content is defined in ""src/data/decks.json"" (src/data/decks.json). To add questions or introduce another subject, edit that file using this structure:

{
  "id": "new-subject",
  "title": "New Subject",
  "cards": [
    {
      "id": "new-subject-1",
      "front": "Your question here",
      "back": "Your answer here"
    }
  ]
}

Add this object to the top-level array in "decks.json". Give each deck and card a unique "id".

Progress Storage

The app uses AsyncStorage to save the most recent completed full-deck result for each subject on the current device. Scores update on the deck list when you return from studying.

Missed-card review sessions do not overwrite full-deck scores. Progress is stored locally, with no account or cloud sync.

---

Developed by "Rashed Abuodeh" (https://github.com/rashedabuodeh)