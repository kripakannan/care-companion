import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import AddPatient from "./AddPatient.jsx";
import { Link } from "react-router-dom";

export default function CaregiverProfile() {
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
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Your Patients
        </h1>

        {linkedPatients.length === 0 ? (
          <p className="text-gray-600 text-center">
            You haven't linked any patients yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {linkedPatients.map((p) => (
              <Link to={`/patient/${p.uid}`} key={p.uid}>
                <li className="p-4 bg-white shadow rounded-xl hover:bg-gray-50 cursor-pointer">
                  <p className="text-black font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">ID: {p.id}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}

        <h2 className="text-xl font-semibold mt-10 mb-4 text-indigo-700">
          Add a New Patient
        </h2>
        <div className="mt-4">
          <AddPatient />
        </div>
      </div>
    </div>
  );
}