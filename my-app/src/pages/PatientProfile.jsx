import React, { useEffect, useState } from "react";
import "./PatientProfile.css";
import { auth, db } from "../firebase";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PendingRequests from "./PendingRequests";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState(null);
  const [linkedCaregivers, setLinkedCaregivers] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const docRef = doc(db, "patients", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPatientData(data);

          const { linkedCaregiverIds = [] } = data;

          const caregivers = await Promise.all(
            linkedCaregiverIds.map(async (cid) => {
              const caregiverRef = doc(db, "caregivers", cid);
              const caregiverSnap = await getDoc(caregiverRef);
              if (caregiverSnap.exists()) {
                const info = caregiverSnap.data();
                return {
                  uid: cid,
                  name: info.name || "Unnamed Caregiver",
                  email: info.email || "",
                };
              }
              return null;
            })
          );

          setLinkedCaregivers(caregivers.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const handleMedicationStatus = async (medicationIndex) => {
    if (!patientData) return;

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const updatedMedications = [...patientData.medications];
      updatedMedications[medicationIndex] = {
        ...updatedMedications[medicationIndex],
        taken: !updatedMedications[medicationIndex].taken
      };

      const docRef = doc(db, "patients", uid);
      await updateDoc(docRef, {
        medications: updatedMedications
      });

      setPatientData({
        ...patientData,
        medications: updatedMedications
      });
    } catch (error) {
      console.error("Error updating medication status:", error);
    }
  };

  if (!patientData) return <div>Loading...</div>;

  return (
    <div className="patient-profile-page">
      <Navbar />
      <div className="patient-profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-title-container">
            <h1 className="profile-title">Profile</h1>
            <div className="profile-divider"></div>
          </div>
          <div className="patient-info">
            <div className="patient-name-container">
              <h2 className="patient-name">{patientData.name}</h2>
              <div className="patient-id-container">
                <span className="id-label">ID:</span>
                <span className="patient-id">{patientData.id}</span>
              </div>
            </div>
            <div className="patient-email-container">
              <span className="email-label">Email:</span>
              <span className="patient-email">{patientData.email}</span>
            </div>
          </div>
        </div>

        {/* Emergency Information Section */}
        <div className="emergency-section">
          <h2 className="section-title">Emergency Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Blood Type:</span>
              <span className="value">{patientData.emergency?.bloodType || "Not specified"}</span>
            </div>
            <div className="info-item">
              <span className="label">Allergies:</span>
              <span className="value">{patientData.emergency?.allergies?.join(", ") || "None"}</span>
            </div>
            <div className="info-item">
              <span className="label">Emergency Contact:</span>
              <span className="value">{patientData.emergency?.contact || "Not specified"}</span>
            </div>
          </div>
          <Link to="/emergency-info" className="view-all-button">
            View All
          </Link>
        </div>

        {/* Today's Medications Section */}
        <div className="medications-section">
          <h2 className="section-title">Today's Medications</h2>
          <div className="medications-count">
            {patientData.medications?.filter(med => med.taken).length || 0} of {patientData.medications?.length || 0} medications taken today
          </div>
          <div className="medications-list">
            {patientData.medications?.map((med, idx) => (
              <div key={idx} className="medication-item">
                <div className="medication-name">{med.name}</div>
                <div className="medication-details">
                  <span className="dosage">{med.dose}</span>
                  <span className="time">– {med.time}</span>
                  <button 
                    className={`status-button ${med.taken ? "taken" : "not-taken"}`}
                    onClick={() => handleMedicationStatus(idx)}
                  >
                    {med.taken ? "Taken" : "Not Taken"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to={`/medication-tracking/${auth.currentUser?.uid}`} className="view-all-button">
            View All
          </Link>
        </div>

        {/* My Caregivers Section */}
        <div className="caregivers-section">
          <h2 className="section-title">My Caregivers</h2>
          {linkedCaregivers.length === 0 ? (
            <p className="no-caregivers">No caregivers linked yet.</p>
          ) : (
            <div className="caregivers-list">
              {linkedCaregivers.map((cg) => (
                <div key={cg.uid} className="caregiver-item">
                  <div className="caregiver-info">
                    <span className="caregiver-name">{cg.name}</span>
                    <span className="caregiver-email">{cg.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests Section */}
        <div className="pending-requests-section">
          <PendingRequests />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;