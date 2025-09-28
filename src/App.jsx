import './App.css';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScrapEstimatorPage from './pages/ScrapEstimatorPage';
import TutorialsPage from './pages/TutorialsPage';
import ThriftMapPage from './pages/ThriftMapPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scrap-estimator" element={<ScrapEstimatorPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/thrift-map" element={<ThriftMapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: 'black',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4c5f0d',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#e74c3c',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthContextProvider>
  );
}

export default App;
