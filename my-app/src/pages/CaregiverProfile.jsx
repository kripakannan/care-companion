import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./CaregiverProfile.css";

const CaregiverProfile = () => {
  const navigate = useNavigate();
  const [caregiverData, setCaregiverData] = useState({
    name: "Kit Tea",
    email: "KitTeaKat@hotmail.com",
    medicalAffiliation: "",
    state: "",
    address: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  useEffect(() => {
    const fetchCaregiverData = async () => {
      const user = auth.currentUser;
      if (user) {
        const caregiverRef = doc(db, "caregivers", user.uid);
        const caregiverSnap = await getDoc(caregiverRef);
        
        if (caregiverSnap.exists()) {
          const data = caregiverSnap.data();
          setCaregiverData({
            name: data.name || "",
            email: data.email || "",
            medicalAffiliation: data.medicalAffiliation || "",
            state: data.state || "",
            address: data.address || ""
          });
        }
      }
    };
    fetchCaregiverData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const caregiverRef = doc(db, "caregivers", user.uid);
        await updateDoc(caregiverRef, caregiverData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaregiverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="caregiver-profile-page">
      <Navbar />
      <div className="caregiver-profile-container">
        <h1 className="profile-header">Caregiver Profile</h1>
        
        <div className="profile-section">
          <div className="profile-field">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={caregiverData.name}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <div className="field-value">{caregiverData.name}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            <div className="field-value">{caregiverData.email}</div>
          </div>

          <div className="profile-field">
            <label>Medical Affiliation</label>
            {isEditing ? (
              <input
                type="text"
                name="medicalAffiliation"
                value={caregiverData.medicalAffiliation}
                onChange={handleChange}
                className="edit-input"
                placeholder="Enter your medical affiliation"
              />
            ) : (
              <div className="field-value">{caregiverData.medicalAffiliation || "Not specified"}</div>
            )}
          </div>

          <div className="profile-field">
            <label>State</label>
            {isEditing ? (
              <select
                name="state"
                value={caregiverData.state}
                onChange={handleChange}
                className="edit-input"
              >
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <div className="field-value">{caregiverData.state || "Not specified"}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={caregiverData.address}
                onChange={handleChange}
                className="edit-input"
                placeholder="Enter your address"
                rows="3"
              />
            ) : (
              <div className="field-value">{caregiverData.address || "Not specified"}</div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-actions">
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button 
            className="edit-profile-button"
            onClick={() => navigate('/settings')}
          >
            Edit Account in Settings
          </button>
        )}
      </div>
    </div>
  );
};

export default CaregiverProfile;