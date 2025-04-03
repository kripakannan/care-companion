import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import "./ViewPatient.css";

export default function ViewPatient() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const ref = doc(db, "patients", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setData(snap.data());
    };
    fetch();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="view-patient-page">
      <Navbar />
      <div className="view-patient-container">
        {/* Patient Overview Section */}
        <div className="patient-overview">
          <h1 className="patient-name">{data.name}</h1>
          <p className="patient-id">ID: {data.id}</p>
          {data.primary && (
            <span className="primary-patient-label">Primary Patient</span>
          )}
          <p className="patient-email">{data.email}</p>
        </div>

        {/* Emergency Information Section */}
        <div className="emergency-section">
          <h2 className="section-title">Emergency Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Blood Type:</span>
              <span className="value">{data.emergency?.bloodType || "Not specified"}</span>
            </div>
            <div className="info-item">
              <span className="label">Allergies:</span>
              <span className="value">{data.emergency?.allergies?.join(", ") || "None"}</span>
            </div>
            <div className="info-item">
              <span className="label">Emergency Contact:</span>
              <span className="value">{data.emergency?.contact || "Not specified"}</span>
            </div>
          </div>
          <Link 
            to="/emergency-info" 
            state={{ patientId: id }}
            className="view-all-button"
          >
            View All Emergency Info
          </Link>
        </div>

        {/* Today's Medications Section */}
        <div className="medications-section">
          <h2 className="section-title">Today's Medications</h2>
          <div className="medications-count">
            {data.medications?.filter(med => med.taken).length || 0} of {data.medications?.length || 0} medications taken today
          </div>
          <div className="medications-list">
            {data.medications?.map((med, idx) => (
              <div key={idx} className="medication-item">
                <div className="medication-name">{med.name}</div>
                <div className="medication-details">
                  <span className="dosage">{med.dose}</span>
                  <span className="time">– {med.time}</span>
                  <span className={`status ${med.taken ? "taken" : "not-taken"}`}>
                    {med.taken ? "Taken" : "Not Taken"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to={`/medication-tracking/${id}`} className="view-all-button">
            View All Medication Tracking
          </Link>
        </div>
      </div>
    </div>
  );
}
