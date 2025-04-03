import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './SettingsPage.css';

export default function SettingsPage() {
  const [dropdowns, setDropdowns] = useState({
    account: false,
    theme: false,
    notifications: false,
    privacy: false,
    subscription: false,
    help: false,
    terms: false,
    report: false,
    addAccount: false,
    deleteAccount: false,
  });

  const [caregiverData, setCaregiverData] = useState({
    name: "",
    email: "",
    medicalAffiliation: "",
    state: "",
    address: ""
  });

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

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaregiverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const caregiverRef = doc(db, "caregivers", user.uid);
        await updateDoc(caregiverRef, caregiverData);
        setDropdowns((prev) => ({ ...prev, account: false }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const submitReport = () => {
    alert('Report submitted!');
    setDropdowns((prev) => ({ ...prev, report: false }));
  };

  const addAccount = () => {
    alert('Account added!');
    setDropdowns((prev) => ({ ...prev, addAccount: false }));
  };

  const deleteAccount = () => {
    alert('Account deleted!');
    setDropdowns((prev) => ({ ...prev, deleteAccount: false }));
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Settings</h1>

        {/* Account Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-700 border-b-2 border-indigo-400 pb-2 mb-4">Account</h2>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            {/* Edit Profile */}
            <button className="w-full text-left" onClick={() => toggleDropdown('account')}>
              <span className="font-medium">Edit Profile</span>
            </button>
            {dropdowns.account && (
              <div className="pl-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={caregiverData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={caregiverData.email}
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Medical Affiliation</label>
                  <input
                    type="text"
                    name="medicalAffiliation"
                    value={caregiverData.medicalAffiliation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your medical affiliation"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    name="state"
                    value={caregiverData.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={caregiverData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your address"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setDropdowns(prev => ({ ...prev, account: false }))}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Themes */}
            <button className="w-full text-left" onClick={() => toggleDropdown('theme')}>
              <span className="font-medium">Themes</span>
            </button>
            {dropdowns.theme && (
              <div className="pl-4 space-x-2">
                <button className="bg-gray-200 px-4 py-2 rounded-md">Light Mode</button>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-md">Dark Mode</button>
              </div>
            )}

            {/* Notifications */}
            <button className="w-full text-left" onClick={() => toggleDropdown('notifications')}>
              <span className="font-medium">Notifications</span>
            </button>
            {dropdowns.notifications && (
              <div className="pl-4 space-y-1">
                <label><input type="checkbox" className="mr-2" /> Email Notifications</label>
                <label><input type="checkbox" className="mr-2" /> SMS Notifications</label>
              </div>
            )}

            {/* Privacy */}
            <button className="w-full text-left" onClick={() => toggleDropdown('privacy')}>
              <span className="font-medium">Privacy</span>
            </button>
            {dropdowns.privacy && (
              <div className="pl-4 space-y-1">
                <label><input type="checkbox" className="mr-2" /> Share data with third parties</label>
                <label><input type="checkbox" className="mr-2" /> Enable location access</label>
              </div>
            )}
          </div>
        </section>

        {/* Support & About */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 border-b-2 border-indigo-400 pb-2 mb-4">Support & About</h2>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <button className="w-full text-left" onClick={() => toggleDropdown('subscription')}>My Subscription</button>
            {dropdowns.subscription && (
              <div className="pl-4">
                <p className="mb-2">Subscription Level: Premium</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Manage Subscription</button>
              </div>
            )}

            <button className="w-full text-left" onClick={() => toggleDropdown('help')}>Help & Support</button>
            {dropdowns.help && (
              <div className="pl-4 space-y-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Contact Support</button>
                <button className="bg-blue-300 text-white px-4 py-2 rounded-md">FAQ</button>
              </div>
            )}

            <button className="w-full text-left" onClick={() => toggleDropdown('terms')}>Terms and Policies</button>
            {dropdowns.terms && (
              <div className="pl-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">View Terms</button>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 border-b-2 border-indigo-400 pb-2 mb-4">Actions</h2>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            {/* Report Problem */}
            <button className="w-full text-left" onClick={() => toggleDropdown('report')}>Report a problem</button>
            {dropdowns.report && (
              <div className="pl-4 space-y-2">
                <textarea className="w-full p-2 border rounded-md" placeholder="Describe the issue..." />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={submitReport}>Submit Report</button>
              </div>
            )}

            {/* Add Account */}
            <button className="w-full text-left" onClick={() => toggleDropdown('addAccount')}>Add Account</button>
            {dropdowns.addAccount && (
              <div className="pl-4 space-y-2">
                <input type="email" className="w-full p-2 border rounded-md" placeholder="Enter email to add" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={addAccount}>Add Account</button>
              </div>
            )}

            {/* Delete Account */}
            <button className="w-full text-left" onClick={() => toggleDropdown('deleteAccount')}>Delete/Disable Account</button>
            {dropdowns.deleteAccount && (
              <div className="pl-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={deleteAccount}>Delete Account</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}