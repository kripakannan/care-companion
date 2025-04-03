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
import CaregiverProfile from "./pages/CaregiverProfile";
import ViewPatient from "./pages/ViewPatient.jsx";
import ViewCaregiver from "./pages/ViewCaregiver";
import EmergencyInfo from "./pages/EmergencyInfo";
import CaregiverPatients from "./pages/CaregiverPatients";
import MedicationTracking from "./pages/MedicationTracking";
import CaregiverCalendar from "./pages/CaregiverCalendar";

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
          setRole(snap.data().role);
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
            <CaregiverPatients />
          ) : (
            <PatientProfile />
          )
        } />

        <Route path="/caregiver-profile" element={
          !user ? <Navigate to="/login" /> : <CaregiverProfile />
        } />

        <Route path="/patient/:id" element={
          !user ? <Navigate to="/login" /> : <ViewPatient />
        } />

        <Route path="/caregiver/:id" element={
          !user ? <Navigate to="/login" /> : <ViewCaregiver />
        } />

        <Route path="/edit-profile" element={
          !user ? <Navigate to="/login" /> : <EditProfile />
        } />

        <Route path="/choose-role" element={
          !user ? <Navigate to="/login" /> : <ChooseRole />
        } />

        <Route path="/emergency-info" element={
          !user ? <Navigate to="/login" /> : <EmergencyInfo />
        } />

        <Route path="/medication-tracking/:id" element={
          !user ? <Navigate to="/login" /> : <MedicationTracking />
        } />

        <Route path="/caregiver-calendar" element={<CaregiverCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;