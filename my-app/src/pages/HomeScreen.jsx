import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Care Companion</h1>
        <p className="text-gray-600 mb-10 max-w-xl">
          Supporting caregivers with the tools, knowledge, and community they need.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/resources')}
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            View Resources
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="bg-gray-700 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-800 transition"
          >
            Settings
          </button>
        </div>
      </div>
    </>
  );
}