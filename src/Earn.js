import React, { useState, useEffect } from "react";
import "./Earn.css";

const Earn = ({ updateBalance, addHistory }) => {
  // Function to generate default 10 questions
  const defaultQuestions = () => [
    { id: 1, question: "What is the capital of Italy?", options: ["Rome", "Paris", "Berlin", "Madrid"], correct_answer: "Rome" },
    { id: 2, question: "What is the freezing point of water?", options: ["0°C", "100°C", "50°C", "-10°C"], correct_answer: "0°C" },
    { id: 3, question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Van Gogh", "Picasso", "Michelangelo"], correct_answer: "Leonardo da Vinci" },
    { id: 4, question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "400,000 km/s"], correct_answer: "300,000 km/s" },
    { id: 5, question: "What is 5 x 5?", options: ["15", "20", "25", "30"], correct_answer: "25" },
    { id: 6, question: "Who discovered gravity?", options: ["Isaac Newton", "Albert Einstein", "Galileo", "Copernicus"], correct_answer: "Isaac Newton" },
    { id: 7, question: "What is the national animal of India?", options: ["Tiger", "Lion", "Elephant", "Peacock"], correct_answer: "Tiger" },
    { id: 8, question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct_answer: "Carbon Dioxide" },
    { id: 9, question: "Which is the smallest country in the world?", options: ["Vatican City", "Monaco", "Liechtenstein", "Malta"], correct_answer: "Vatican City" },
    { id: 10, question: "What is the square of 12?", options: ["122", "124", "144", "146"], correct_answer: "144" },
  ];

  const [staticTasks, setStaticTasks] = useState(() => {
    const lastRefresh = localStorage.getItem("lastRefreshTime");
    const now = new Date().getTime();

    if (lastRefresh && now - lastRefresh < 6 * 60 * 60 * 1000) {
      const storedQuestions = localStorage.getItem("staticQuestions");
      return storedQuestions ? JSON.parse(storedQuestions) : defaultQuestions();
    }

    const newQuestions = defaultQuestions();
    localStorage.setItem("staticQuestions", JSON.stringify(newQuestions));
    localStorage.setItem("lastRefreshTime", now);
    return newQuestions;
  });

  const [userAnswers, setUserAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [congratsMessage, setCongratsMessage] = useState(""); // For showing the congratulation popup
  const [refreshTimeLeft, setRefreshTimeLeft] = useState(() => {
    const lastRefresh = localStorage.getItem("lastRefreshTime");
    const now = new Date().getTime();
    return lastRefresh ? Math.max(6 * 60 * 60 * 1000 - (now - lastRefresh), 0) : 6 * 60 * 60 * 1000;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimeLeft((prev) => {
        if (prev <= 1000) {
          const newQuestions = defaultQuestions();
          setStaticTasks(newQuestions);
          localStorage.setItem("staticQuestions", JSON.stringify(newQuestions));
          localStorage.setItem("lastRefreshTime", new Date().getTime());
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
            <p className="task-question">{task.question}</p>
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
