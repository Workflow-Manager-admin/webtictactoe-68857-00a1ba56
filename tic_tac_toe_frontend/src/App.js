import React, { useState, useEffect, memo } from "react";
import "./App.css";

/**
 * Branding/color constants—matches theme from documentation
 */
const COLORS = {
  primary: "#3f51b5",
  secondary: "#f50057",
  accent: "#ffeb3b",
};

/**
 * Calculate winner for a 3x3 tic-tac-toe board.
 * Returns 'X', 'O', or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Get winning line indices if there's a winner, else null
 * @param {array} squares
 * @returns {array | null}
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return line;
    }
  }
  return null;
}

/**
 * Check if board is full and no winner (i.e., tie)
 * @param {array} squares
 * @returns {boolean}
 */
function isTie(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
/**
 * Square - Button cell representing a single game board cell
 */
const Square = memo(function Square({ value, onClick, highlight, pos }) {
  // Accessibility: add aria-label and aria-pressed
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === "X" ? COLORS.primary : COLORS.secondary,
        background: highlight ? COLORS.accent : "var(--bg-secondary, #f8f9fa)",
        borderColor: highlight ? COLORS.accent : "var(--border-color, #e9ecef)",
        outline: highlight ? `2px solid ${COLORS.accent}` : undefined,
      }}
      aria-label={`Cell ${pos + 1} (${value || "empty"})`}
      aria-pressed={!!value}
      tabIndex={0}
      data-testid={`square-${pos}`}
    >
      {value}
    </button>
  );
});

// PUBLIC_INTERFACE
/**
 * Board - 3x3 tic tac toe board
 */
const Board = memo(function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" role="row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                highlight={winningLine && winningLine.includes(idx)}
                pos={idx}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

/**
 * PUBLIC_INTERFACE
 * Main App component for Tic Tac Toe
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [winner, setWinner] = useState(null);

  /** Always use light mode, set on mount */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  /** Recompute win/tie/gameOver after every move */
  useEffect(() => {
    const w = calculateWinner(squares);
    if (w) {
      setWinner(w);
      setGameOver(true);
      setWinningLine(getWinningLine(squares));
    } else if (isTie(squares)) {
      setWinner(null);
      setGameOver(true);
      setWinningLine(null);
    } else {
      setWinner(null);
      setGameOver(false);
      setWinningLine(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  /** Handles when a user clicks a square */
  const handleSquareClick = (i) => {
    if (squares[i] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  /** Restart the game, set everything to initial state */
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  };

  // Accessibility: e.g. status region is aria-live so screen readers update
  const turnColor = xIsNext ? COLORS.primary : COLORS.secondary;

  let status;
  if (winner) {
    status = (
      <span>
        <span style={{ color: winner === "X" ? COLORS.primary : COLORS.secondary, fontWeight: 600 }}>
          {winner}
        </span>{" "}
        wins!
      </span>
    );
  } else if (gameOver) {
    status = (
      <span>
        <span style={{ color: "#888" }}>It's a tie!</span>
      </span>
    );
  } else {
    status = (
      <span>
        Turn:{" "}
        <span style={{ color: turnColor, fontWeight: 600 }}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-app-bg">
      <main className="ttt-container" role="main" aria-label="Tic Tac Toe Main Game">
        <h1 className="ttt-title" tabIndex={0}>
          Tic Tac Toe
        </h1>
        <div
          className="ttt-status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={0}
        >
          {status}
        </div>
        <Board squares={squares} onSquareClick={handleSquareClick} winningLine={winningLine} />
        <button
          className="ttt-btn-restart"
          onClick={handleRestart}
          aria-label={gameOver ? "Start New Game" : "Restart"}
        >
          {gameOver ? "Start New Game" : "Restart"}
        </button>
        <footer className="ttt-footer" style={{ marginTop: "2.5rem" }}>
          <small>
            Minimalist Game by KAVIA &mdash; Player vs Player
          </small>
        </footer>
      </main>
    </div>
  );
}

export default App;
