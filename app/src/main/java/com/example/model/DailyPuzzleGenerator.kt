package com.example.model

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.Random

data class DailyWordItem(
    val word: String,
    val icon: String,
    val hintText: String,
    val illustrationType: IllustrationType
)

object DailyPuzzleGenerator {

    val DAILY_WORDS_CATALOG: List<DailyWordItem> = listOf(
        DailyWordItem("APPLE", "🍎", "Sweet, crunchy red or green fruit!", IllustrationType.APPLE),
        DailyWordItem("CAT", "🐱", "Cute furry feline friend that purrs!", IllustrationType.CAT),
        DailyWordItem("FLOWER", "🌸", "Blooms brightly in sunny spring gardens!", IllustrationType.FLOWER),
        DailyWordItem("SUN", "☀️", "Golden star that lights up our warm sky!", IllustrationType.SUN),
        DailyWordItem("FISH", "🐟", "Swims swiftly through sparkling ocean waves!", IllustrationType.FISH),
        DailyWordItem("RAINBOW", "🌈", "Seven beautiful colours across the cloudy sky!", IllustrationType.RAINBOW),
        DailyWordItem("BALLOON", "🎈", "Floats up high filled with joyful birthday air!", IllustrationType.BALLOON),
        DailyWordItem("BUTTERFLY", "🦋", "Graceful flutterer with colourful painted wings!", IllustrationType.BUTTERFLY),
        DailyWordItem("AVOCADO", "🥑", "Nutritious creamy green fruit with a big round seed!", IllustrationType.AVOCADO),
        DailyWordItem("ROCKET", "🚀", "Zooms past planets towards distant twinkling stars!", IllustrationType.ROCKET)
    )

    fun getTodayDateKey(date: Date = Date()): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(date)
    }

    fun getTodayFormattedDisplay(date: Date = Date()): String {
        val sdf = SimpleDateFormat("EEEE, MMMM d", Locale.US)
        return sdf.format(date)
    }

    /**
     * Converts a "yyyy-MM-dd" date key into a deterministic 64-bit seed.
     */
    fun dateKeyToSeed(dateKey: String): Long {
        val parts = dateKey.split("-").mapNotNull { it.toLongOrNull() }
        if (parts.size == 3) {
            val (year, month, day) = parts
            // Combine with prime multipliers for good distribution
            return year * 100003L + month * 10007L + day * 997L + 7919L
        }
        return dateKey.hashCode().toLong()
    }

    /**
     * Generates a unique, valid LevelData for the specified date key.
     * Uses a seeded Random generator ensuring identical puzzle generation on that calendar day.
     */
    fun generateDailyPuzzle(dateKey: String): LevelData {
        val seed = dateKeyToSeed(dateKey)
        val rng = Random(seed)

        // Pick word from catalog deterministically using the day's seed
        val wordItem = DAILY_WORDS_CATALOG[rng.nextInt(DAILY_WORDS_CATALOG.size)]
        val word = wordItem.word

        // Grid dimensions scaled comfortably to word length
        // Words lengths vary from 3 to 9
        val minDim = (word.length + 1).coerceIn(5, 8)
        val gridRows = minDim
        val gridCols = minDim

        // Available directions: HORIZONTAL, VERTICAL, DIAGONAL_DOWN, DIAGONAL_UP
        val availableDirections = Direction.values().toList()

        // Deterministically find a placement that fits nicely inside grid
        var selectedDirection = Direction.HORIZONTAL
        var selectedStartRow = 0
        var selectedStartCol = 0
        var placed = false

        // Shuffle direction attempts with seeded rng
        val directionsToTry = availableDirections.shuffled(rng)

        for (dir in directionsToTry) {
            val maxStartRow = when {
                dir.dRow > 0 -> gridRows - word.length
                else -> gridRows - 1
            }
            val minStartRow = when {
                dir.dRow < 0 -> (word.length - 1)
                else -> 0
            }

            val maxStartCol = when {
                dir.dCol > 0 -> gridCols - word.length
                else -> gridCols - 1
            }
            val minStartCol = when {
                dir.dCol < 0 -> (word.length - 1)
                else -> 0
            }

            if (maxStartRow >= minStartRow && maxStartCol >= minStartCol) {
                val rowRange = (maxStartRow - minStartRow + 1)
                val colRange = (maxStartCol - minStartCol + 1)
                selectedStartRow = minStartRow + rng.nextInt(rowRange)
                selectedStartCol = minStartCol + rng.nextInt(colRange)
                selectedDirection = dir
                placed = true
                break
            }
        }

        // Fallback to safe horizontal in middle
        if (!placed) {
            selectedDirection = Direction.HORIZONTAL
            selectedStartRow = (gridRows / 2).coerceAtMost(gridRows - 1)
            selectedStartCol = 0
        }

        return LevelData(
            levelNumber = 9999, // Special identifier for Daily
            word = word,
            icon = wordItem.icon,
            hintText = wordItem.hintText,
            gridRows = gridRows,
            gridCols = gridCols,
            startRow = selectedStartRow,
            startCol = selectedStartCol,
            direction = selectedDirection,
            illustrationType = wordItem.illustrationType
        )
    }
}
