import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Home", path: "/home", icon: "🏠" },
    { label: "Resources", path: "/resources", icon: "📚" },
    { label: "Settings", path: "/settings", icon: "⚙️" },
  ];

  // Add role-specific menu items
  if (userRole === "caregiver") {
    menuItems.push(
      { label: "Your Patients", path: "/profile", icon: "👥" },
      { label: "Profile", path: "/caregiver-profile", icon: "👤" },
      { label: "Calendar", path: "/caregiver-calendar", icon: "📅" }
    );
  } else if (userRole === "patient") {
    menuItems.push({ label: "Profile", path: "/profile", icon: "👤" });
  }

  return (
    <div className="navbar">
      <button className="hamburger-menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`side-nav ${isOpen ? 'open' : ''}`}>
        <div className="side-nav-header">
          <h2>Menu</h2>
          <button className="close-menu" onClick={closeMenu}>×</button>
        </div>
        
        <nav className="side-nav-content">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={closeMenu}>
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="logout-item">
              <button onClick={handleLogout} className="logout-button">
                <span className="icon">🚪</span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div className="nav-overlay" onClick={closeMenu}></div>
      )}
    </div>
  );
}