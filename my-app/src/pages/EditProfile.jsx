import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    heartRate: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const loadData = async () => {
      const docRef = doc(db, "patients", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          name: data.name || "",
          id: data.id || "",
          heartRate: data.heartRate || "",
          bloodType: data.emergency?.bloodType || "",
          allergies: data.emergency?.allergies?.join(", ") || "",
          emergencyContact: data.emergency?.contact || "",
        });
      }
      setLoading(false);
    };
    loadData();
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "patients", uid), {
      name: formData.name,
      id: formData.id,
      heartRate: parseInt(formData.heartRate),
      primary: true,
      emergency: {
        bloodType: formData.bloodType,
        allergies: formData.allergies.split(",").map((a) => a.trim()),
        contact: formData.emergencyContact,
      },
    }, { merge: true });

    navigate("/profile");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:<br /><input name="name" value={formData.name} onChange={handleChange} /></label><br />
        <label>Patient ID:<br /><input name="id" value={formData.id} onChange={handleChange} /></label><br />
        <label>Heart Rate:<br /><input name="heartRate" type="number" value={formData.heartRate} onChange={handleChange} /></label><br />
        <label>Blood Type:<br /><input name="bloodType" value={formData.bloodType} onChange={handleChange} /></label><br />
        <label>Allergies (comma-separated):<br /><input name="allergies" value={formData.allergies} onChange={handleChange} /></label><br />
        <label>Emergency Contact:<br /><input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} /></label><br />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;