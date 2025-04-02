import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

export default function ViewPatient() {
  const { id } = useParams(); // patient UID from URL
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
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-gray-600 mb-4">Patient ID: {data.id}</p>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-indigo-600">Heart Rate</h2>
            <p className="text-xl">{data.heartRate} bpm</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold text-indigo-600">Medications Taken</h2>
            <p>
              {
                data.medications.filter((med) => med.taken).length
              } / {data.medications.length}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Emergency Info</h2>
          <p>Blood Type: {data.emergency.bloodType}</p>
          <p>Allergies: {data.emergency.allergies.join(", ")}</p>
          <p>Emergency Contact: {data.emergency.contact}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Medications</h2>
          <ul className="mt-2 space-y-2">
            {data.medications.map((med, idx) => (
              <li key={idx} className="p-2 bg-gray-50 rounded">
                {med.name} - {med.dose} at {med.time} ({med.taken ? "✔" : "✖"})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
