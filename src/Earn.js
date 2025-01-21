import React, { useState, useEffect } from "react";
import "./Earn.css";

const Earn = ({ updateBalance, addHistory }) => {
  // Static tasks (first 5 fixed questions)
  const staticTasks = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correct_answer: "Paris"
    },
    {
      id: 2,
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "O2", "NaCl"],
      correct_answer: "H2O"
    },
    {
      id: 3,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct_answer: "Mars"
    },
    {
      id: 4,
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
      correct_answer: "Blue Whale"
    },
    {
      id: 5,
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correct_answer: "8"
    },
  ];

  // States for questions, answers, and timing
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [refreshTimeLeft, setRefreshTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("refreshEndTime");
    const now = new Date().getTime();
    return storedTime ? Math.max(storedTime - now, 0) : 6 * 60 * 60 * 1000; // 6 hours
  });

  useEffect(() => {
    fetchQuizQuestions(); // Fetch quiz questions on initial load

    const interval = setInterval(() => {
      setRefreshTimeLeft((prev) => {
        if (prev <= 1000) {
          fetchQuizQuestions(); // Fetch new tasks after refresh time reaches zero
          return 6 * 60 * 60 * 1000; // Reset refresh time
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshTimeLeft]);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("refreshEndTime", new Date().getTime() + refreshTimeLeft);
  }, [userAnswers, refreshTimeLeft]);

  // Function to fetch new quiz questions
  const fetchQuizQuestions = async () => {
    const apiUrl = "https://opentdb.com/api.php?amount=5&type=multiple"; // Open Trivia Database API URL

    const retryDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const response = await fetch(apiUrl);

      if (response.status === 429) {
        console.error("Rate limit exceeded. Retrying after 1 minute...");
        await retryDelay(60000); // Retry after 1 minute
        return fetchQuizQuestions(); // Retry the request
      }

      if (!response.ok) {
        console.error("Failed to fetch quiz data:", response.status);
        return;
      }

      const data = await response.json();

      if (data.response_code === 0) {
        setQuizData(data.results); // Set quiz data from API response
      } else {
        console.error("Failed to fetch valid quiz data:", data);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  // Function to handle answers
  const handleAnswer = (selectedOption, questionIndex) => {
    const question = quizData[questionIndex];
    const correctAnswer = question.correct_answer;

    // Check if answer is correct
    if (selectedOption === correctAnswer) {
      updateBalance(10); // Add 10 points for correct answer
      addHistory(`🎉 Congratulations! You earned 10 points for the correct answer to Task ${questionIndex + 1}.`);
    } else {
      addHistory(`❌ Incorrect answer for Task ${questionIndex + 1}`);
    }

    // Save the user answer
    const updatedAnswers = { ...userAnswers, [questionIndex]: selectedOption };
    setUserAnswers(updatedAnswers);
  };

  // Format the remaining time
  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="earn-content">
      <h1 className="earn-title">Earn Rewards by Completing Tasks!</h1>

      <p className="timer">
        🕒 New tasks in: <strong>{formatTime(refreshTimeLeft)}</strong>
      </p>

      <div className="tasks-container">
        {/* Static Questions (Fixed) */}
        <div className="static-questions">
          <h2>Fixed Questions</h2>
          {staticTasks.map((task) => (
            <div key={task.id} className="task-card static-task">
              <p className="task-question">{task.question}</p>
              <div className="task-options">
                {task.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option, task.id - 1)} // Use task.id - 1 to get index for static task
                    disabled={!!userAnswers[task.id - 1]}
                    className={`option-button ${
                      userAnswers[task.id - 1] === option
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

        {/* Dynamic Quiz Questions (from API) */}
        {quizData.length > 0 ? (
          quizData.map((task, index) => (
            <div key={index} className="task-card ai-task">
              <p className="task-question">{task.question}</p>
              <div className="task-options">
                {[...task.incorrect_answers, task.correct_answer]
                  .sort(() => Math.random() - 0.5)
                  .map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option, index + 5)} // +5 to differentiate between static and dynamic questions
                      disabled={!!userAnswers[index + 5]}
                      className={`option-button ${
                        userAnswers[index + 5] === option
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
          ))
        ) : (
          <p>No tasks available at the moment. Please wait...</p>
        )}
      </div>
    </div>
  );
};

export default Earn;
