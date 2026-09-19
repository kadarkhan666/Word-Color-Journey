import { Direction, DIRECTION_OFFSETS, IllustrationType, LevelData } from '../types';
import { SeededRandom } from './prng';

export interface WordDefinition {
  word: string;
  icon: string;
  hintText: string;
  illustrationType: IllustrationType;
}

export const LEVEL_WORDS: WordDefinition[] = [
  // 1 - 10: Original Classics
  { word: "APPLE", icon: "🍎", hintText: "A sweet, crunchy red fruit!", illustrationType: IllustrationType.APPLE },
  { word: "CAT", icon: "🐱", hintText: "A cute furry friend that says meow!", illustrationType: IllustrationType.CAT },
  { word: "FLOWER", icon: "🌸", hintText: "Blooms in spring with colourful petals!", illustrationType: IllustrationType.FLOWER },
  { word: "SUN", icon: "☀️", hintText: "Shines bright and warm in the sky!", illustrationType: IllustrationType.SUN },
  { word: "FISH", icon: "🐟", hintText: "Swims gracefully under the blue sea!", illustrationType: IllustrationType.FISH },
  { word: "RAINBOW", icon: "🌈", hintText: "Magical colours after the rain!", illustrationType: IllustrationType.RAINBOW },
  { word: "BALLOON", icon: "🎈", hintText: "Floats high in the air at parties!", illustrationType: IllustrationType.BALLOON },
  { word: "BUTTERFLY", icon: "🦋", hintText: "Flutters gently with painted wings!", illustrationType: IllustrationType.BUTTERFLY },
  { word: "AVOCADO", icon: "🥑", hintText: "Creamy green fruit with a round seed!", illustrationType: IllustrationType.AVOCADO },
  { word: "ROCKET", icon: "🚀", hintText: "Zooms into outer space to the stars!", illustrationType: IllustrationType.ROCKET },

  // 11 - 20: Animals & Pets
  { word: "DOG", icon: "🐶", hintText: "Loyal furry best friend that barks!", illustrationType: IllustrationType.CAT },
  { word: "BIRD", icon: "🐦", hintText: "Sings sweet morning songs on trees!", illustrationType: IllustrationType.BUTTERFLY },
  { word: "LION", icon: "🦁", hintText: "The brave king of the golden savanna!", illustrationType: IllustrationType.CAT },
  { word: "PANDA", icon: "🐼", hintText: "Gentle bear that loves chewing bamboo!", illustrationType: IllustrationType.CAT },
  { word: "BEE", icon: "🐝", hintText: "Buzzes near blooms collecting honey!", illustrationType: IllustrationType.FLOWER },
  { word: "DUCK", icon: "🦆", hintText: "Quacks happily paddling on the pond!", illustrationType: IllustrationType.FISH },
  { word: "FROG", icon: "🐸", hintText: "Hops over green lily pads in the lake!", illustrationType: IllustrationType.FISH },
  { word: "TIGER", icon: "🐯", hintText: "Strong big cat with bold orange stripes!", illustrationType: IllustrationType.CAT },
  { word: "HORSE", icon: "🐴", hintText: "Gallops fast across lush open fields!", illustrationType: IllustrationType.CAT },
  { word: "WHALE", icon: "🐋", hintText: "Majestic giant swimming deep in oceans!", illustrationType: IllustrationType.FISH },

  // 21 - 30: Nature & Sky
  { word: "TREE", icon: "🌳", hintText: "Tall leafy canopy providing cool shade!", illustrationType: IllustrationType.FLOWER },
  { word: "MOON", icon: "🌙", hintText: "Glows gently in the starry night sky!", illustrationType: IllustrationType.SUN },
  { word: "STAR", icon: "⭐", hintText: "Twinkles brightly from millions of miles!", illustrationType: IllustrationType.SUN },
  { word: "CLOUD", icon: "☁️", hintText: "Soft puffy white cotton ball in the sky!", illustrationType: IllustrationType.RAINBOW },
  { word: "LEAF", icon: "🍃", hintText: "Dances in the crisp autumn breeze!", illustrationType: IllustrationType.FLOWER },
  { word: "RIVER", icon: "🌊", hintText: "Clear sparkling stream flowing downhill!", illustrationType: IllustrationType.FISH },
  { word: "RAIN", icon: "🌧️", hintText: "Pattering drops watering thirsty garden soil!", illustrationType: IllustrationType.RAINBOW },
  { word: "SNOW", icon: "❄️", hintText: "Delicate icy flakes creating winter magic!", illustrationType: IllustrationType.RAINBOW },
  { word: "WIND", icon: "💨", hintText: "Invisible breeze that turns paper pinwheels!", illustrationType: IllustrationType.BALLOON },
  { word: "BEACH", icon: "🏖️", hintText: "Golden sand warm under the summer sun!", illustrationType: IllustrationType.SUN },

  // 31 - 40: Fruits & Berries
  { word: "BANANA", icon: "🍌", hintText: "Sweet yellow energy treat monkeys love!", illustrationType: IllustrationType.APPLE },
  { word: "CHERRY", icon: "🍒", hintText: "Pair of glossy red jewels on a stem!", illustrationType: IllustrationType.APPLE },
  { word: "ORANGE", icon: "🍊", hintText: "Juicy citrus slice bursting with vitamin C!", illustrationType: IllustrationType.APPLE },
  { word: "GRAPE", icon: "🍇", hintText: "Plump sweet cluster growing on vineyard vines!", illustrationType: IllustrationType.APPLE },
  { word: "LEMON", icon: "🍋", hintText: "Zesty yellow fruit that gives lemonade kick!", illustrationType: IllustrationType.APPLE },
  { word: "PEACH", icon: "🍑", hintText: "Velvety fuzzy sweet summer delicacy!", illustrationType: IllustrationType.APPLE },
  { word: "PEAR", icon: "🍐", hintText: "Bell-shaped juicy fruit with golden skin!", illustrationType: IllustrationType.APPLE },
  { word: "BERRY", icon: "🍓", hintText: "Tiny sweet fruit packed with woodland flavour!", illustrationType: IllustrationType.APPLE },
  { word: "MELON", icon: "🍈", hintText: "Refreshing cool melon on a picnic blanket!", illustrationType: IllustrationType.AVOCADO },
  { word: "MANGO", icon: "🥭", hintText: "Tropical king of sweetness and aroma!", illustrationType: IllustrationType.AVOCADO },

  // 41 - 50: Fun Toys & Celebration
  { word: "KITE", icon: "🪁", hintText: "Soars and loops high against blue clouds!", illustrationType: IllustrationType.BALLOON },
  { word: "DRUM", icon: "🥁", hintText: "Bangs the joyful rhythm of school bands!", illustrationType: IllustrationType.BALLOON },
  { word: "BELL", icon: "🔔", hintText: "Rings clearly to gather everyone together!", illustrationType: IllustrationType.FLOWER },
  { word: "GIFT", icon: "🎁", hintText: "Wrapped in colorful paper with a big ribbon!", illustrationType: IllustrationType.BALLOON },
  { word: "BALL", icon: "⚽", hintText: "Bounces across playgrounds and sunny courts!", illustrationType: IllustrationType.BALLOON },
  { word: "CAKE", icon: "🎂", hintText: "Sweet celebration dessert with birthday candles!", illustrationType: IllustrationType.BALLOON },
  { word: "COOKIE", icon: "🍪", hintText: "Baked treat loaded with chocolate chips!", illustrationType: IllustrationType.APPLE },
  { word: "CANDY", icon: "🍬", hintText: "Delicious sugary wrapper full of sweetness!", illustrationType: IllustrationType.BALLOON },
  { word: "PIZZA", icon: "🍕", hintText: "Cheesy slice fresh from the stone oven!", illustrationType: IllustrationType.AVOCADO },
  { word: "JUICE", icon: "🧃", hintText: "Chilled fruity drink with a paper straw!", illustrationType: IllustrationType.APPLE },

  // 51 - 60: Ocean & Waters
  { word: "SHARK", icon: "🦈", hintText: "Swift ocean swimmer with a dorsal fin!", illustrationType: IllustrationType.FISH },
  { word: "CRAB", icon: "🦀", hintText: "Walks sideways with clicking red pincers!", illustrationType: IllustrationType.FISH },
  { word: "CORAL", icon: "🪸", hintText: "Vibrant underwater home for playful fish!", illustrationType: IllustrationType.FISH },
  { word: "SHELL", icon: "🐚", hintText: "Treasured ocean souvenir found on sandy shore!", illustrationType: IllustrationType.FISH },
  { word: "BOAT", icon: "⛵", hintText: "Sails smoothly across peaceful rippling bays!", illustrationType: IllustrationType.FISH },
  { word: "WAVE", icon: "🌊", hintText: "Curls and crashes into sparkling white foam!", illustrationType: IllustrationType.FISH },
  { word: "TURTLE", icon: "🐢", hintText: "Glides gracefully through coral sea reefs!", illustrationType: IllustrationType.FISH },
  { word: "ISLAND", icon: "🏝️", hintText: "Tropical haven shaded by coconut palms!", illustrationType: IllustrationType.SUN },
  { word: "DOLPHIN", icon: "🐬", hintText: "Clever friendly sea acrobat leaping waves!", illustrationType: IllustrationType.FISH },
  { word: "OCTOPUS", icon: "🐙", hintText: "Eight clever tentacles exploring tide pools!", illustrationType: IllustrationType.FISH },

  // 61 - 70: Cosmos & Exploration
  { word: "PLANET", icon: "🪐", hintText: "Giant world spinning around the sun!", illustrationType: IllustrationType.ROCKET },
  { word: "COMET", icon: "☄️", hintText: "Cosmic snowball blazing a glowing tail!", illustrationType: IllustrationType.ROCKET },
  { word: "EARTH", icon: "🌍", hintText: "Our beautiful blue home in the universe!", illustrationType: IllustrationType.ROCKET },
  { word: "MARS", icon: "🔴", hintText: "The intriguing red planet in starry night!", illustrationType: IllustrationType.ROCKET },
  { word: "ORBIT", icon: "🛰️", hintText: "Looping path celestial objects travel on!", illustrationType: IllustrationType.ROCKET },
  { word: "GALAXY", icon: "🌌", hintText: "Spiralling ocean of billions of bright stars!", illustrationType: IllustrationType.ROCKET },
  { word: "METEOR", icon: "🌠", hintText: "Shooting light making wishes come true!", illustrationType: IllustrationType.ROCKET },
  { word: "ALIEN", icon: "👽", hintText: "Friendly cosmic visitor from far constellations!", illustrationType: IllustrationType.ROCKET },
  { word: "TELESCOPE", icon: "🔭", hintText: "Peeks at distant rings of Saturn!", illustrationType: IllustrationType.ROCKET },
  { word: "SPACE", icon: "🛸", hintText: "Infinite wondrous playground of the cosmos!", illustrationType: IllustrationType.ROCKET },

  // 71 - 80: Garden & Blooms
  { word: "ROSE", icon: "🌹", hintText: "Fragrant flower with velvety deep petals!", illustrationType: IllustrationType.FLOWER },
  { word: "TULIP", icon: "🌷", hintText: "Cup-shaped spring bloom upright in flowerbeds!", illustrationType: IllustrationType.FLOWER },
  { word: "SEED", icon: "🌱", hintText: "Sprouts green new life in healthy soil!", illustrationType: IllustrationType.FLOWER },
  { word: "DAISY", icon: "🌼", hintText: "Cheerful white petals with a golden center!", illustrationType: IllustrationType.FLOWER },
  { word: "GARDEN", icon: "🪴", hintText: "Quiet sanctuary filled with herbs and blooms!", illustrationType: IllustrationType.FLOWER },
  { word: "MUSHROOM", icon: "🍄", hintText: "Cute forest umbrella sheltering beetles!", illustrationType: IllustrationType.FLOWER },
  { word: "GRASS", icon: "🌾", hintText: "Soft green carpet spreading over hills!", illustrationType: IllustrationType.FLOWER },
  { word: "BEETLE", icon: "🐞", hintText: "Little red ladybug with spotted wing covers!", illustrationType: IllustrationType.BUTTERFLY },
  { word: "SPIDER", icon: "🕷️", hintText: "Weaves intricate geometric dewy webs!", illustrationType: IllustrationType.BUTTERFLY },
  { word: "CATERPILLAR", icon: "🐛", hintText: "Munches green leaves before becoming butterfly!", illustrationType: IllustrationType.BUTTERFLY },

  // 81 - 90: Learning & Creativity
  { word: "BOOK", icon: "📚", hintText: "Portal to thrilling tales and grand adventures!", illustrationType: IllustrationType.BALLOON },
  { word: "PENCIL", icon: "✏️", hintText: "Sketches dreams and solves puzzle grids!", illustrationType: IllustrationType.APPLE },
  { word: "CRAYON", icon: "🖍️", hintText: "Adds vibrant rainbow colors to sketches!", illustrationType: IllustrationType.RAINBOW },
  { word: "PAINT", icon: "🎨", hintText: "Swirls vivid hues across blank canvases!", illustrationType: IllustrationType.RAINBOW },
  { word: "PAPER", icon: "📄", hintText: "Folds into airplanes and origami swans!", illustrationType: IllustrationType.BALLOON },
  { word: "CLOCK", icon: "⏰", hintText: "Ticks happily counting cheerful moments!", illustrationType: IllustrationType.SUN },
  { word: "MUSIC", icon: "🎵", hintText: "Sweet harmonious notes that inspire dancing!", illustrationType: IllustrationType.BALLOON },
  { word: "PUZZLE", icon: "🧩", hintText: "Fitting clever pieces together with joy!", illustrationType: IllustrationType.BALLOON },
  { word: "SMILE", icon: "😊", hintText: "Bright friendly curve that brightens anyone's day!", illustrationType: IllustrationType.SUN },
  { word: "HEART", icon: "❤️", hintText: "Symbol of warmth, friendship and care!", illustrationType: IllustrationType.APPLE },

  // 91 - 100: Grand Adventures & Outdoors
  { word: "CAMP", icon: "⛺", hintText: "Cozy tent pitched beside starlit campfires!", illustrationType: IllustrationType.SUN },
  { word: "MOUNTAIN", icon: "🏔️", hintText: "Majestic snowy peak reaching towards clouds!", illustrationType: IllustrationType.SUN },
  { word: "FOREST", icon: "🌲", hintText: "Whispering evergreen woods full of wonders!", illustrationType: IllustrationType.FLOWER },
  { word: "SUNSET", icon: "🌅", hintText: "Golden evening horizon glowing purple and pink!", illustrationType: IllustrationType.SUN },
  { word: "CASTLE", icon: "🏰", hintText: "Enchanted stone fortress from fairy tale books!", illustrationType: IllustrationType.BALLOON },
  { word: "TREASURE", icon: "💎", hintText: "Glittering hidden chest of sparkling crystals!", illustrationType: IllustrationType.SUN },
  { word: "HERO", icon: "🦸", hintText: "Brave champion who helps friends every day!", illustrationType: IllustrationType.ROCKET },
  { word: "WIZARD", icon: "🧙", hintText: "Sparks magic wand with glittering constellations!", illustrationType: IllustrationType.ROCKET },
  { word: "CROWN", icon: "👑", hintText: "Golden regal tiara adorned with rubies!", illustrationType: IllustrationType.SUN },
  { word: "CHAMPION", icon: "🏆", hintText: "Proud golden trophy for completing 100 levels!", illustrationType: IllustrationType.SUN }
];

export function computeTargetCells(
  startRow: number,
  startCol: number,
  wordLength: number,
  direction: Direction
): [number, number][] {
  const offset = DIRECTION_OFFSETS[direction];
  const cells: [number, number][] = [];
  for (let i = 0; i < wordLength; i++) {
    cells.push([startRow + i * offset.dRow, startCol + i * offset.dCol]);
  }
  return cells;
}

export function createLevel(levelNum: number): LevelData {
  const wordIndex = Math.min(Math.max(0, levelNum - 1), LEVEL_WORDS.length - 1);
  const def = LEVEL_WORDS[wordIndex];
  const word = def.word;

  let baseDim: number;
  if (levelNum <= 10) {
    baseDim = word.length + 1;
  } else if (levelNum <= 40) {
    baseDim = Math.max(word.length + 1, 6);
  } else if (levelNum <= 75) {
    baseDim = Math.max(word.length + 1, 7);
  } else {
    baseDim = Math.max(word.length + 1, 8);
  }

  const gridRows = Math.max(baseDim, word.length);
  const gridCols = Math.max(baseDim, word.length);

  const candidateDirections: Direction[] =
    levelNum <= 5
      ? [Direction.HORIZONTAL, Direction.VERTICAL]
      : [Direction.HORIZONTAL, Direction.VERTICAL, Direction.DIAGONAL_DOWN, Direction.DIAGONAL_UP];

  const rng = new SeededRandom(levelNum * 997 + 13);
  const shuffledDirs = rng.shuffle(candidateDirections);

  let chosenDirection = Direction.HORIZONTAL;
  let chosenStartRow = 0;
  let chosenStartCol = 0;
  let placed = false;

  for (const dir of shuffledDirs) {
    const offset = DIRECTION_OFFSETS[dir];
    const minStartRow = offset.dRow < 0 ? word.length - 1 : 0;
    const maxStartRow = offset.dRow > 0 ? gridRows - word.length : gridRows - 1;

    const minStartCol = offset.dCol < 0 ? word.length - 1 : 0;
    const maxStartCol = offset.dCol > 0 ? gridCols - word.length : gridCols - 1;

    if (maxStartRow >= minStartRow && maxStartCol >= minStartCol) {
      const rowRange = maxStartRow - minStartRow + 1;
      const colRange = maxStartCol - minStartCol + 1;
      chosenStartRow = minStartRow + rng.nextInt(rowRange);
      chosenStartCol = minStartCol + rng.nextInt(colRange);
      chosenDirection = dir;
      placed = true;
      break;
    }
  }

  if (!placed) {
    chosenDirection = Direction.HORIZONTAL;
    chosenStartRow = Math.min(Math.floor(gridRows / 2), gridRows - 1);
    chosenStartCol = 0;
  }

  const chapterIndex = Math.min(Math.floor((levelNum - 1) / 10), 9);
  const categoryNames = [
    'Sunny Meadow',
    'Safari & Pets',
    'Whispering Woods',
    'Sweet Orchard',
    'Toy Fair & Sweets',
    'Coral Waters',
    'Cosmic Sky',
    'Blossom Garden',
    'Cozy Village',
    'Grand Discovery',
  ];

  return {
    levelNumber: levelNum,
    word,
    icon: def.icon,
    hintText: def.hintText,
    category: categoryNames[chapterIndex],
    gridRows,
    gridCols,
    startRow: chosenStartRow,
    startCol: chosenStartCol,
    direction: chosenDirection,
    illustrationType: def.illustrationType,
    targetCells: computeTargetCells(chosenStartRow, chosenStartCol, word.length, chosenDirection),
  };
}

export const ALL_100_LEVELS: LevelData[] = Array.from({ length: 100 }, (_, i) => createLevel(i + 1));
