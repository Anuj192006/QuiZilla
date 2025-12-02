import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [testTitle, setTestTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [id]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/test/leaderboard/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }

      setLeaderboard(data.leaderboard);
      setTestTitle(data.testTitle);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-page">{error}</div>;
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🏆 Leaderboard</h1>
      </div>

      <div className="test-info-card">
        <h2>{testTitle}</h2>
        <p>{leaderboard.length} attempt{leaderboard.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="leaderboard-container">
        {leaderboard.length === 0 ? (
          <p className="empty-message">No attempts yet. Be the first!</p>
        ) : (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="rank-col">Rank</div>
              <div className="name-col">Name</div>
              <div className="score-col">Score</div>
              <div className="time-col">Time</div>
              <div className="date-col">Submitted</div>
            </div>

            {leaderboard.map((entry, index) => (
              <div key={index} className={`table-row ${index < 3 ? 'top-three' : ''}`}>
                <div className="rank-col">
                  <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                </div>
                <div className="name-col">{entry.userName}</div>
                <div className="score-col">
                  <span className="score-badge">{entry.score}</span>
                </div>
                <div className="time-col">{formatTime(entry.timeTaken)}</div>
                <div className="date-col">{formatDate(entry.submittedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
