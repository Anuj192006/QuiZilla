import React from "react";
import "../Styles/Student.css";

const Dashboard = () => {
  const organisations = [
    { name: "Newton School of Technology", joined: "Aug 2024" },
    { name: "Google Developer Club", joined: "Jan 2025" },
    { name: "AI Research Society", joined: "July 2025" }
  ];

  const upcomingTests = [
    { title: "IIT JEE", date: "29 Nov 2025" },
    { title: "Financial Advisory", date: "05 Dec 2025" },
    { title: "Current Affairs", date: "12 Dec 2025" }
  ];

  return (
    <div className="student-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="horizontal-sections">

        <div className="card">
          <h2 className="card-title">Your Organisations</h2>
          <button>Create Org</button>

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
    </div>
  );
};

export default Dashboard;
