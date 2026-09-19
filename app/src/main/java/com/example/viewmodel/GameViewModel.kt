package com.example.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.model.DEFAULT_MARKER_COLORS
import com.example.model.DailyPuzzleGenerator
import com.example.model.GAME_LEVELS
import com.example.model.GridGenerator
import com.example.model.LevelData
import com.example.model.MarkerColor
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class GameViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences("word_search_puzzle_prefs", Context.MODE_PRIVATE)

    // Current game mode: false = Classic levels, true = Daily Puzzle
    private val _isDailyMode = MutableStateFlow(false)
    val isDailyMode: StateFlow<Boolean> = _isDailyMode.asStateFlow()

    private val _todayDateKey = MutableStateFlow(DailyPuzzleGenerator.getTodayDateKey())
    val todayDateKey: StateFlow<String> = _todayDateKey.asStateFlow()

    private val _todayDisplayDate = MutableStateFlow(DailyPuzzleGenerator.getTodayFormattedDisplay())
    val todayDisplayDate: StateFlow<String> = _todayDisplayDate.asStateFlow()

    private val _isDailyCompleted = MutableStateFlow(false)
    val isDailyCompleted: StateFlow<Boolean> = _isDailyCompleted.asStateFlow()

    private val _dailyStreak = MutableStateFlow(0)
    val dailyStreak: StateFlow<Int> = _dailyStreak.asStateFlow()

    private val _currentLevel = MutableStateFlow(GAME_LEVELS[0])
    val currentLevel: StateFlow<LevelData> = _currentLevel.asStateFlow()

    private val _gridMatrix = MutableStateFlow<List<List<Char>>>(emptyList())
    val gridMatrix: StateFlow<List<List<Char>>> = _gridMatrix.asStateFlow()

    private val _isWordFound = MutableStateFlow(false)
    val isWordFound: StateFlow<Boolean> = _isWordFound.asStateFlow()

    private val _revealProgress = MutableStateFlow(0f)
    val revealProgress: StateFlow<Float> = _revealProgress.asStateFlow()

    private val _isPictureCompleted = MutableStateFlow(false)
    val isPictureCompleted: StateFlow<Boolean> = _isPictureCompleted.asStateFlow()

    private val _showCelebration = MutableStateFlow(false)
    val showCelebration: StateFlow<Boolean> = _showCelebration.asStateFlow()

    private val _praiseWord = MutableStateFlow("Great Job!")
    val praiseWord: StateFlow<String> = _praiseWord.asStateFlow()

    private val _activeMarker = MutableStateFlow(DEFAULT_MARKER_COLORS[0])
    val activeMarker: StateFlow<MarkerColor> = _activeMarker.asStateFlow()

    private val _hintLetterPos = MutableStateFlow<Pair<Int, Int>?>(null)
    val hintLetterPos: StateFlow<Pair<Int, Int>?> = _hintLetterPos.asStateFlow()

    private val _unlockedMaxLevel = MutableStateFlow(1)
    val unlockedMaxLevel: StateFlow<Int> = _unlockedMaxLevel.asStateFlow()

    private val _completedLevels = MutableStateFlow<Set<Int>>(emptySet())
    val completedLevels: StateFlow<Set<Int>> = _completedLevels.asStateFlow()

    private var classicLevelIndex = 0
    private val praiseOptions = listOf("Amazing!", "Great Job!", "Perfect!", "Super!", "Fantastic!")
    private var revealJob: Job? = null
    private var hintJob: Job? = null

    init {
        loadProgress()
        loadLevel(_currentLevel.value)
    }

    private fun loadProgress() {
        val maxUnlocked = prefs.getInt("max_unlocked_level", 1)
        val completedSet = prefs.getStringSet("completed_levels", emptySet())
            ?.mapNotNull { it.toIntOrNull() }
            ?.toSet() ?: emptySet()

        _unlockedMaxLevel.value = maxUnlocked
        _completedLevels.value = completedSet

        val todayKey = DailyPuzzleGenerator.getTodayDateKey()
        _todayDateKey.value = todayKey
        _todayDisplayDate.value = DailyPuzzleGenerator.getTodayFormattedDisplay()

        val lastCompletedDaily = prefs.getString("last_completed_daily_date", null)
        _isDailyCompleted.value = (lastCompletedDaily == todayKey)
        _dailyStreak.value = prefs.getInt("daily_streak", 0)
    }

    private fun saveProgress(completedLevelNum: Int) {
        val newCompleted = _completedLevels.value + completedLevelNum
        val newMaxUnlocked = maxOf(_unlockedMaxLevel.value, completedLevelNum + 1)
            .coerceAtMost(GAME_LEVELS.size)

        _completedLevels.value = newCompleted
        _unlockedMaxLevel.value = newMaxUnlocked

        prefs.edit()
            .putInt("max_unlocked_level", newMaxUnlocked)
            .putStringSet("completed_levels", newCompleted.map { it.toString() }.toSet())
            .apply()
    }

    private fun saveDailyProgress() {
        val todayKey = _todayDateKey.value
        val lastDate = prefs.getString("last_completed_daily_date", null)
        val currentStreak = prefs.getInt("daily_streak", 0)

        // Increment streak if not already completed today
        val newStreak = if (lastDate == todayKey) {
            currentStreak
        } else {
            currentStreak + 1
        }

        _isDailyCompleted.value = true
        _dailyStreak.value = newStreak

        prefs.edit()
            .putString("last_completed_daily_date", todayKey)
            .putInt("daily_streak", newStreak)
            .apply()
    }

    fun loadLevel(level: LevelData) {
        revealJob?.cancel()
        hintJob?.cancel()
        _hintLetterPos.value = null
        _currentLevel.value = level

        val customSeed = if (_isDailyMode.value) {
            DailyPuzzleGenerator.dateKeyToSeed(_todayDateKey.value)
        } else {
            null
        }

        _gridMatrix.value = GridGenerator.generateGrid(level, customSeed)
        _isWordFound.value = false
        _revealProgress.value = 0f
        _isPictureCompleted.value = false
        _showCelebration.value = false
    }

    fun switchToDailyMode() {
        if (_isDailyMode.value) return
        _isDailyMode.value = true
        val todayKey = DailyPuzzleGenerator.getTodayDateKey()
        _todayDateKey.value = todayKey
        _todayDisplayDate.value = DailyPuzzleGenerator.getTodayFormattedDisplay()
        val dailyLevel = DailyPuzzleGenerator.generateDailyPuzzle(todayKey)
        loadLevel(dailyLevel)
    }

    fun switchToClassicMode() {
        if (!_isDailyMode.value) return
        _isDailyMode.value = false
        val levelToLoad = GAME_LEVELS.getOrElse(classicLevelIndex) { GAME_LEVELS[0] }
        loadLevel(levelToLoad)
    }

    fun checkSelection(selectedPath: List<Pair<Int, Int>>): Boolean {
        if (_isWordFound.value) return false
        val target = _currentLevel.value.targetCells

        // Match forward or reverse
        val isMatch = (selectedPath == target) || (selectedPath == target.reversed())

        if (isMatch) {
            _isWordFound.value = true
            _praiseWord.value = praiseOptions.random()
            startPictureRevealAnimation()
            return true
        }
        return false
    }

    private fun startPictureRevealAnimation() {
        revealJob?.cancel()
        revealJob = viewModelScope.launch {
            // Progressive colouring from 0f to 1f over 2.2 seconds with smooth steps
            val totalSteps = 45
            val stepDuration = 2200L / totalSteps
            for (step in 1..totalSteps) {
                _revealProgress.value = step.toFloat() / totalSteps
                delay(stepDuration)
            }
            _revealProgress.value = 1f
            _isPictureCompleted.value = true

            // Save completed status
            if (_isDailyMode.value) {
                saveDailyProgress()
            } else {
                saveProgress(_currentLevel.value.levelNumber)
            }

            // Small delay then show joyful celebration modal
            delay(400)
            _showCelebration.value = true
        }
    }

    fun useHint() {
        if (_isWordFound.value) return
        hintJob?.cancel()
        val firstCell = _currentLevel.value.targetCells.firstOrNull() ?: return
        _hintLetterPos.value = firstCell

        hintJob = viewModelScope.launch {
            delay(3500)
            _hintLetterPos.value = null
        }
    }

    fun selectMarker(marker: MarkerColor) {
        _activeMarker.value = marker
    }

    fun resetLevel() {
        loadLevel(_currentLevel.value)
    }

    fun dismissCelebration() {
        _showCelebration.value = false
    }

    fun nextLevel() {
        dismissCelebration()
        if (_isDailyMode.value) return
        val nextIdx = _currentLevel.value.levelNumber // 1-based, so levelNumber is next index in 0-based array
        if (nextIdx < GAME_LEVELS.size) {
            classicLevelIndex = nextIdx
            loadLevel(GAME_LEVELS[nextIdx])
        }
    }

    fun previousLevel() {
        if (_isDailyMode.value) return
        val prevIdx = _currentLevel.value.levelNumber - 2
        if (prevIdx >= 0) {
            classicLevelIndex = prevIdx
            loadLevel(GAME_LEVELS[prevIdx])
        }
    }

    fun selectClassicLevel(level: LevelData) {
        _isDailyMode.value = false
        val idx = GAME_LEVELS.indexOfFirst { it.levelNumber == level.levelNumber }
        if (idx >= 0) classicLevelIndex = idx
        loadLevel(level)
    }
}

