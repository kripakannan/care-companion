import React from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ChooseRole() {
  const navigate = useNavigate();

  const setUserRole = async (role) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
  
    await setDoc(doc(db, "users", uid), {
      name: auth.currentUser.displayName || "Anonymous",
      email: auth.currentUser.email,
      role,
      linkedPatientIds: [],
    });
  
    if (role === "patient") {
      await setDoc(doc(db, "patients", uid), {
        name: auth.currentUser.displayName || "New Patient",
        email: auth.currentUser.email,
        id: `PAT-${uid.slice(0, 6).toUpperCase()}`,
        primary: true,
        heartRate: 0,
        emergency: {
          bloodType: "",
          allergies: [],
          contact: "",
        },
        medications: [],
        logs: [],
      }, { merge: true });
    } else if (role === "caregiver") {
        await setDoc(doc(db, "caregivers", uid), {
          name: auth.currentUser.displayName || "New Caregiver",
          email: auth.currentUser.email,
          organization: "", // Optional: caregiver profile-specific fields
          linkedPatientIds: [],
        });
      }      
  
    window.location.href = "/home"; 
  };  

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-6">Welcome! Choose your role:</h1>
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
        onClick={() => setUserRole("patient")}
      >
        I'm a Patient
      </button>
      <button
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
        onClick={() => setUserRole("caregiver")}
      >
        I'm a Caregiver
      </button>
    </div>
  );
}
