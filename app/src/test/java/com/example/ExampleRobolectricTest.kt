package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.model.GAME_LEVELS
import com.example.model.GridGenerator
import com.example.viewmodel.GameViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Word Search", appName)
  }

  @Test
  fun `verify 100 levels defined with correct target words`() {
    assertEquals(100, GAME_LEVELS.size)
    assertEquals("APPLE", GAME_LEVELS[0].word)
    assertEquals("CAT", GAME_LEVELS[1].word)
    assertEquals("FLOWER", GAME_LEVELS[2].word)
    assertEquals("SUN", GAME_LEVELS[3].word)
    assertEquals("FISH", GAME_LEVELS[4].word)
    assertEquals("RAINBOW", GAME_LEVELS[5].word)
    assertEquals("BALLOON", GAME_LEVELS[6].word)
    assertEquals("BUTTERFLY", GAME_LEVELS[7].word)
    assertEquals("AVOCADO", GAME_LEVELS[8].word)
    assertEquals("ROCKET", GAME_LEVELS[9].word)
    assertEquals("CHAMPION", GAME_LEVELS[99].word)

    // Verify all 100 levels have valid boundaries and words properly fit in grid
    for (level in GAME_LEVELS) {
      val grid = GridGenerator.generateGrid(level)
      val cells = level.targetCells
      assertEquals(level.word.length, cells.size)
      for ((r, c) in cells) {
        assertTrue(r in 0 until level.gridRows)
        assertTrue(c in 0 until level.gridCols)
      }
      val reconstructedWord = cells.map { (r, c) -> grid[r][c] }.joinToString("")
      assertEquals(level.word, reconstructedWord)
    }
  }

  @Test
  fun `verify grid generator embeds word correctly`() {
    val level1 = GAME_LEVELS[0]
    val grid = GridGenerator.generateGrid(level1)

    // Check target word characters match
    val chars = level1.targetCells.map { (r, c) -> grid[r][c] }.joinToString("")
    assertEquals("APPLE", chars)
  }

  @Test
  fun `verify game viewmodel check selection logic`() {
    val app = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = GameViewModel(app)

    val currentLevel = viewModel.currentLevel.value
    assertEquals("APPLE", currentLevel.word)

    // Incorrect selection
    val wrongSelection = listOf(Pair(0, 0), Pair(0, 1))
    val resultWrong = viewModel.checkSelection(wrongSelection)
    assertFalse(resultWrong)
    assertFalse(viewModel.isWordFound.value)

    // Correct selection
    val correctSelection = currentLevel.targetCells
    val resultCorrect = viewModel.checkSelection(correctSelection)
    assertTrue(resultCorrect)
    assertTrue(viewModel.isWordFound.value)
  }

  @Test
  fun `verify daily puzzle generator produces deterministic seeded puzzles`() {
    val dateKey1 = "2026-09-19"
    val dateKey2 = "2026-09-20"

    val puzzleDay1AttemptA = com.example.model.DailyPuzzleGenerator.generateDailyPuzzle(dateKey1)
    val puzzleDay1AttemptB = com.example.model.DailyPuzzleGenerator.generateDailyPuzzle(dateKey1)

    // Identical parameters for the same day
    assertEquals(puzzleDay1AttemptA.word, puzzleDay1AttemptB.word)
    assertEquals(puzzleDay1AttemptA.startRow, puzzleDay1AttemptB.startRow)
    assertEquals(puzzleDay1AttemptA.startCol, puzzleDay1AttemptB.startCol)
    assertEquals(puzzleDay1AttemptA.direction, puzzleDay1AttemptB.direction)

    val gridA = GridGenerator.generateGrid(
        puzzleDay1AttemptA,
        com.example.model.DailyPuzzleGenerator.dateKeyToSeed(dateKey1)
    )
    val gridB = GridGenerator.generateGrid(
        puzzleDay1AttemptB,
        com.example.model.DailyPuzzleGenerator.dateKeyToSeed(dateKey1)
    )
    assertEquals(gridA, gridB)

    // Check word characters are placed correctly in grid
    val targetLetters = puzzleDay1AttemptA.targetCells.map { (r, c) -> gridA[r][c] }.joinToString("")
    assertEquals(puzzleDay1AttemptA.word, targetLetters)
  }

  @Test
  fun `verify daily mode switching in ViewModel`() {
    val app = ApplicationProvider.getApplicationContext<android.app.Application>()
    val viewModel = GameViewModel(app)

    assertFalse(viewModel.isDailyMode.value)
    assertEquals(1, viewModel.currentLevel.value.levelNumber)

    // Switch to daily mode
    viewModel.switchToDailyMode()
    assertTrue(viewModel.isDailyMode.value)
    assertEquals(9999, viewModel.currentLevel.value.levelNumber)
    assertTrue(viewModel.currentLevel.value.word.isNotEmpty())

    // Switch back to classic
    viewModel.switchToClassicMode()
    assertFalse(viewModel.isDailyMode.value)
    assertEquals(1, viewModel.currentLevel.value.levelNumber)
  }
}


