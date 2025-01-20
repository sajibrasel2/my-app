import React, { useState, useEffect } from "react";
import "./Earn.css";

const Earn = ({ updateBalance, addHistory }) => {
  const staticTasks = [
    { id: 1, title: "Task 1: Coming Soon" },
    { id: 2, title: "Task 2: Coming Soon" },
    { id: 3, title: "Task 3: Coming Soon" },
    { id: 4, title: "Task 4: Coming Soon" },
    { id: 5, title: "Task 5: Coming Soon" },
  ];

  const aiTasksData = [
    { id: 6, text: "What is 2 + 2?", options: ["3", "4"], correct: "4" },
    { id: 7, text: "What is the capital of France?", options: ["Paris", "London"], correct: "Paris" },
    { id: 8, text: "What is 5 x 3?", options: ["15", "10"], correct: "15" },
    { id: 9, text: "What is the color of the sky?", options: ["Blue", "Green"], correct: "Blue" },
    { id: 10, text: "How many days in a week?", options: ["5", "7"], correct: "7" },
  ];

  const [aiTasks, setAiTasks] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    const now = new Date().getTime();
    const sixHours = 6 * 60 * 60 * 1000;

    if (!lastUpdateTime || now - lastUpdateTime >= sixHours) {
      setAiTasks(shuffleArray(aiTasksData));
      setUserAnswers({});
      setLastUpdateTime(now);
    }
  }, [lastUpdateTime]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (id, selectedOption) => {
    if (userAnswers[id]) return; // Prevent answering more than once
    setUserAnswers({ ...userAnswers, [id]: selectedOption });

    const question = aiTasks.find((task) => task.id === id);
    if (selectedOption === question.correct) {
      updateBalance(5); // Add 5 points
      addHistory(`Earned 5 points from Task ${id}`);
    }
  };

  return (
    <div className="earn-content">
      <h1 className="earn-title">Earn Rewards by Completing Tasks!</h1>

      <div className="tasks-container">
        {/* Static Tasks */}
        {staticTasks.map((task) => (
          <div key={task.id} className="task-card static-task">
            <p>{task.title}</p>
          </div>
        ))}

        {/* AI Tasks */}
        {aiTasks.map((task) => (
          <div key={task.id} className="task-card ai-task">
            <p className="task-question">{task.text}</p>
            <div className="task-options">
              {task.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(task.id, option)}
                  disabled={!!userAnswers[task.id]}
                  className={`option-button ${
                    userAnswers[task.id] === option
                      ? option === task.correct
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
