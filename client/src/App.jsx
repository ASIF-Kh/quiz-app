import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/generate-quiz`,
        { topic }
      );
      setQuiz(response.data.quiz);
      setScore(null);
      setAnswers({});
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz");
    }
    setLoading(false);
  };

  const handleAnswer = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const calculateScore = () => {
    const correct = quiz.filter(
      (question, index) => answers[index] === question.correctAnswer
    ).length;
    setScore({ correct, total: quiz.length });
  };

  return (
    <div className="App">
      <h1>AI Quiz Generator</h1>

      <form onSubmit={generateQuiz}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>

      {quiz && (
        <div className="quiz-container">
          {quiz.map((question, index) => (
            <div key={index} className="question">
              <h3>
                Question {index + 1}: {question.question}
              </h3>
              <div className="options">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(index, option)}
                    className={answers[index] === option ? "selected" : ""}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={calculateScore}>Show Results</button>
        </div>
      )}

      {score && (
        <div className="results">
          <h2>
            Your Score: {score.correct}/{score.total}
          </h2>
        </div>
      )}
    </div>
  );
}

export default App;
