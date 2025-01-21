import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import "./TicTacToe.css";

const TicTacToe = ({ updateBalance, addHistory }) => {
  const [board, setBoard] = useLocalStorage("board", Array(9).fill(null));
  const [gameCount, setGameCount] = useLocalStorage("gameCount", 0);
  const [cooldownEndTime, setCooldownEndTime] = useLocalStorage(
    "cooldownEndTime",
    null
  );
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(() => {
    const now = new Date().getTime();
    return cooldownEndTime ? Math.max(cooldownEndTime - now, 0) : 0;
  });

  // Check if cooldown is active
  const isCooldownActive = useCallback(() => {
    if (!cooldownEndTime) return false;
    const now = new Date().getTime();
    return now < cooldownEndTime;
  }, [cooldownEndTime]);

  // Format cooldown time
  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Start a new game
  const startGame = () => {
    if (gameCount >= 5) {
      const now = new Date().getTime();
      const cooldown = 2 * 60 * 60 * 1000; // 2 hours cooldown
      setCooldownEndTime(now + cooldown);
      setIsGameActive(false);
      return;
    }
    setIsGameActive(true);
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  // Reset game logic
  const resetGame = useCallback(() => {
    if (gameCount >= 5) {
      const now = new Date().getTime();
      const cooldown = 2 * 60 * 60 * 1000; // 2 hours cooldown
      setCooldownEndTime(now + cooldown);
      setIsGameActive(false);
      return;
    }
    setBoard(Array(9).fill(null));
    setWinner(null);
    setGameCount((prev) => prev + 1);
  }, [gameCount, setCooldownEndTime, setBoard, setWinner, setGameCount]);

  // Cooldown timer logic
  useEffect(() => {
    if (isCooldownActive()) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        if (now >= cooldownEndTime) {
          setCooldownEndTime(null);
          setGameCount(0); // Reset game count after cooldown ends
          setCooldownTimeLeft(0); // Reset cooldown timer
          clearInterval(interval);
        } else {
          setCooldownTimeLeft(cooldownEndTime - now);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownEndTime, isCooldownActive, setCooldownEndTime, setGameCount]);

  // Handle user click
  const handleClick = (index) => {
    if (!isGameActive || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    // Game logic and winner check
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        addHistory(`🎉 You won! +10 points`);
        updateBalance(10);
      } else if (gameWinner === "Draw") {
        addHistory(`It's a draw!`);
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
      addHistory(`AI won!`);
      resetGame();
    }
  };

  // Check winner logic
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

      {!isCooldownActive() ? (
        <>
          {!isGameActive && (
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
          )}
          {isGameActive && (
            <div>
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
              {winner && <p>Winner: {winner}</p>}
            </div>
          )}
        </>
      ) : (
        <p className="cooldown-message">
          ⏳ Cooldown Active: {formatTime(cooldownTimeLeft)}
        </p>
      )}
    </div>
  );
};

export default TicTacToe;
