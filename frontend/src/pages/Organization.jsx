import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TestCard from '../components/TestCard';
import '../styles/Organization.css';

function Organization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [testForm, setTestForm] = useState({
    title: '',
    questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }]
  });
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

  const handleAddQuestion = () => {
    setTestForm({
      ...testForm,
      questions: [...testForm.questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = testForm.questions.filter((_, i) => i !== index);
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...testForm.questions];
    newQuestions[qIndex][field] = value;
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...testForm.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setTestForm({ ...testForm, questions: newQuestions });
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quizilla-0gjl.onrender.com/test/create/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: testForm.title,
          questions: testForm.questions.map(q => ({
            q: q.question,
            options: q.options,
            correctIndex: parseInt(q.correctIndex)
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test');
      }

      setShowCreateTest(false);
      setTestForm({
        title: '',
        questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }]
      });
      fetchOrganization();
    } catch (err) {
      setError(err.message);
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
        <button className="create-test-btn" onClick={() => setShowCreateTest(true)}>
          + Create Test
        </button>
      </div>

      <section className="tests-section">
        <h2>Tests</h2>
        <div className="tests-grid">
          {org?.tests?.length === 0 ? (
            <p className="empty-message">No tests created yet.</p>
          ) : (
            org?.tests?.map(test => (
              <TestCard key={test.id} test={test} />
            ))
          )}
        </div>
      </section>

      {showCreateTest && (
        <div className="modal-overlay" onClick={() => setShowCreateTest(false)}>
          <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Test</h2>
            <form onSubmit={handleCreateTest}>
              <div className="form-group">
                <label>Test Title</label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  required
                  placeholder="Enter test title"
                />
              </div>

              <div className="questions-container">
                <h3>Questions</h3>
                {testForm.questions.map((q, qIndex) => (
                  <div key={qIndex} className="question-block">
                    <div className="question-header">
                      <h4>Question {qIndex + 1}</h4>
                      {testForm.questions.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => handleRemoveQuestion(qIndex)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Question Text</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        required
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="options-grid">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="option-group">
                          <label>Option {optIndex + 1}</label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            required
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label>Correct Answer</label>
                      <select
                        value={q.correctIndex}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctIndex', e.target.value)}
                      >
                        <option value="0">Option 1</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                      </select>
                    </div>
                  </div>
                ))}

                <button type="button" className="add-question-btn" onClick={handleAddQuestion}>
                  + Add Question
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateTest(false)}>Cancel</button>
                <button type="submit">Create Test</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Organization;
