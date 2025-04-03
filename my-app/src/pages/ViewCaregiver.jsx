// pages/ViewCaregiver.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

export default function ViewCaregiver() {
  const { id } = useParams(); // caregiver UID from URL
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const ref = doc(db, "caregivers", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      }
    };
    fetch();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-gray-600 mb-4">{data.email}</p>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-indigo-700">Assigned Patients</h2>
          {data.linkedPatientIds?.length ? (
            <ul className="mt-2 space-y-2">
              {data.linkedPatientIds.map((pid) => (
                <li key={pid} className="text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded">
                  Patient ID: {pid}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No linked patients yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}