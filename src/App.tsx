import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { auth } from "./firebase";
import LandingPage from "./components/LandingPage";
import HabitTracker from "./components/HabitTracker";
import SupportPage from "./components/SupportPage";

function App() {
  const { user, loading, loginWithGoogle, loginWithMicrosoft, logout } =
    useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <LandingPage
                onGoogleLogin={loginWithGoogle}
                onMicrosoftLogin={loginWithMicrosoft}
              />
            ) : (
              <Navigate to="/app" />
            )
          }
        />
        <Route
          path="/app"
          element={
            user ? (
              <HabitTracker user={user} onLogout={logout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/support"
          element={user ? <SupportPage user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
