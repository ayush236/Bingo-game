import React, { useState, useEffect } from 'react';

const Bingo = () => {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(Array(25).fill(false));
  const [completedLines, setCompletedLines] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const generateRandomBoard = () => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  };

  const resetGame = () => {
    setBoard(generateRandomBoard());
    setSelected(Array(25).fill(false));
    setCompletedLines(0);
    setIsWon(false);
  };

  // Initialize board on mount
  useEffect(() => {
    resetGame();
  }, []);

  // Handle Box Click
  const handleBoxClick = (index) => {
    if (isWon) return; // Stop clicks if already won

    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);

    checkBingoConditions(newSelected);
  };

  // Check rows, columns, and diagonals
  const checkBingoConditions = (currentSelected) => {
    let lines = 0;

    for (let row = 0; row < 5; row++) {
      let isRowComplete = true;
      for (let col = 0; col < 5; col++) {
        if (!currentSelected[row * 5 + col]) {
          isRowComplete = false;
          break;
        }
      }
      if (isRowComplete) lines++;
    }

    for (let col = 0; col < 5; col++) {
      let isColComplete = true;
      for (let row = 0; row < 5; row++) {
        if (!currentSelected[row * 5 + col]) {
          isColComplete = false;
          break;
        }
      }
      if (isColComplete) lines++;
    }

    // 3. Check Main Diagonal (Top-Left to Bottom-Right)
    let isDiag1Complete = true;
    for (let i = 0; i < 5; i++) {
      if (!currentSelected[i * 5 + i]) {
        isDiag1Complete = false;
        break;
      }
    }
    if (isDiag1Complete) lines++;

    let isDiag2Complete = true;
    for (let i = 0; i < 5; i++) {
      if (!currentSelected[i * 5 + (4 - i)]) {
        isDiag2Complete = false;
        break;
      }
    }
    if (isDiag2Complete) lines++;

    setCompletedLines(lines);

    // 5 Lines required to display B-I-N-G-O / Win
    if (lines >= 5) {
      setIsWon(true);
    }
  };

  // Build current B-I-N-G-O progress display
  const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
  const currentBingoString = bingoLetters
    .slice(0, Math.min(completedLines, 5))
    .join(' ');

  return (
    <div className="bingo-wrapper">
      <h2>Bingo Game</h2>
      
      {/* Displays letters as lines are completed */}
      <div className="bingo-status">
        Score: <span className="bingo-letters">{currentBingoString || '—'}</span>
      </div>

      {/* Grid Container */}
      <div className="grid-container">
        {board.map((num, idx) => (
          <div
            key={idx}
            className={`box ${selected[idx] ? 'selected' : ''}`}
            onClick={() => handleBoxClick(idx)}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Completion Banner */}
      {isWon && <div className="win-message">🎉 BINGO! You Won! 🎉</div>}

      <button className="reset-btn" onClick={resetGame}>
        Restart / Again
      </button>
    </div>
  );
};

export default Bingo;