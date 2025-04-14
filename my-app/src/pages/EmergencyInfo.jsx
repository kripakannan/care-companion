import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./EmergencyInfo.css";
import { useLocation, useNavigate } from "react-router-dom";

const EmergencyInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patients, setPatients] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

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

      setCurrentUserId(uid);
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const role = userSnap.data().role;
        setUserRole(role);
        
        // If caregiver, fetch their patients
        if (role === "caregiver") {
          const patientsQuery = query(
            collection(db, "patients"),
            where("caregivers", "array-contains", uid)
          );
          const patientsSnap = await getDocs(patientsQuery);
          const patientsData = patientsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPatients(patientsData);
          
          // If patient ID is provided in location state, use it
          if (location.state?.patientId) {
            setSelectedPatientId(location.state.patientId);
          } else if (patientsData.length > 0) {
            // Automatically select the first patient if none is specified
            setSelectedPatientId(patientsData[0].id);
          }
        } else {
          // If user is a patient, use their own ID
          setSelectedPatientId(uid);
        }
      }
    };

    fetchUserRole();
  }, [location.state]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!selectedPatientId) return;

        const patientRef = doc(db, "patients", selectedPatientId);
        const patientSnap = await getDoc(patientRef);
        
        if (patientSnap.exists()) {
          const data = patientSnap.data();
          console.log("Fetched patient data:", data); // Debug log
          const newData = {
            ...patientData,
            name: data.name || "",
            dateOfBirth: data.dateOfBirth || "",
            bloodType: data.emergency?.bloodType || "",
            allergies: data.emergency?.allergies || [],
            medications: data.medications || [],
            primaryDoctors: Array.isArray(data.emergency?.primaryDoctors)
              ? data.emergency.primaryDoctors
              : [{ name: "", phone: "", specialty: "" }],
            primaryPharmacy: data.emergency?.primaryPharmacy || { name: "", phone: "" },
            emergencyContacts: data.emergency?.emergencyContacts || []
          };
          setPatientData(newData);
          setEditedData(newData);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    if (selectedPatientId) {
      console.log("Fetching data for patient:", selectedPatientId); // Debug log
      fetchPatientData();
    }
  }, [selectedPatientId]);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientData.name || userRole === null) {
      setIsLoading(false);
    }
  }, [patientData, userRole]);

  if (isLoading) {
    return (
      <div className="emergency-info-page">
        <Navbar />
        <div className="emergency-container">
          <h1 className="emergency-header">Emergency Info</h1>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedPatientId) return;

      const patientRef = doc(db, "patients", selectedPatientId);
      
      await updateDoc(patientRef, {
        emergency: {
          bloodType: editedData.bloodType,
          allergies: editedData.allergies,
          primaryDoctors: editedData.primaryDoctors,
          primaryPharmacy: editedData.primaryPharmacy,
          emergencyContacts: editedData.emergencyContacts
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

  const handleAddEmergencyContact = () => {
    setEditedData({
      ...editedData,
      emergencyContacts: [...editedData.emergencyContacts, { name: "", phone: "", relationship: "" }]
    });
  };

  const handleRemoveEmergencyContact = (index) => {
    const newContacts = editedData.emergencyContacts.filter((_, i) => i !== index);
    setEditedData({ ...editedData, emergencyContacts: newContacts });
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...editedData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setEditedData({ ...editedData, emergencyContacts: newContacts });
  };

  return (
    <div className="emergency-info-page">
      <Navbar />
      <div className="emergency-container">
        <h1 className="emergency-header">Emergency Info</h1>

        {userRole === "caregiver" && patients.length > 0 && (
          <div className="patient-selector">
            <label>Select Patient:</label>
            <select
              value={selectedPatientId || ""}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="patient-select"
            >
              <option value="">Choose a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedPatientId && patientData.name && (
          <>
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
              <div className="section-header">
                <h2 className="section-title">Emergency Contacts</h2>
                {!isEditing && (
                  <button className="edit-button" onClick={handleEdit}>
                    Edit Emergency Contacts
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
                  <span className="label">Emergency Services:</span>
                  <span className="value">911</span>
                </div>
              </div>

              <div className="info-subsection">
                <h3 className="subsection-title">Primary Doctors:</h3>
                {isEditing ? (
                  <div className="edit-list">
                    {editedData.primaryDoctors.map((doc, index) => (
                      <div key={index} className="edit-contact">
                        <div className="edit-field">
                          <label>Name:</label>
                          <input
                            type="text"
                            value={doc.name}
                            onChange={(e) => {
                              const updated = [...editedData.primaryDoctors];
                              updated[index].name = e.target.value;
                              setEditedData({ ...editedData, primaryDoctors: updated });
                            }}
                            className="edit-input"
                            placeholder="Doctor Name"
                          />
                        </div>
                        <div className="edit-field">
                          <label>Phone:</label>
                          <input
                            type="tel"
                            value={doc.phone}
                            onChange={(e) => {
                              const updated = [...editedData.primaryDoctors];
                              updated[index].phone = e.target.value;
                              setEditedData({ ...editedData, primaryDoctors: updated });
                            }}
                            className="edit-input"
                            placeholder="Phone Number"
                          />
                        </div>
                        <div className="edit-field">
                          <label>Specialty:</label>
                          <input
                            type="text"
                            value={doc.specialty}
                            onChange={(e) => {
                              const updated = [...editedData.primaryDoctors];
                              updated[index].specialty = e.target.value;
                              setEditedData({ ...editedData, primaryDoctors: updated });
                            }}
                            className="edit-input"
                            placeholder="Specialty"
                          />
                        </div>
                        <button
                          className="remove-button"
                          onClick={() => {
                            const updated = editedData.primaryDoctors.filter((_, i) => i !== index);
                            setEditedData({ ...editedData, primaryDoctors: updated });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="add-button"
                      onClick={() =>
                        setEditedData({
                          ...editedData,
                          primaryDoctors: [...editedData.primaryDoctors, { name: "", phone: "", specialty: "" }]
                        })
                      }
                    >
                      + Add Doctor
                    </button>
                  </div>
                ) : (
                  <div className="contacts-list">
                    {patientData.primaryDoctors.map((doc, index) => (
                      <div key={index} className="contact-info">
                        <p><strong>Name:</strong> {doc.name}</p>
                        <p><strong>Phone:</strong> {doc.phone}</p>
                        <p><strong>Specialty:</strong> {doc.specialty}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>

              <div className="info-subsection">
                <h3 className="subsection-title">Primary Pharmacy:</h3>
                {isEditing ? (
                  <div className="edit-contact">
                    <div className="edit-field">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={editedData.primaryPharmacy.name}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            primaryPharmacy: {
                              ...editedData.primaryPharmacy,
                              name: e.target.value
                            }
                          })
                        }
                        className="edit-input"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Phone:</label>
                      <input
                        type="tel"
                        value={editedData.primaryPharmacy.phone}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            primaryPharmacy: {
                              ...editedData.primaryPharmacy,
                              phone: e.target.value
                            }
                          })
                        }
                        className="edit-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="contact-info">
                    <p><strong>Name:</strong> {patientData.primaryPharmacy.name}</p>
                    <p><strong>Phone:</strong> {patientData.primaryPharmacy.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmergencyInfo; 