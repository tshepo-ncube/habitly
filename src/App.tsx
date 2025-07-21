import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HabitTracker from './components/HabitTracker';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading, loginWithGoogle, loginWithMicrosoft, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/app" replace />
          ) : (
            <LandingPage 
              onGoogleLogin={loginWithGoogle}
              onMicrosoftLogin={loginWithMicrosoft}
            />
          )
        } 
      />
      <Route 
        path="/app" 
        element={
          user ? (
            <HabitTracker user={user} onLogout={logout} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;