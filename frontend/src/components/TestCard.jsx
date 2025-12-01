import { useNavigate } from 'react-router-dom';
import '../styles/TestCard.css';

function TestCard({ test }) {
  const navigate = useNavigate();

  const handleAttempt = () => {
    navigate(`/test/${test.id}`);
  };

  const handleLeaderboard = () => {
    navigate(`/leaderboard/${test.id}`);
  };

  return (
    <div className="test-card">
      <div className="test-card-header">
        <div className="test-icon">📝</div>
        <h3 className="test-title">{test.title}</h3>
      </div>
      
      <div className="test-card-body">
        <div className="test-info">
          <span className="test-label">Questions:</span>
          <span className="test-value">{test.questions.length}</span>
        </div>
        
        <div className="test-info">
          <span className="test-label">Attempts:</span>
          <span className="test-value">{test.attempts?.length || 0}</span>
        </div>
      </div>
      
      <div className="test-card-footer">
        <button className="attempt-btn" onClick={handleAttempt}>
          Take Test
        </button>
        <button className="leaderboard-btn" onClick={handleLeaderboard}>
          Leaderboard
        </button>
      </div>
    </div>
  );
}

export default TestCard;
