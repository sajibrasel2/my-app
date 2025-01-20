import React, { useState, useEffect } from "react";

const TicTacToe = ({ updateBalance, addHistory }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameCount, setGameCount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0 || winner) {
      setTimeout(resetGame, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft, winner]);

  useEffect(() => {
    const sixHourReset = setInterval(() => {
      resetFullGame();
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(sixHourReset);
  }, []);

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every((cell) => cell !== null) ? "Draw" : null;
  };

  const minimax = (board, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "X") return -10;
    if (winner === "O") return 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      board.forEach((cell, index) => {
        if (cell === null) {
          board[index] = "O";
          const score = minimax(board, false);
          board[index] = null;
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      board.forEach((cell, index) => {
        if (cell === null) {
          board[index] = "X";
          const score = minimax(board, true);
          board[index] = null;
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };

  const aiMove = (board) => {
    let bestScore = -Infinity;
    let move;
    board.forEach((cell, index) => {
      if (cell === null) {
        board[index] = "O";
        const score = minimax(board, false);
        board[index] = null;
        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    if (move !== undefined) {
      board[move] = "O";
      setBoard([...board]);
      const gameWinner = checkWinner(board);
      if (gameWinner) {
        setWinner(gameWinner);
        logHistory(gameWinner);
      }
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner || gameCount >= 5) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        setTotalPoints((prev) => prev + 10);
        logHistory("Player");
      }
    } else if (!gameWinner && newBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
      logHistory("Draw");
    } else {
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  const logHistory = (result) => {
    const currentTime = new Date().toLocaleString(); // Add current date and time
    if (result === "Player") {
      addHistory(`You won! +10 points (${currentTime})`);
    } else if (result === "O") {
      addHistory(`AI won! No points earned (${currentTime})`);
    } else {
      addHistory(`It's a draw! No points earned (${currentTime})`);
    }
  };

  const resetGame = () => {
    if (gameCount >= 5) {
      updateBalance(totalPoints);
      setTotalPoints(0);
    }
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameCount((prev) => prev + 1);
    setTimeLeft(60);
  };

  const resetFullGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameCount(0);
    setTotalPoints(0);
    setTimeLeft(60);
  };

  return (
    <div className="content">
      <h1 className="section-title">Tic Tac Toe</h1>
      <p>Games Played: {gameCount}/5</p>
      <p>Time Left: {timeLeft}s</p>
      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell === "X" ? "player-x" : "player-o"}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || winner}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && <p>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</p>}
    </div>
  );
};

export default TicTacToe;
