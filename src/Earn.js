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
    const apiUrl = "https://quizapi.io/api/v1/questions"; 
    const apiKey = "IbF1UGHVbpxhSQjsFwZUtNLDzDV5122aNRjA7iLg";  // আপনার নতুন API Key এখানে দিন

    try {
      const response = await fetch(`${apiUrl}?apiKey=${apiKey}&category=Science&difficulty=easy&limit=5`);

      // রেসপন্স চেক করুন
      if (!response.ok) {
        console.error("Failed to fetch data, status:", response.status);
        return;  // রেসপন্স যদি সফল না হয়, তাহলে কিছু না করুন
      }

      const data = await response.json();
      console.log("Fetched data:", data); // API থেকে আসা ডেটা দেখুন

      // ডেটার কাঠামো চেক করুন
      if (data && Array.isArray(data)) {
        setAiTasks(data); // যদি ডেটা অ্যারে হয়, তাহলে সেট করুন
      } else {
        console.log("Data is not an array or not available:", data); // ডেটা অ্যারে না হলে লগ করুন
        setAiTasks([]); // যদি ডেটা অ্যারে না হয়, তাহলে ফাঁকা অ্যারে সেট করুন
      }
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
    if (selectedOption === question.correct_answer) {
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

        {aiTasks.length > 0 ? (
          aiTasks.map((task, index) => (
            <div key={index} className="task-card ai-task">
              <p className="task-question">{task.question}</p> {/* প্রশ্ন দেখানো */}
              <div className="task-options">
                {[task.correct_answer, ...task.incorrect_answers].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(task.id, option)}
                    disabled={!!userAnswers[task.id]}
                    className={`option-button ${
                      userAnswers[task.id] === option
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
