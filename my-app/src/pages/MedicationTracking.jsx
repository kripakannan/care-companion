import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./MedicationTracking.css";

const MedicationTracking = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [patientData, setPatientData] = useState({
    name: "",
    medications: []
  });

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    days: [],
    startDate: "",
    endDate: ""
  });

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchUserRole = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      const patientRef = doc(db, "patients", id);
      const patientSnap = await getDoc(patientRef);
      
      if (patientSnap.exists()) {
        const data = patientSnap.data();
        setPatientData({
          name: data.name,
          medications: data.medications || []
        });
      }
    };
    fetchPatientData();
  }, [id]);

  const handleMedicationStatus = async (medicationIndex) => {
    try {
      const updatedMedications = [...patientData.medications];
      updatedMedications[medicationIndex] = {
        ...updatedMedications[medicationIndex],
        taken: !updatedMedications[medicationIndex].taken
      };

      const patientRef = doc(db, "patients", id);
      await updateDoc(patientRef, {
        medications: updatedMedications
      });

      setPatientData(prev => ({
        ...prev,
        medications: updatedMedications
      }));
    } catch (error) {
      console.error("Error updating medication status:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const patientRef = doc(db, "patients", id);
      await updateDoc(patientRef, {
        medications: [...patientData.medications, newMedication]
      });

      setPatientData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication]
      }));
      setIsEditing(false);
      setNewMedication({
        name: "",
        dosage: "",
        days: [],
        startDate: "",
        endDate: ""
      });
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewMedication({
      name: "",
      dosage: "",
      days: [],
      startDate: "",
      endDate: ""
    });
  };

  const toggleDay = (day) => {
    const days = newMedication.days.includes(day)
      ? newMedication.days.filter(d => d !== day)
      : [...newMedication.days, day];
    setNewMedication({ ...newMedication, days });
  };

  return (
    <div className="medication-tracking-page">
      <Navbar />
      <div className="medication-tracking-container">
        <div className="page-header">
          <h1 className="page-title">Medicine Tracking</h1>
          {userRole === "caregiver" && !isEditing && (
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-section">
              <h3>Add New Medication</h3>
              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Days Taken</h3>
              <div className="days-checkboxes">
                {weekDays.map(day => (
                  <label key={day} className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={newMedication.days.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Times Taken</h3>
              <div className="date-inputs">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="medication-section">
              <h2 className="section-title">Medication Details</h2>
              <div className="medication-table">
                <table>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Days</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.medications.map((med, index) => (
                      <tr key={index}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.days?.join(", ")}</td>
                        <td>{med.startDate} to {med.endDate}</td>
                        <td>
                          <button
                            className={`status-button ${med.taken ? "taken" : "not-taken"}`}
                            onClick={() => handleMedicationStatus(index)}
                          >
                            {med.taken ? "Taken" : "Not Taken"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="calendar-section">
              <h2 className="section-title">Weekly Calendar</h2>
              <div className="calendar-grid">
                {weekDays.map(day => (
                  <div key={day} className="calendar-day">
                    <h3>{day}</h3>
                    <ul>
                      {patientData.medications
                        .filter(med => med.days?.includes(day))
                        .map((med, index) => (
                          <li key={index} className={med.taken ? "taken" : "not-taken"}>
                            {med.name} - {med.dosage}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationTracking; 