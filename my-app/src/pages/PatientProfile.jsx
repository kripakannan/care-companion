import React, { useEffect, useState } from "react";
import "./PatientProfile.css";
import { auth, db } from "../firebase";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
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
        } else {
          console.log("No patient profile found");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  if (!patientData) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <section className="patient-header">
          <h1>{patientData.name}</h1>
          <p>ID: {patientData.id}</p>
          {patientData.primary && <span className="tag">Primary Patient</span>}
          <Link to="/edit-profile">
            <button className="edit-profile-btn">Edit Profile</button>
          </Link>
        </section>

        <section className="summary-cards">
          <div className="card">
            <h2>Heart Rate</h2>
            <p>{patientData.heartRate} bpm</p>
          </div>
          <div className="card">
            <h2>Medications Taken</h2>
            <p>
              {
                patientData.medications.filter((med) => med.taken).length
              } / {patientData.medications.length}
            </p>
          </div>
        </section>

        <section className="emergency-info">
          <h2>Emergency Info</h2>
          <p>Blood Type: {patientData.emergency.bloodType}</p>
          <p>Allergies: {patientData.emergency.allergies.join(", ")}</p>
          <p>Emergency Contact: {patientData.emergency.contact}</p>
        </section>

        <section className="medications">
          <h2>Today’s Medications</h2>
          <ul>
            {patientData.medications.map((med, index) => (
              <li key={index} className={med.taken ? "taken" : "not-taken"}>
                <strong>{med.name}</strong> - {med.dose} at {med.time}{" "}
                <span className="status">{med.taken ? "✔ Taken" : "✖ Missed"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="health-logs">
          <h2>Recent Logs</h2>
          <ul>
            {patientData.logs.map((log, index) => (
              <li key={index}>
                <strong>{log.type}</strong> — {log.time}
                <button className="view-btn">View</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="linked-caregivers">
          <h2>My Caregivers</h2>
          {linkedCaregivers.length === 0 ? (
            <p className="text-gray-600">No caregivers linked yet.</p>
          ) : (
            <ul className="space-y-4">
              {linkedCaregivers.map((cg) => (
                <Link to={`/caregiver/${cg.uid}`} key={cg.uid}>
                  <li className="p-4 bg-white shadow rounded-xl hover:bg-gray-50 cursor-pointer">
                    <p className="text-black font-semibold">{cg.name}</p>
                    <p className="text-sm text-gray-500">{cg.email}</p>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </section>

        <section className="pending-requests">
          <PendingRequests />
        </section>
      </div>
    </div>
  );
};

export default PatientProfile;