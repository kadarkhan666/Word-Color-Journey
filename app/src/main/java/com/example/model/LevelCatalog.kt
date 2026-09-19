package com.example.model

/**
 * 100 distinct word definitions tailored for casual, colourful Word Search puzzles.
 * Grouped across cheerful kid-friendly themes: Animals, Nature, Fruits & Veggies,
 * Objects, Space, Ocean, Sweets, School, Colors, and Everyday Wonders.
 */
data class WordDefinition(
    val word: String,
    val icon: String,
    val hintText: String,
    val illustrationType: IllustrationType
)

object LevelCatalog {

    val WORDS: List<WordDefinition> = listOf(
        // 1 - 10: Original Classics
        WordDefinition("APPLE", "🍎", "A sweet, crunchy red fruit!", IllustrationType.APPLE),
        WordDefinition("CAT", "🐱", "A cute furry friend that says meow!", IllustrationType.CAT),
        WordDefinition("FLOWER", "🌸", "Blooms in spring with colourful petals!", IllustrationType.FLOWER),
        WordDefinition("SUN", "☀️", "Shines bright and warm in the sky!", IllustrationType.SUN),
        WordDefinition("FISH", "🐟", "Swims gracefully under the blue sea!", IllustrationType.FISH),
        WordDefinition("RAINBOW", "🌈", "Magical colours after the rain!", IllustrationType.RAINBOW),
        WordDefinition("BALLOON", "🎈", "Floats high in the air at parties!", IllustrationType.BALLOON),
        WordDefinition("BUTTERFLY", "🦋", "Flutters gently with painted wings!", IllustrationType.BUTTERFLY),
        WordDefinition("AVOCADO", "🥑", "Creamy green fruit with a round seed!", IllustrationType.AVOCADO),
        WordDefinition("ROCKET", "🚀", "Zooms into outer space to the stars!", IllustrationType.ROCKET),

        // 11 - 20: Animals & Pets
        WordDefinition("DOG", "🐶", "Loyal furry best friend that barks!", IllustrationType.CAT),
        WordDefinition("BIRD", "🐦", "Sings sweet morning songs on trees!", IllustrationType.BUTTERFLY),
        WordDefinition("LION", "🦁", "The brave king of the golden savanna!", IllustrationType.CAT),
        WordDefinition("PANDA", "🐼", "Gentle bear that loves chewing bamboo!", IllustrationType.CAT),
        WordDefinition("BEE", "🐝", "Buzzes near blooms collecting honey!", IllustrationType.FLOWER),
        WordDefinition("DUCK", "🦆", "Quacks happily paddling on the pond!", IllustrationType.FISH),
        WordDefinition("FROG", "🐸", "Hops over green lily pads in the lake!", IllustrationType.FISH),
        WordDefinition("TIGER", "🐯", "Strong big cat with bold orange stripes!", IllustrationType.CAT),
        WordDefinition("HORSE", "🐴", "Gallops fast across lush open fields!", IllustrationType.CAT),
        WordDefinition("WHALE", "🐋", "Majestic giant swimming deep in oceans!", IllustrationType.FISH),

        // 21 - 30: Nature & Sky
        WordDefinition("TREE", "🌳", "Tall leafy canopy providing cool shade!", IllustrationType.FLOWER),
        WordDefinition("MOON", "🌙", "Glows gently in the starry night sky!", IllustrationType.SUN),
        WordDefinition("STAR", "⭐", "Twinkles brightly from millions of miles!", IllustrationType.SUN),
        WordDefinition("CLOUD", "☁️", "Soft puffy white cotton ball in the sky!", IllustrationType.RAINBOW),
        WordDefinition("LEAF", "🍃", "Dances in the crisp autumn breeze!", IllustrationType.FLOWER),
        WordDefinition("RIVER", "🌊", "Clear sparkling stream flowing downhill!", IllustrationType.FISH),
        WordDefinition("RAIN", "🌧️", "Pattering drops watering thirsty garden soil!", IllustrationType.RAINBOW),
        WordDefinition("SNOW", "❄️", "Delicate icy flakes creating winter magic!", IllustrationType.RAINBOW),
        WordDefinition("WIND", "💨", "Invisible breeze that turns paper pinwheels!", IllustrationType.BALLOON),
        WordDefinition("BEACH", "🏖️", "Golden sand warm under the summer sun!", IllustrationType.SUN),

        // 31 - 40: Fruits & Berries
        WordDefinition("BANANA", "🍌", "Sweet yellow energy treat monkeys love!", IllustrationType.APPLE),
        WordDefinition("CHERRY", "🍒", "Pair of glossy red jewels on a stem!", IllustrationType.APPLE),
        WordDefinition("ORANGE", "🍊", "Juicy citrus slice bursting with vitamin C!", IllustrationType.APPLE),
        WordDefinition("GRAPE", "🍇", "Plump sweet cluster growing on vineyard vines!", IllustrationType.APPLE),
        WordDefinition("LEMON", "🍋", "Zesty yellow fruit that gives lemonade kick!", IllustrationType.APPLE),
        WordDefinition("PEACH", "🍑", "Velvety fuzzy sweet summer delicacy!", IllustrationType.APPLE),
        WordDefinition("PEAR", "🍐", "Bell-shaped juicy fruit with golden skin!", IllustrationType.APPLE),
        WordDefinition("BERRY", "🍓", "Tiny sweet fruit packed with woodland flavour!", IllustrationType.APPLE),
        WordDefinition("MELON", "🍈", "Refreshing cool melon on a picnic blanket!", IllustrationType.AVOCADO),
        WordDefinition("MANGO", "🥭", "Tropical king of sweetness and aroma!", IllustrationType.AVOCADO),

        // 41 - 50: Fun Toys & Celebration
        WordDefinition("KITE", "🪁", "Soars and loops high against blue clouds!", IllustrationType.BALLOON),
        WordDefinition("DRUM", "🥁", "Bangs the joyful rhythm of school bands!", IllustrationType.BALLOON),
        WordDefinition("BELL", "🔔", "Rings clearly to gather everyone together!", IllustrationType.FLOWER),
        WordDefinition("GIFT", "🎁", "Wrapped in colorful paper with a big ribbon!", IllustrationType.BALLOON),
        WordDefinition("BALL", "⚽", "Bounces across playgrounds and sunny courts!", IllustrationType.BALLOON),
        WordDefinition("CAKE", "🎂", "Sweet celebration dessert with birthday candles!", IllustrationType.BALLOON),
        WordDefinition("COOKIE", "🍪", "Baked treat loaded with chocolate chips!", IllustrationType.APPLE),
        WordDefinition("CANDY", "🍬", "Delicious sugary wrapper full of sweetness!", IllustrationType.BALLOON),
        WordDefinition("PIZZA", "🍕", "Cheesy slice fresh from the stone oven!", IllustrationType.AVOCADO),
        WordDefinition("JUICE", "🧃", "Chilled fruity drink with a paper straw!", IllustrationType.APPLE),

        // 51 - 60: Ocean & Waters
        WordDefinition("SHARK", "🦈", "Swift ocean swimmer with a dorsal fin!", IllustrationType.FISH),
        WordDefinition("CRAB", "🦀", "Walks sideways with clicking red pincers!", IllustrationType.FISH),
        WordDefinition("CORAL", "🪸", "Vibrant underwater home for playful fish!", IllustrationType.FISH),
        WordDefinition("SHELL", "🐚", "Treasured ocean souvenir found on sandy shore!", IllustrationType.FISH),
        WordDefinition("BOAT", "⛵", "Sails smoothly across peaceful rippling bays!", IllustrationType.FISH),
        WordDefinition("WAVE", "🌊", "Curls and crashes into sparkling white foam!", IllustrationType.FISH),
        WordDefinition("TURTLE", "🐢", "Glides gracefully through coral sea reefs!", IllustrationType.FISH),
        WordDefinition("ISLAND", "🏝️", "Tropical haven shaded by coconut palms!", IllustrationType.SUN),
        WordDefinition("DOLPHIN", "🐬", "Clever friendly sea acrobat leaping waves!", IllustrationType.FISH),
        WordDefinition("OCTOPUS", "🐙", "Eight clever tentacles exploring tide pools!", IllustrationType.FISH),

        // 61 - 70: Cosmos & Exploration
        WordDefinition("PLANET", "🪐", "Giant world spinning around the sun!", IllustrationType.ROCKET),
        WordDefinition("COMET", "☄️", "Cosmic snowball blazing a glowing tail!", IllustrationType.ROCKET),
        WordDefinition("EARTH", "🌍", "Our beautiful blue home in the universe!", IllustrationType.ROCKET),
        WordDefinition("MARS", "🔴", "The intriguing red planet in starry night!", IllustrationType.ROCKET),
        WordDefinition("ORBIT", "🛰️", "Looping path celestial objects travel on!", IllustrationType.ROCKET),
        WordDefinition("GALAXY", "🌌", "Spiralling ocean of billions of bright stars!", IllustrationType.ROCKET),
        WordDefinition("METEOR", "🌠", "Shooting light making wishes come true!", IllustrationType.ROCKET),
        WordDefinition("ALIEN", "👽", "Friendly cosmic visitor from far constellations!", IllustrationType.ROCKET),
        WordDefinition("TELESCOPE", "🔭", "Peeks at distant rings of Saturn!", IllustrationType.ROCKET),
        WordDefinition("SPACE", "🛸", "Infinite wondrous playground of the cosmos!", IllustrationType.ROCKET),

        // 71 - 80: Garden & Blooms
        WordDefinition("ROSE", "🌹", "Fragrant flower with velvety deep petals!", IllustrationType.FLOWER),
        WordDefinition("TULIP", "🌷", "Cup-shaped spring bloom upright in flowerbeds!", IllustrationType.FLOWER),
        WordDefinition("SEED", "🌱", "Sprouts green new life in healthy soil!", IllustrationType.FLOWER),
        WordDefinition("DAISY", "🌼", "Cheerful white petals with a golden center!", IllustrationType.FLOWER),
        WordDefinition("GARDEN", "🪴", "Quiet sanctuary filled with herbs and blooms!", IllustrationType.FLOWER),
        WordDefinition("MUSHROOM", "🍄", "Cute forest umbrella sheltering beetles!", IllustrationType.FLOWER),
        WordDefinition("GRASS", "🌾", "Soft green carpet spreading over hills!", IllustrationType.FLOWER),
        WordDefinition("BEETLE", "🐞", "Little red ladybug with spotted wing covers!", IllustrationType.BUTTERFLY),
        WordDefinition("SPIDER", "🕷️", "Weaves intricate geometric dewy webs!", IllustrationType.BUTTERFLY),
        WordDefinition("CATERPILLAR", "🐛", "Munches green leaves before becoming butterfly!", IllustrationType.BUTTERFLY),

        // 81 - 90: Learning & Creativity
        WordDefinition("BOOK", "📚", "Portal to thrilling tales and grand adventures!", IllustrationType.BALLOON),
        WordDefinition("PENCIL", "✏️", "Sketches dreams and solves puzzle grids!", IllustrationType.APPLE),
        WordDefinition("CRAYON", "🖍️", "Adds vibrant rainbow colors to sketches!", IllustrationType.RAINBOW),
        WordDefinition("PAINT", "🎨", "Swirls vivid hues across blank canvases!", IllustrationType.RAINBOW),
        WordDefinition("PAPER", "📄", "Folds into airplanes and origami swans!", IllustrationType.BALLOON),
        WordDefinition("CLOCK", "⏰", "Ticks happily counting cheerful moments!", IllustrationType.SUN),
        WordDefinition("MUSIC", "🎵", "Sweet harmonious notes that inspire dancing!", IllustrationType.BALLOON),
        WordDefinition("PUZZLE", "🧩", "Fitting clever pieces together with joy!", IllustrationType.BALLOON),
        WordDefinition("SMILE", "😊", "Bright friendly curve that brightens anyone's day!", IllustrationType.SUN),
        WordDefinition("HEART", "❤️", "Symbol of warmth, friendship and care!", IllustrationType.APPLE),

        // 91 - 100: Grand Adventures & Outdoors
        WordDefinition("CAMP", "⛺", "Cozy tent pitched beside starlit campfires!", IllustrationType.SUN),
        WordDefinition("MOUNTAIN", "🏔️", "Majestic snowy peak reaching towards clouds!", IllustrationType.SUN),
        WordDefinition("FOREST", "🌲", "Whispering evergreen woods full of wonders!", IllustrationType.FLOWER),
        WordDefinition("SUNSET", "🌅", "Golden evening horizon glowing purple and pink!", IllustrationType.SUN),
        WordDefinition("CASTLE", "🏰", "Enchanted stone fortress from fairy tale books!", IllustrationType.BALLOON),
        WordDefinition("TREASURE", "💎", "Glittering hidden chest of sparkling crystals!", IllustrationType.SUN),
        WordDefinition("HERO", "🦸", "Brave champion who helps friends every day!", IllustrationType.ROCKET),
        WordDefinition("WIZARD", "🧙", "Sparks magic wand with glittering constellations!", IllustrationType.ROCKET),
        WordDefinition("CROWN", "👑", "Golden regal tiara adorned with rubies!", IllustrationType.SUN),
        WordDefinition("CHAMPION", "🏆", "Proud golden trophy for completing 100 levels!", IllustrationType.SUN)
    )

    /**
     * Generates a fully verified, playable LevelData for the given level number (1..100).
     * Deterministic placement based on level index.
     */
    fun createLevel(levelNum: Int): LevelData {
        val wordIndex = (levelNum - 1).coerceIn(0, WORDS.size - 1)
        val def = WORDS[wordIndex]
        val word = def.word

        // Ensure grid is strictly large enough for the word length
        val baseDim = when {
            levelNum <= 10 -> word.length + 1
            levelNum <= 40 -> maxOf(word.length + 1, 6)
            levelNum <= 75 -> maxOf(word.length + 1, 7)
            else -> maxOf(word.length + 1, 8)
        }
        val gridRows = maxOf(baseDim, word.length)
        val gridCols = maxOf(baseDim, word.length)

        // Available directions based on level advancement:
        // Early levels: Horizontal & Vertical
        // Intermediate & Advanced: all 4 directions
        val candidateDirections = if (levelNum <= 5) {
            listOf(Direction.HORIZONTAL, Direction.VERTICAL)
        } else {
            listOf(Direction.HORIZONTAL, Direction.VERTICAL, Direction.DIAGONAL_DOWN, Direction.DIAGONAL_UP)
        }

        // Seeded selection per level number to guarantee consistent placement
        val rng = java.util.Random(levelNum * 997L + 13L)
        val shuffledDirs = candidateDirections.shuffled(rng)

        var chosenDirection = Direction.HORIZONTAL
        var chosenStartRow = 0
        var chosenStartCol = 0
        var placed = false

        for (dir in shuffledDirs) {
            val minStartRow = when {
                dir.dRow < 0 -> (word.length - 1)
                else -> 0
            }
            val maxStartRow = when {
                dir.dRow > 0 -> gridRows - word.length
                else -> gridRows - 1
            }

            val minStartCol = when {
                dir.dCol < 0 -> (word.length - 1)
                else -> 0
            }
            val maxStartCol = when {
                dir.dCol > 0 -> gridCols - word.length
                else -> gridCols - 1
            }

            if (maxStartRow >= minStartRow && maxStartCol >= minStartCol) {
                val rowRange = maxStartRow - minStartRow + 1
                val colRange = maxStartCol - minStartCol + 1
                chosenStartRow = minStartRow + rng.nextInt(rowRange)
                chosenStartCol = minStartCol + rng.nextInt(colRange)
                chosenDirection = dir
                placed = true
                break
            }
        }

        if (!placed) {
            chosenDirection = Direction.HORIZONTAL
            chosenStartRow = (gridRows / 2).coerceAtMost(gridRows - 1)
            chosenStartCol = 0
        }

        return LevelData(
            levelNumber = levelNum,
            word = word,
            icon = def.icon,
            hintText = def.hintText,
            gridRows = gridRows,
            gridCols = gridCols,
            startRow = chosenStartRow,
            startCol = chosenStartCol,
            direction = chosenDirection,
            illustrationType = def.illustrationType
        )
    }

    val ALL_100_LEVELS: List<LevelData> by lazy {
        (1..100).map { createLevel(it) }
    }
}
