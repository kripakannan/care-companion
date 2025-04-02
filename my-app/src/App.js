import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ResourcesPage from "./pages/ResourcesPage";
import HomeScreen from "./pages/HomeScreen";
import PatientProfile from "./pages/PatientProfile";
import EditProfile from "./pages/EditProfile.jsx";
import ChooseRole from "./pages/ChooseRole.jsx";
import CaregiverProfile from "./pages/CaregiverProfile.jsx";
import ViewPatient from "./pages/ViewPatient.jsx";
import ViewCaregiver from "./pages/ViewCaregiver";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
  
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
  
        if (snap.exists()) {
          setRole(snap.data().role); // ✅ Set the role here
        }
      } else {
        setUser(null);
        setRole(null);
      }
  
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

        <Route path="/profile" element={
          !user ? (
            <Navigate to="/login" />
          ) : role === null ? (
            <div>Loading profile...</div>
          ) : role === "caregiver" ? (
            <CaregiverProfile />
          ) : (
            <PatientProfile />
          )
        } />

        <Route path="/patient/:id" element={<ViewPatient />} />

        <Route path="/caregiver/:id" element={<ViewCaregiver />} />

        <Route
          path="/edit-profile"
          element={user ? <EditProfile /> : <Navigate to="/login" />}
        />

        <Route
          path="/choose-role"
          element={user ? <ChooseRole /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;