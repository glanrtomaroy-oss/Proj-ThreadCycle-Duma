import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ScrapEstimatorPage from './pages/ScrapEstimatorPage';
import TutorialsPage from './pages/TutorialsPage';
import ThriftMapPage from './pages/ThriftMapPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<HomePage user={user} />}
          />
          <Route
            path="/scrap-estimator"
            element={<ScrapEstimatorPage user={user} />}
          />
          <Route
            path="/tutorials"
            element={<TutorialsPage user={user} />}
          />
          <Route
            path="/thrift-map"
            element={
              <ErrorBoundary>
                <ThriftMapPage user={user} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route
            path="/login"
            element={<LoginPageWithNav setUser={setUser} />}
          />
          <Route
            path="/admin"
            element={
              user?.role === 'admin'
                ? <AdminPage user={user} />
                : <HomePage user={user} />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// LoginPage wrapper to handle navigation
function LoginPageWithNav({ setUser }) {
  const navigate = useNavigate();

  const handleUserLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  return <LoginPage setUser={handleUserLogin} />;
}

export default App;