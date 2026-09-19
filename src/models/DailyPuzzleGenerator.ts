import { Direction, DIRECTION_OFFSETS, IllustrationType, LevelData } from '../types';
import { SeededRandom } from './prng';
import { computeTargetCells } from './LevelCatalog';

export interface DailyWordItem {
  word: string;
  icon: string;
  hintText: string;
  illustrationType: IllustrationType;
}

export const DAILY_WORDS_CATALOG: DailyWordItem[] = [
  { word: "APPLE", icon: "🍎", hintText: "Sweet, crunchy red or green fruit!", illustrationType: IllustrationType.APPLE },
  { word: "CAT", icon: "🐱", hintText: "Cute furry feline friend that purrs!", illustrationType: IllustrationType.CAT },
  { word: "FLOWER", icon: "🌸", hintText: "Blooms brightly in sunny spring gardens!", illustrationType: IllustrationType.FLOWER },
  { word: "SUN", icon: "☀️", hintText: "Golden star that lights up our warm sky!", illustrationType: IllustrationType.SUN },
  { word: "FISH", icon: "🐟", hintText: "Swims swiftly through sparkling ocean waves!", illustrationType: IllustrationType.FISH },
  { word: "RAINBOW", icon: "🌈", hintText: "Seven beautiful colours across the cloudy sky!", illustrationType: IllustrationType.RAINBOW },
  { word: "BALLOON", icon: "🎈", hintText: "Floats up high filled with joyful birthday air!", illustrationType: IllustrationType.BALLOON },
  { word: "BUTTERFLY", icon: "🦋", hintText: "Graceful flutterer with colourful painted wings!", illustrationType: IllustrationType.BUTTERFLY },
  { word: "AVOCADO", icon: "🥑", hintText: "Nutritious creamy green fruit with a big round seed!", illustrationType: IllustrationType.AVOCADO },
  { word: "ROCKET", icon: "🚀", hintText: "Zooms past planets towards distant twinkling stars!", illustrationType: IllustrationType.ROCKET },
];

export function getTodayDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayFormattedDisplay(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function dateKeyToSeed(dateKey: string): number {
  const parts = dateKey.split('-').map((p) => parseInt(p, 10));
  if (parts.length === 3 && parts.every((p) => !isNaN(p))) {
    const [year, month, day] = parts;
    return (year * 100003 + month * 10007 + day * 997 + 7919) >>> 0;
  }
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function generateDailyPuzzle(dateKey: string): LevelData {
  const seed = dateKeyToSeed(dateKey);
  const rng = new SeededRandom(seed);

  const wordItem = DAILY_WORDS_CATALOG[rng.nextInt(DAILY_WORDS_CATALOG.length)];
  const word = wordItem.word;

  const minDim = Math.max(5, Math.min(8, word.length + 1));
  const gridRows = minDim;
  const gridCols = minDim;

  const availableDirections = [
    Direction.HORIZONTAL,
    Direction.VERTICAL,
    Direction.DIAGONAL_DOWN,
    Direction.DIAGONAL_UP,
  ];

  const directionsToTry = rng.shuffle(availableDirections);

  let selectedDirection = Direction.HORIZONTAL;
  let selectedStartRow = 0;
  let selectedStartCol = 0;
  let placed = false;

  for (const dir of directionsToTry) {
    const offset = DIRECTION_OFFSETS[dir];
    const minStartRow = offset.dRow < 0 ? word.length - 1 : 0;
    const maxStartRow = offset.dRow > 0 ? gridRows - word.length : gridRows - 1;

    const minStartCol = offset.dCol < 0 ? word.length - 1 : 0;
    const maxStartCol = offset.dCol > 0 ? gridCols - word.length : gridCols - 1;

    if (maxStartRow >= minStartRow && maxStartCol >= minStartCol) {
      const rowRange = maxStartRow - minStartRow + 1;
      const colRange = maxStartCol - minStartCol + 1;
      selectedStartRow = minStartRow + rng.nextInt(rowRange);
      selectedStartCol = minStartCol + rng.nextInt(colRange);
      selectedDirection = dir;
      placed = true;
      break;
    }
  }

  if (!placed) {
    selectedDirection = Direction.HORIZONTAL;
    selectedStartRow = Math.min(Math.floor(gridRows / 2), gridRows - 1);
    selectedStartCol = 0;
  }

  return {
    levelNumber: 9999,
    word,
    icon: wordItem.icon,
    hintText: wordItem.hintText,
    gridRows,
    gridCols,
    startRow: selectedStartRow,
    startCol: selectedStartCol,
    direction: selectedDirection,
    illustrationType: wordItem.illustrationType,
    targetCells: computeTargetCells(selectedStartRow, selectedStartCol, word.length, selectedDirection),
  };
}
