# PRINCE2 Trainer App

## Tech Stack
- Expo SDK 54+ met TypeScript
- Expo Router (file-based routing)
- NativeWind v4 (Tailwind CSS voor React Native)
- Zustand (state management)
- AsyncStorage (lokale opslag)

## Project Structuur
```
prince2/
├── app/               # Expo Router schermen
│   ├── _layout.tsx    # Root layout
│   ├── index.tsx      # Home scherm
│   ├── quiz.tsx       # Quiz scherm
│   └── result.tsx     # Resultaat scherm
├── components/        # Herbruikbare UI componenten
│   ├── OptionButton.tsx
│   ├── ProgressBar.tsx
│   └── QuestionCard.tsx
├── data/
│   └── vragen.json    # PRINCE2 examenvragen
├── store/
│   └── quizStore.ts   # Zustand state
├── types/
│   └── index.ts       # TypeScript interfaces
└── utils/
    └── shuffle.ts     # Helper functies
```

## Conventies
- Nederlandse UI teksten, Engelse code/comments
- Mobile-first design
- TypeScript strict mode
- Functional components met hooks

## Starten
```bash
cd C:\prince2
npx expo start
```

## Vragen Toevoegen
Voeg nieuwe vragen toe aan `data/vragen.json` in dit format:
```json
{
  "id": 11,
  "vraag": "Je vraag hier?",
  "opties": {
    "A": "Optie A",
    "B": "Optie B",
    "C": "Optie C",
    "D": "Optie D"
  },
  "correct": "B",
  "uitleg": "Uitleg waarom B correct is.",
  "thema": "Thema naam"
}
```

## PRINCE2 Thema's
- Business Case
- Organisatie
- Kwaliteit
- Plannen
- Risico
- Wijziging
- Voortgang
- Processen
- Principes
