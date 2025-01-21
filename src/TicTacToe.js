import React, { useState, useEffect, useCallback } from "react";
import "./TicTacToe.css";

const TicTacToe = ({ updateBalance, addHistory }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameCount, setGameCount] = useState(0);
  const [cooldownEndTime, setCooldownEndTime] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameTimeLeft, setGameTimeLeft] = useState(60); // 1-minute game timer
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [congratsMessage, setCongratsMessage] = useState("");

  // Format time for display
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60);
    const seconds = ms % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Check if cooldown is active
  const isCooldownActive = useCallback(() => {
    if (!cooldownEndTime) return false;
    const now = new Date().getTime();
    return now < cooldownEndTime;
  }, [cooldownEndTime]);

  // Start a new game
  const startGame = () => {
    if (isCooldownActive()) return;
    if (gameCount >= 5) {
      const now = new Date().getTime();
      const cooldown = 6 * 60 * 60 * 1000; // 6 hours cooldown
      setCooldownEndTime(now + cooldown);
      setCooldownTimeLeft(cooldown / 1000);
      return;
    }

    setIsGameActive(true);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameTimeLeft(60);
  };

  // Reset game after win/loss/draw
  const resetGame = useCallback(() => {
    if (gameCount >= 5) {
      const now = new Date().getTime();
      const cooldown = 6 * 60 * 60 * 1000; // 6 hours cooldown
      setCooldownEndTime(now + cooldown);
      setCooldownTimeLeft(cooldown / 1000);
      setIsGameActive(false);
      return;
    }

    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameCount((prev) => prev + 1);
    setGameTimeLeft(60);
    setIsGameActive(false);
  }, [gameCount]);

  // Handle game timer
  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          resetGame(); // Reset game after timer finishes
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, resetGame]);

  // Handle cooldown timer
  useEffect(() => {
    if (isCooldownActive()) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        if (now >= cooldownEndTime) {
          setCooldownEndTime(null);
          setCooldownTimeLeft(0);
          setGameCount(0);
          clearInterval(interval);
        } else {
          setCooldownTimeLeft(Math.floor((cooldownEndTime - now) / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownEndTime, isCooldownActive]);

  // Handle user click on board
  const handleClick = (index) => {
    if (!isGameActive || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        updateBalance(10);
        addHistory("🎉 You won! +10 points");
        setCongratsMessage("🎉 Congratulations! You earned 10 points!");
        setTimeout(() => setCongratsMessage(""), 3000);
      } else {
        addHistory("AI won! Better luck next time.");
      }
      resetGame();
    } else {
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  // AI move logic
  const aiMove = (board) => {
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        move = i;
        break;
      }
    }
    board[move] = "O";
    setBoard([...board]);

    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      addHistory("AI won! Better luck next time.");
      resetGame();
    }
  };

  // Check for winner or draw
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

  return (
    <div className="content">
      <h1 className="section-title">Tic Tac Toe</h1>
      <p className="reward-info">Win the game to earn <strong>10 points!</strong></p>

      <p className="game-stats">Games Played: {gameCount}/5</p>
      {cooldownTimeLeft > 0 && (
        <p className="cooldown-timer">⏳ Cooldown Ends In: {formatTime(cooldownTimeLeft)}</p>
      )}

      {!isCooldownActive() && !isGameActive && (
        <button className="start-button" onClick={startGame}>
          Start Game
        </button>
      )}

      {isGameActive && (
        <div>
          <p className="game-timer">Time Left: {formatTime(gameTimeLeft)}</p>
          <div className="board">
            {board.map((cell, index) => (
              <button
                key={index}
                className={`cell ${cell === "X" ? "player-x" : "player-o"}`}
                onClick={() => handleClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>
          {winner && <p className="winner-message">Winner: {winner}</p>}
        </div>
      )}

      {congratsMessage && <div className="congrats-popup">{congratsMessage}</div>}
    </div>
  );
};

export default TicTacToe;
