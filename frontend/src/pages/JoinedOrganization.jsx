import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TestCard from '../components/TestCard';
import '../styles/Organization.css';

function JoinedOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/org/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch organization');
      }

      setOrg(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !org) {
    return <div className="error-page">{error}</div>;
  }

  return (
    <div className="organization-page">
      <div className="org-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <div className="org-title">
          <h1>{org?.name}</h1>
          <span className="org-code-badge">Code: {org?.joinCode}</span>
        </div>
      </div>

      <section className="tests-section">
        <h2>Available Tests</h2>
        <div className="tests-grid">
          {org?.tests?.length === 0 ? (
            <p className="empty-message">No tests available yet.</p>
          ) : (
            org?.tests?.map(test => (
              <TestCard key={test.id} test={test} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default JoinedOrganization;
