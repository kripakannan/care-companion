import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function AddPatient() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleAddPatient = async () => {
    const caregiverUid = auth.currentUser?.uid;
    if (!caregiverUid || !email) return;

    try {
      // 1. Find patient by email
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("role", "==", "patient")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatusMessage("❌ No patient found with that email.");
        return;
      }

      const patientDoc = querySnapshot.docs[0];
      const patientUid = patientDoc.id;

      // 2. Check if a request already exists
      const existing = await getDocs(
        query(
          collection(db, "connectionRequests"),
          where("fromUid", "==", caregiverUid),
          where("toUid", "==", patientUid),
          where("status", "in", ["pending", "accepted"])
        )
      );

      if (!existing.empty) {
        setStatusMessage("⚠️ You've already sent a request to this patient.");
        return;
      }

      // 3. Send new request
      await addDoc(collection(db, "connectionRequests"), {
        fromUid: caregiverUid,
        toUid: patientUid,
        type: "caregiver_to_patient",
        status: "pending",
        timestamp: serverTimestamp(),
      });

      setStatusMessage("✅ Request sent!");
      setEmail("");
    } catch (err) {
      console.error("Error sending request:", err);
      setStatusMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="p-4 border rounded-xl shadow bg-white max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2 text-black">Add Patient by Email</h2>
        <input
          type="email"
          placeholder="Patient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />
        <button
          onClick={handleAddPatient}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Send Request
        </button>
        {statusMessage && (
          <p className="mt-3 text-sm text-gray-600">{statusMessage}</p>
        )}
      </div>
    </div>
  );
}