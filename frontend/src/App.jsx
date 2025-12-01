import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import JoinedOrganization from './pages/JoinedOrganization';
import Test from './pages/Test';
import Leaderboard from './pages/Leaderboard';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/org/:id" 
              element={
                <ProtectedRoute>
                  <Organization />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/joined/:id" 
              element={
                <ProtectedRoute>
                  <JoinedOrganization />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test/:id" 
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard/:id" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
