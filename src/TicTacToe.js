import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import './TicTacToe.css'; // Ensure this import matches your CSS file location

const TicTacToe = ({ updateBalance, addHistory }) => {
  const [board, setBoard] = useLocalStorage("board", Array(9).fill(null));
  const [gameCount, setGameCount] = useLocalStorage("gameCount", 0);
  const [cooldownEndTime, setCooldownEndTime] = useLocalStorage(
    "cooldownEndTime",
    null
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

  // Check if cooldown is active
  const isCooldownActive = useCallback(() => {
    if (!cooldownEndTime) return false;
    const now = new Date().getTime();
    return now < cooldownEndTime;
  }, [cooldownEndTime]);

  // Start a new game
  const startGame = () => {
    if (gameCount >= 5 && !isCooldownActive()) {
      const now = new Date().getTime();
      const cooldown = 2 * 60 * 60 * 1000; // 2 hours cooldown
      setCooldownEndTime(now + cooldown);
      setIsGameActive(false);
      console.log("Cooldown started:", new Date(now + cooldown).toString());
      return;
    }

    if (isCooldownActive()) {
      console.log("Cooldown is active, cannot start the game.");
      return;
    }

    setIsGameActive(true);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTimeLeft(60);
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
    setTimeLeft(60);
  }, [gameCount, setCooldownEndTime, setBoard, setWinner, setGameCount]);

  // Handle cooldown timer
  useEffect(() => {
    if (isCooldownActive()) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        if (now >= cooldownEndTime) {
          setCooldownEndTime(null);
          setGameCount(0); // Reset game count after cooldown ends
          clearInterval(interval);
        } else {
          const timeRemaining = cooldownEndTime - now;
          setCooldownTimeLeft(timeRemaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownEndTime, isCooldownActive, setCooldownEndTime, setGameCount]);

  // Manage game timer
  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, resetGame]);

  // Check winner
  const checkWinner = useCallback((board) => {
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
  }, []);

  // Handle user click
  const handleClick = (index) => {
    if (!isGameActive || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        addHistory(`You won! +10 points`);
        updateBalance(10);
      } else if (gameWinner === "Draw") {
        addHistory(`It's a draw! No points earned`);
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
      addHistory(`AI won! No points earned`);
      resetGame();
    }
  };

  return (
    <div className="content">
      <h1 className="section-title">Tic Tac Toe</h1>
      <p className="instructions">
        Win a game to earn <b>10 points!</b>
      </p>
      <p className="game-count">
        Games Played: {gameCount}/5
      </p>

      {!isCooldownActive() ? (
        <>
          {!isGameActive && gameCount < 5 && (
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
          )}

          {isGameActive && (
            <div>
              <p className="timer">
                Time Left: {timeLeft}s
              </p>
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
              {winner && (
                <p className="winner">
                  {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="cooldown-message">
          ⏳ Cooldown Active: Wait for{" "}
          {Math.floor(cooldownTimeLeft / (1000 * 60 * 60))}h{" "}
          {Math.floor((cooldownTimeLeft % (1000 * 60 * 60)) / (1000 * 60))}m{" "}
          {Math.floor((cooldownTimeLeft % (1000 * 60)) / 1000)}s
        </p>
      )}
    </div>
  );
};

export default TicTacToe;
