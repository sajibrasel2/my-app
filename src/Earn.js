import React, { useEffect, useState } from "react";
import "./Earn.css";

const Earn = ({ updateBalance, addHistory }) => {
  const staticTasks = [
    { id: 1, title: "Task 1: Coming Soon" },
    { id: 2, title: "Task 2: Coming Soon" },
    { id: 3, title: "Task 3: Coming Soon" },
    { id: 4, title: "Task 4: Coming Soon" },
    { id: 5, title: "Task 5: Coming Soon" },
  ];

  const [aiTasks, setAiTasks] = useState([]);
  const [userAnswers, setUserAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("userAnswers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [refreshTimeLeft, setRefreshTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("refreshEndTime");
    const now = new Date().getTime();
    return storedTime ? Math.max(storedTime - now, 0) : 6 * 60 * 60 * 1000; // ৬ ঘণ্টা
  });

  useEffect(() => {
    if (refreshTimeLeft === 6 * 60 * 60 * 1000 || aiTasks.length === 0) {
      fetchNewTasks(); // নতুন প্রশ্ন ফেচ
    }

    const interval = setInterval(() => {
      setRefreshTimeLeft((prev) => {
        if (prev <= 1000) {
          fetchNewTasks(); // নতুন প্রশ্ন ফেচ
          return 6 * 60 * 60 * 1000; // রিফ্রেশ টাইম রিসেট
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshTimeLeft]);

  useEffect(() => {
    // LocalStorage-এ ডেটা সেভ
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("refreshEndTime", new Date().getTime() + refreshTimeLeft);
  }, [userAnswers, refreshTimeLeft]);

  const fetchNewTasks = async () => {
    // এখানে আপনার API URL লিখুন
    const apiUrl = "https://example.com/api/questions"; // পরিবর্তন করুন আপনার API অনুযায়ী
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setAiTasks(data); // নতুন প্রশ্ন সেট
      setUserAnswers({}); // আগের উত্তর ক্লিয়ার
    } catch (error) {
      console.error("Error fetching new tasks:", error);
    }
  };

  const handleAnswer = (id, selectedOption) => {
    if (userAnswers[id]) return;

    const updatedAnswers = { ...userAnswers, [id]: selectedOption };
    setUserAnswers(updatedAnswers);

    const question = aiTasks.find((task) => task.id === id);
    if (selectedOption === question.correct) {
      updateBalance(5);
      addHistory(`Earned 5 points from Task ${id}`);
    } else {
      addHistory(`Incorrect answer for Task ${id}`);
    }
  };

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
        {staticTasks.map((task) => (
          <div key={task.id} className="task-card static-task">
            <p>{task.title}</p>
          </div>
        ))}

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
