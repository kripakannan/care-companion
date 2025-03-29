import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import HomeScreen from "./pages/HomeScreen";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route
          path="/home"
          element={user ? <HomeScreen /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={user ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/resources"
          element={user ? <ResourcesPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;