import React, { useState, useEffect } from "react";
import "./App.css";

// Color theme variables
const COLORS = {
  primary: "#3f51b5",
  secondary: "#f50057",
  accent: "#ffeb3b"
};

/**
 * Calculate winner for a 3x3 tic-tac-toe board.
 * Returns 'X', 'O', or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Checks if the board is full and no winner --
 * returns true if tie, else false.
 */
function isTie(squares) {
  return squares.every((sq) => sq) && !calculateWinner(squares);
}

/**
 * PUBLIC_INTERFACE
 * Square - represents a single cell in the board
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === "X" ? COLORS.primary : COLORS.secondary,
        background: highlight
          ? COLORS.accent
          : "var(--bg-secondary, #f8f9fa)",
        borderColor: highlight ? COLORS.accent : "var(--border-color, #e9ecef)"
      }}
      aria-label={`Square ${value || "empty"}`}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board - 3x3 tic-tac-toe
 */
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      highlight={winningLine && winningLine.includes(i)}
    />
  );
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

/**
 * Get winning line if exists.
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Main App Component - Tic Tac Toe Game
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [winner, setWinner] = useState(null);

  // Minimalist theme always 'light' as per spec
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Compute winner or tie after move
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
  // Handle clicking a square
  const handleSquareClick = (i) => {
    if (squares[i] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((x) => !x);
  };

  // PUBLIC_INTERFACE
  // Restart game
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  };

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
      <div className="ttt-container" role="main" aria-label="Tic Tac Toe Game Board">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <button className="ttt-btn-restart" onClick={handleRestart}>
          {gameOver ? "Start New Game" : "Restart"}
        </button>
        <footer className="ttt-footer" style={{ marginTop: "2.5rem" }}>
          <small>
            Minimalist Game by KAVIA &mdash; Player vs Player
          </small>
        </footer>
      </div>
    </div>
  );
}
export default App;
