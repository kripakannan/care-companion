import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "connectionRequests"),
        where("toUid", "==", uid),
        where("status", "==", "pending")
      );

      const snap = await getDocs(q);
      const enriched = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const caregiverRef = doc(db, "users", data.fromUid);
          const caregiverSnap = await getDoc(caregiverRef);
          return {
            id: docSnap.id,
            ...data,
            caregiverName: caregiverSnap.exists() ? caregiverSnap.data().name : "Unknown",
          };
        })
      );

      setRequests(enriched);
    };

    fetchRequests();
  }, []);

  const handleDecision = async (requestId, fromUid, decision) => {
    const patientUid = auth.currentUser?.uid;
    if (!patientUid) return;
  
    const requestRef = doc(db, "connectionRequests", requestId);
  
    if (decision === "accept") {
      await updateDoc(requestRef, { status: "accepted" });
  
      // 🔁 FETCH caregiver
      const caregiverRef = doc(db, "caregivers", fromUid);
      const caregiverSnap = await getDoc(caregiverRef);
      const caregiverData = caregiverSnap.exists() ? caregiverSnap.data() : {};
      const currentPatients = caregiverData.linkedPatientIds || [];
  
      await updateDoc(caregiverRef, {
        linkedPatientIds: [...new Set([...currentPatients, patientUid])],
      });
  
      // 🔁 FETCH patient
      const patientRef = doc(db, "patients", patientUid);
      const patientSnap = await getDoc(patientRef);
      const patientData = patientSnap.exists() ? patientSnap.data() : {};
      const currentCaregivers = patientData.linkedCaregiverIds || [];
  
      await updateDoc(patientRef, {
        linkedCaregiverIds: [...new Set([...currentCaregivers, fromUid])],
      });
  
      console.log("✅ Linked caregiver and patient!");
    } else {
      await updateDoc(requestRef, { status: "rejected" });
    }
  
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };  

  return (
    <div className="mt-10 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Pending Caregiver Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-4 bg-white border rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-black">Caregiver: {req.caregiverName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(req.id, req.fromUid, "accept")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecision(req.id, req.fromUid, "reject")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}