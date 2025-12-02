import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgCard from '../components/OrgCard';
import '../styles/Dashboard.css';

function Dashboard() {
  const [createdOrgs, setCreatedOrgs] = useState([]);
  const [joinedOrgs, setJoinedOrgs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', password: '' });
  const [joinForm, setJoinForm] = useState({ joinCode: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchOrganizations();
  }, [navigate]);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [createdRes, joinedRes] = await Promise.all([
        fetch('https://quizilla-0gjl.onrender.com/org/created', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://quizilla-0gjl.onrender.com/org/joined', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const createdData = await createdRes.json();
      const joinedData = await joinedRes.json();

      if (createdRes.ok) setCreatedOrgs(createdData);
      if (joinedRes.ok) setJoinedOrgs(joinedData);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://quizilla-0gjl.onrender.com/org/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organization');
      }

      setShowCreateModal(false);
      setCreateForm({ name: '', password: '' });
      fetchOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinOrg = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://quizilla-0gjl.onrender.com/org/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(joinForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join organization');
      }

      setShowJoinModal(false);
      setJoinForm({ joinCode: '', password: '' });
      fetchOrganizations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteOrg = async (orgId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/org/${orgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchOrganizations();
      }
    } catch (err) {
      console.error('Error deleting organization:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <button className="create-btn" onClick={() => setShowCreateModal(true)}>
            + Create Organization
          </button>
          <button className="join-btn" onClick={() => setShowJoinModal(true)}>
            Join Organization
          </button>
        </div>
      </div>

      <section className="org-section">
        <h2>My Organizations</h2>
        <div className="org-grid">
          {createdOrgs.length === 0 ? (
            <p className="empty-message">You haven't created any organizations yet.</p>
          ) : (
            createdOrgs.map(org => (
              <OrgCard 
                key={org.id} 
                org={org} 
                isOwned={true}
                onDelete={handleDeleteOrg}
              />
            ))
          )}
        </div>
      </section>

      <section className="org-section">
        <h2>Joined Organizations</h2>
        <div className="org-grid">
          {joinedOrgs.length === 0 ? (
            <p className="empty-message">You haven't joined any organizations yet.</p>
          ) : (
            joinedOrgs.map(org => (
              <OrgCard 
                key={org.id} 
                org={org} 
                isOwned={false}
              />
            ))
          )}
        </div>
      </section>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Organization</h2>
            <form onSubmit={handleCreateOrg}>
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                  placeholder="Enter organization name"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  required
                  placeholder="Set organization password"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Join Organization</h2>
            <form onSubmit={handleJoinOrg}>
              <div className="form-group">
                <label>Join Code</label>
                <input
                  type="text"
                  value={joinForm.joinCode}
                  onChange={(e) => setJoinForm({ ...joinForm, joinCode: e.target.value })}
                  required
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={joinForm.password}
                  onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                  required
                  placeholder="Enter organization password"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowJoinModal(false)}>Cancel</button>
                <button type="submit">Join</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
