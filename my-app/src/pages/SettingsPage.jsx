import React from "react";
import { FaUser, FaPalette, FaBell, FaLock, FaCreditCard, FaQuestionCircle, FaInfoCircle, FaFlag, FaUserPlus, FaTrash, FaSignOutAlt, FaBars } from "react-icons/fa";

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Top Navbar */}
      <div className="w-full flex items-center justify-between py-4 px-6 bg-white shadow-md rounded-lg">
        <FaBars className="text-gray-600 text-xl" />
        <h1 className="text-2xl font-semibold text-gray-700">Settings</h1>
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-md mt-6">
        {/* Account Section */}
        <h2 className="text-lg font-semibold text-gray-600">Account</h2>
        <div className="bg-white p-4 rounded-lg shadow-md mt-2">
          <MenuItem icon={<FaUser />} label="Edit profile" />
          <MenuItem icon={<FaPalette />} label="Themes" />
          <MenuItem icon={<FaBell />} label="Notifications" />
          <MenuItem icon={<FaLock />} label="Privacy" />
        </div>

        {/* Support & About Section */}
        <h2 className="text-lg font-semibold text-gray-600 mt-6">Support & About</h2>
        <div className="bg-white p-4 rounded-lg shadow-md mt-2">
          <MenuItem icon={<FaCreditCard />} label="My Subscription" />
          <MenuItem icon={<FaQuestionCircle />} label="Help & Support" />
          <MenuItem icon={<FaInfoCircle />} label="Terms and Policies" />
        </div>

        {/* Actions Section */}
        <h2 className="text-lg font-semibold text-gray-600 mt-6">Actions</h2>
        <div className="bg-white p-4 rounded-lg shadow-md mt-2">
          <MenuItem icon={<FaFlag />} label="Report a problem" />
          <MenuItem icon={<FaUserPlus />} label="Add account" />
          <MenuItem icon={<FaTrash />} label="Delete/Disable account" />
        </div>

        {/* Log Out Button */}
        <button className="w-full mt-6 bg-red-500 text-white flex items-center justify-center py-3 rounded-full shadow-md hover:bg-red-600 transition">
          <FaSignOutAlt className="mr-2" /> Log Out
        </button>
      </div>
    </div>
  );
};

// Menu Item Component
const MenuItem = ({ icon, label }) => {
  return (
    <div className="flex items-center py-3 border-b last:border-b-0 text-gray-700">
      <span className="text-xl text-gray-600">{icon}</span>
      <span className="ml-4">{label}</span>
    </div>
  );
};

export default SettingsPage;