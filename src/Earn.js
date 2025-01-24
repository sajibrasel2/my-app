import React, { useState, useEffect } from "react";
import "./Earn.css";

const Earn = ({ updateBalance, addHistory }) => {
  const [staticTasks, setStaticTasks] = useState([]);
  const [userAnswers, setUserAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });
  const [congratsMessage, setCongratsMessage] = useState("");
  const [refreshTimeLeft, setRefreshTimeLeft] = useState(() => {
    const lastRefresh = localStorage.getItem("lastRefreshTime");
    const now = new Date().getTime();
    return lastRefresh ? Math.max(6 * 60 * 60 * 1000 - (now - lastRefresh), 0) : 6 * 60 * 60 * 1000;
  });

  // Fetch questions from Open Trivia API
  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      const data = await response.json();

      const formattedQuestions = data.results.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        correct_answer: q.correct_answer,
      }));

      setStaticTasks(formattedQuestions);
      localStorage.setItem("staticQuestions", JSON.stringify(formattedQuestions));
      localStorage.setItem("lastRefreshTime", new Date().getTime());
      setUserAnswers({}); // Clear answers after new questions
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  useEffect(() => {
    const lastRefresh = localStorage.getItem("lastRefreshTime");
    const now = new Date().getTime();

    if (lastRefresh && now - lastRefresh < 6 * 60 * 60 * 1000) {
      const storedQuestions = localStorage.getItem("staticQuestions");
      if (storedQuestions) {
        setStaticTasks(JSON.parse(storedQuestions));
        return;
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimeLeft((prev) => {
        if (prev <= 1000) {
          fetchQuestions();
          return 6 * 60 * 60 * 1000; // Reset timer to 6 hours
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAnswer = (selectedOption, questionIndex) => {
    const question = staticTasks[questionIndex];
    const correctAnswer = question.correct_answer;

    if (selectedOption === correctAnswer) {
      updateBalance(10); // Add 10 points
      addHistory(`🎉 Correct! You earned 10 points for Task ${questionIndex + 1}.`);
      setCongratsMessage("🎉 Congratulations! You earned 10 points! 🎉");
      setTimeout(() => setCongratsMessage(""), 3000); // Hide message after 3 seconds
    } else {
      addHistory(`❌ Incorrect answer for Task ${questionIndex + 1}.`);
    }

    const updatedAnswers = { ...userAnswers, [questionIndex]: selectedOption };
    setUserAnswers(updatedAnswers);
    localStorage.setItem("userAnswers", JSON.stringify(updatedAnswers));
  };

  return (
    <div className="earn-content">
      <h1 className="earn-title">Earn Rewards by Answering Questions!</h1>

      {congratsMessage && <div className="congrats-popup">{congratsMessage}</div>}

      <p className="refresh-timer">⏳ Next refresh in: {formatTime(refreshTimeLeft)}</p>

      <div className="tasks-container">
        {staticTasks.map((task, index) => (
          <div
            key={task.id}
            className={`task-card static-task ${
              userAnswers[index] === task.correct_answer
                ? "correct"
                : userAnswers[index]
                ? "incorrect"
                : ""
            }`}
          >
            <p className="task-question" dangerouslySetInnerHTML={{ __html: task.question }}></p>
            <div className="task-options">
              {task.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option, index)}
                  disabled={!!userAnswers[index]}
                  className={`option-button ${
                    userAnswers[index] === option
                      ? option === task.correct_answer
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earn;
