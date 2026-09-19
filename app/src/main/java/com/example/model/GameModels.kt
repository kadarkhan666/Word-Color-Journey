package com.example.model

import androidx.compose.ui.graphics.Color
import kotlin.math.abs

enum class Direction(val dRow: Int, val dCol: Int) {
    HORIZONTAL(0, 1),
    VERTICAL(1, 0),
    DIAGONAL_DOWN(1, 1),
    DIAGONAL_UP(-1, 1)
}

enum class IllustrationType {
    APPLE,
    CAT,
    FLOWER,
    SUN,
    FISH,
    RAINBOW,
    BALLOON,
    BUTTERFLY,
    AVOCADO,
    ROCKET
}

data class MarkerColor(
    val id: Int,
    val name: String,
    val primaryColor: Color,
    val highlightColor: Color,
    val pencilColor: Color
)

data class GridCell(
    val row: Int,
    val col: Int,
    val char: Char
)

data class LevelData(
    val levelNumber: Int,
    val word: String,
    val icon: String,
    val hintText: String,
    val gridRows: Int,
    val gridCols: Int,
    val startRow: Int,
    val startCol: Int,
    val direction: Direction,
    val illustrationType: IllustrationType
) {
    val targetCells: List<Pair<Int, Int>> by lazy {
        val cells = mutableListOf<Pair<Int, Int>>()
        for (i in word.indices) {
            cells.add(Pair(startRow + i * direction.dRow, startCol + i * direction.dCol))
        }
        cells
    }
}

data class LevelProgress(
    val levelNumber: Int,
    val isCompleted: Boolean = false,
    val stars: Int = 0
)

val DEFAULT_MARKER_COLORS = listOf(
    MarkerColor(
        id = 0,
        name = "Bubblegum Pink",
        primaryColor = Color(0xFFFF5277),
        highlightColor = Color(0x66FF5277),
        pencilColor = Color(0xFFFF4081)
    ),
    MarkerColor(
        id = 1,
        name = "Sunshine Yellow",
        primaryColor = Color(0xFFFFB300),
        highlightColor = Color(0x66FFD54F),
        pencilColor = Color(0xFFFFC107)
    ),
    MarkerColor(
        id = 2,
        name = "Mint Sky",
        primaryColor = Color(0xFF00BFA5),
        highlightColor = Color(0x6680CBC4),
        pencilColor = Color(0xFF26A69A)
    )
)

val GAME_LEVELS: List<LevelData> get() = LevelCatalog.ALL_100_LEVELS

object GridGenerator {
    // Deterministic child-friendly filler letters to make grids predictable, easy to read and fun
    private val FILLER_POOL = "ABCDEFGHJKLMNOPRSTUVWYZ"

    fun generateGrid(level: LevelData, customSeed: Long? = null): List<List<Char>> {
        val rows = level.gridRows
        val cols = level.gridCols
        val grid = Array(rows) { CharArray(cols) }

        // Seeded filler so puzzle letters stay stable on same level or date
        val seed = customSeed ?: (level.levelNumber * 1000L + 42L)
        val pseudoRandom = java.util.Random(seed)

        // Fill background letters
        for (r in 0 until rows) {
            for (c in 0 until cols) {
                grid[r][c] = FILLER_POOL[pseudoRandom.nextInt(FILLER_POOL.length)]
            }
        }

        // Place target word
        val word = level.word
        for (i in word.indices) {
            val r = level.startRow + i * level.direction.dRow
            val c = level.startCol + i * level.direction.dCol
            if (r in 0 until rows && c in 0 until cols) {
                grid[r][c] = word[i]
            }
        }

        return grid.map { it.toList() }
    }
}
