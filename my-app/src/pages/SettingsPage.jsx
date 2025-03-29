import React, { useState } from 'react';
import Navbar from '../components/Navbar';

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

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveProfile = () => {
    alert('Profile saved!');
    setDropdowns((prev) => ({ ...prev, account: false }));
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
              <div className="pl-4 space-y-2">
                <input type="text" className="w-full p-2 border rounded-md" placeholder="New username" />
                <input type="email" className="w-full p-2 border rounded-md" placeholder="New email" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={saveProfile}>
                  Save Changes
                </button>
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