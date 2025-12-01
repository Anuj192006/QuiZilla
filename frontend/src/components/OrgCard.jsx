import { useNavigate } from 'react-router-dom';
import '../styles/OrgCard.css';

function OrgCard({ org, isOwned, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isOwned) {
      navigate(`/org/${org.id}`);
    } else {
      navigate(`/joined/${org.id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${org.name}"?`)) {
      onDelete(org.id);
    }
  };

  return (
    <div className="org-card" onClick={handleClick}>
      <div className="org-card-header">
        <div className="org-icon">🏢</div>
        <h3 className="org-name">{org.name}</h3>
      </div>
      
      <div className="org-card-body">
        <div className="org-info">
          <span className="org-label">Join Code:</span>
          <span className="org-code">{org.joinCode}</span>
        </div>
        
        {org.tests && (
          <div className="org-info">
            <span className="org-label">Tests:</span>
            <span className="org-value">{org.tests.length}</span>
          </div>
        )}
      </div>
      
      {isOwned && (
        <div className="org-card-footer">
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            aria-label="Delete organization"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default OrgCard;
