import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScrapEstimatorPage from './pages/ScrapEstimatorPage';
import TutorialsPage from './pages/TutorialsPage';
import ThriftMapPage from './pages/ThriftMapPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
