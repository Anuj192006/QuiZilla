import React, { useState } from "react";
import "../Styles/Student.css";
import { createOrg } from "../services/org";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);

  const organisations = [
    { name: "Newton School of Technology", joined: "Aug 2024" },
    { name: "Google Developer Club", joined: "Jan 2025" },
    { name: "AI Research Society", joined: "July 2025" },
  ];

  const upcomingTests = [
    { title: "IIT JEE", date: "29 Nov 2025" },
    { title: "Financial Advisory", date: "05 Dec 2025" },
    { title: "Current Affairs", date: "12 Dec 2025" },
  ];

  async function handleCreateOrg(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createOrg({ name: orgName });
      alert("Organisation created!");
      setShowForm(false);
      setOrgName("");
    } catch (err) {
      alert("Failed to create organisation");
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="student-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="horizontal-sections">

        <div className="card">
          <h2 className="card-title">Your Organisations</h2>
          <button onClick={() => setShowForm(true)}>Create Org</button>

          <div className="mini-card-container">
            {organisations.map((org, index) => (
              <div className="mini-card" key={index}>
                <button className="mini-title">{org.name}</button>
                <p className="mini-sub">Joined: {org.joined}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Orgs Joined</h2>
          <div className="mini-card-container">
            {upcomingTests.map((test, index) => (
              <div className="mini-card" key={index}>
                <p className="mini-title">{test.title}</p>
                <p className="mini-sub">{test.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h3>Create Organisation</h3>
            <form onSubmit={handleCreateOrg}>
              <input
                type="text"
                placeholder="Organisation Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
            <button className="close-btn" onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
