import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./EmergencyInfo.css";

const EmergencyInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [patientData, setPatientData] = useState({
    name: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: [],
    medications: [],
    emergencyContacts: [],
    primaryDoctor: {
      name: "",
      phone: ""
    },
    primaryPharmacy: {
      name: "",
      phone: ""
    }
  });

  const [editedData, setEditedData] = useState(patientData);

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
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const patientRef = doc(db, "patients", uid);
        const patientSnap = await getDoc(patientRef);
        
        if (patientSnap.exists()) {
          const data = patientSnap.data();
          setPatientData({
            ...patientData,
            name: data.name,
            bloodType: data.emergency?.bloodType || "",
            allergies: data.emergency?.allergies || [],
            medications: data.medications || []
          });
          setEditedData({
            ...patientData,
            name: data.name,
            bloodType: data.emergency?.bloodType || "",
            allergies: data.emergency?.allergies || [],
            medications: data.medications || []
          });
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const patientRef = doc(db, "patients", uid);
      
      await updateDoc(patientRef, {
        emergency: {
          bloodType: editedData.bloodType,
          allergies: editedData.allergies
        },
        medications: editedData.medications
      });

      setPatientData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating patient data:", error);
    }
  };

  const handleCancel = () => {
    setEditedData(patientData);
    setIsEditing(false);
  };

  const handleAllergyChange = (index, value) => {
    const newAllergies = [...editedData.allergies];
    newAllergies[index] = value;
    setEditedData({ ...editedData, allergies: newAllergies });
  };

  const handleAddAllergy = () => {
    setEditedData({ ...editedData, allergies: [...editedData.allergies, ""] });
  };

  const handleRemoveAllergy = (index) => {
    const newAllergies = editedData.allergies.filter((_, i) => i !== index);
    setEditedData({ ...editedData, allergies: newAllergies });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...editedData.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setEditedData({ ...editedData, medications: newMedications });
  };

  const handleAddMedication = () => {
    setEditedData({
      ...editedData,
      medications: [...editedData.medications, { name: "", dosage: "" }]
    });
  };

  const handleRemoveMedication = (index) => {
    const newMedications = editedData.medications.filter((_, i) => i !== index);
    setEditedData({ ...editedData, medications: newMedications });
  };

  return (
    <div className="emergency-info-page">
      <Navbar />
      <div className="emergency-container">
        <h1 className="emergency-header">Emergency Info</h1>

        <div className="info-section">
          <h2 className="section-title">Patient Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name</span>
              <span className="value">{patientData.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Date of Birth</span>
              <span className="value">{patientData.dateOfBirth}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="section-header">
            <h2 className="section-title">Medical Information</h2>
            {userRole === "caregiver" && !isEditing && (
              <button className="edit-button" onClick={handleEdit}>
                Edit Medical Info
              </button>
            )}
            {isEditing && (
              <div className="edit-actions">
                <button className="save-button" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Blood Type:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.bloodType}
                  onChange={(e) =>
                    setEditedData({ ...editedData, bloodType: e.target.value })
                  }
                  className="edit-input"
                />
              ) : (
                <span className="value">{patientData.bloodType}</span>
              )}
            </div>
          </div>

          <div className="info-subsection">
            <h3 className="subsection-title">Allergies:</h3>
            {isEditing ? (
              <div className="edit-list">
                {editedData.allergies.map((allergy, index) => (
                  <div key={index} className="edit-item">
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) =>
                        handleAllergyChange(index, e.target.value)
                      }
                      className="edit-input"
                    />
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveAllergy(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="add-button" onClick={handleAddAllergy}>
                  + Add Allergy
                </button>
              </div>
            ) : (
              <ul className="info-list">
                {patientData.allergies.map((allergy, index) => (
                  <li key={index}>{allergy}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="info-subsection">
            <h3 className="subsection-title">Medications:</h3>
            {isEditing ? (
              <div className="edit-list">
                {editedData.medications.map((med, index) => (
                  <div key={index} className="edit-medication">
                    <input
                      type="text"
                      placeholder="Medication Name"
                      value={med.name}
                      onChange={(e) =>
                        handleMedicationChange(index, "name", e.target.value)
                      }
                      className="edit-input"
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicationChange(index, "dosage", e.target.value)
                      }
                      className="edit-input"
                    />
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="add-button" onClick={handleAddMedication}>
                  + Add Medication
                </button>
              </div>
            ) : (
              <div className="medication-table">
                <table>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.medications.map((med, index) => (
                      <tr key={index}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2 className="section-title">Emergency Contacts</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Emergency Services:</span>
              <span className="value">911</span>
            </div>
          </div>

          <div className="info-subsection">
            <h3 className="subsection-title">Emergency Contact:</h3>
            <ul className="info-list">
              {patientData.emergencyContacts.map((contact, index) => (
                <li key={index}>
                  {contact.name} - {contact.phone}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-subsection">
            <h3 className="subsection-title">Primary Doctor:</h3>
            <ul className="info-list">
              <li>
                {patientData.primaryDoctor.name} -{" "}
                {patientData.primaryDoctor.phone}
              </li>
            </ul>
          </div>

          <div className="info-subsection">
            <h3 className="subsection-title">Primary Pharmacy:</h3>
            <ul className="info-list">
              <li>
                {patientData.primaryPharmacy.name} -{" "}
                {patientData.primaryPharmacy.phone}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyInfo; 