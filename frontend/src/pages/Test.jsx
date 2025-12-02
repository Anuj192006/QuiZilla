import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Test.css';

function Test() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (!submitted && test) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [submitted, test]);

  const fetchTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/test/single/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch test');
      }

      setTest(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < test.questions.length) {
      if (!window.confirm('You have unanswered questions. Submit anyway?')) {
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/test/attempt/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([qIndex, aIndex]) => ({
            questionIndex: parseInt(qIndex),
            selectedOption: parseInt(aIndex)
          })),
          timeTaken: timeElapsed
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit test');
      }

      setSubmitted(true);
      alert(`Test submitted! Your score: ${data.score}/${test.questions.length}`);
      navigate(`/leaderboard/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !test) {
    return <div className="error-page">{error}</div>;
  }

  const question = test?.questions[currentQuestion];

  return (
    <div className="test-page">
      <div className="test-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>{test?.title}</h1>
        <div className="timer">⏱️ {formatTime(timeElapsed)}</div>
      </div>

      <div className="test-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / test?.questions.length) * 100}%` }}
          />
        </div>

        <div className="question-info">
          <span>Question {currentQuestion + 1} of {test?.questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>

        <div className="question-card">
          <h2 className="question-text">{question?.q}</h2>

          <div className="options-list">
            {question?.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button 
            className="nav-btn" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {currentQuestion === test?.questions.length - 1 ? (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Test
            </button>
          ) : (
            <button className="nav-btn" onClick={handleNext}>
              Next
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default Test;
