import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AddPatient from "./AddPatient.jsx";
import "./CaregiverPatients.css";

export default function CaregiverPatients() {
  const [linkedPatients, setLinkedPatients] = useState([]);

  useEffect(() => {
    const fetchCaregiverData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDocRef = doc(db, "caregivers", uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const { linkedPatientIds = [] } = userSnap.data();

        const patients = await Promise.all(
          linkedPatientIds.map(async (patientId) => {
            const patientRef = doc(db, "patients", patientId);
            const patientSnap = await getDoc(patientRef);

            if (patientSnap.exists()) {
              const data = patientSnap.data();
              return {
                uid: patientId,
                name: data.name || "Unnamed Patient",
                id: data.id || "Unknown ID",
              };
            }

            return null;
          })
        );

        setLinkedPatients(patients.filter(Boolean));
      }
    };

    fetchCaregiverData();
  }, []);

  return (
    <div className="caregiver-patients-page">
      <Navbar />
      <div className="caregiver-patients-container">
        <h1 className="page-title">Your Patients</h1>

        {linkedPatients.length === 0 ? (
          <p className="no-patients">You haven't linked any patients yet.</p>
        ) : (
          <ul className="patients-list">
            {linkedPatients.map((p) => (
              <Link to={`/patient/${p.uid}`} key={p.uid}>
                <li className="patient-card">
                  <p className="patient-name">{p.name}</p>
                  <p className="patient-id">ID: {p.id}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}

        <div className="add-patient-section">
          <h2 className="section-title">Add a New Patient</h2>
          <div className="add-patient-container">
            <AddPatient />
          </div>
        </div>
      </div>
    </div>
  );
} 