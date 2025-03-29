import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('✅ Signed out');
        navigate('/login');
      })
      .catch((error) => console.error('❌ Logout error', error));
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Care Companion</h1>
      <div className="space-x-4">
        <button onClick={() => navigate('/resources')} className="text-blue-600 hover:underline">Resources</button>
        <button onClick={() => navigate('/settings')} className="text-blue-600 hover:underline">Settings</button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}