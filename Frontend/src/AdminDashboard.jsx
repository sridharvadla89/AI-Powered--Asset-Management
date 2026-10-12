import React, { useState, useEffect, useRef } from "react";
import "./AdminDashboard.css"; // Make sure the CSS file is in the same folder

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-dashboard-container">
      {/* Header Area */}
      <header className="admin-header">
        <a href="/" className="logo">
          <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="10" fill="#ffffff" />
          </svg>
          DRDO
        </a>

        <div className="profile-menu-container" ref={dropdownRef}>
          <button className="profile-btn" onClick={toggleDropdown}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          <div className={`profile-dropdown ${isDropdownOpen ? "show" : ""}`}>
            {/* Only Logout Option Kept */}
            <a href="/" className="dropdown-item logout">
              <svg viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="hero">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Secure portal to manage DRDO asset inventory and system access logs.</p>

        <div className="dashboard-container">
          {/* 1. Add Data Card */}
          <a href="/add-record" className="card add">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
            <h3>Add Asset</h3>
            <p>Register new PCs, printers, and hardware into the database.</p>
          </a>

          {/* 2. Modify Data Card */}
          <a href="/ModifyAssetRecord" className="card modify">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
            <h3>Modify Asset</h3>
            <p>Update configurations, assignees, or details of existing inventory.</p>
          </a>

          {/* 3. Delete Data Card */}
          <a href="/DeleteAssetRecord" className="card delete">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </div>
            <h3>Delete Asset</h3>
            <p>Permanently remove retired or decommissioned hardware records.</p>
          </a>

          {/* 4. User Login Data Card */}
          {/* <a href="/user-logs" className="card users">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h3>User Login Data</h3>
            <p>Monitor portal access, timestamps, and active admin sessions.</p>
          </a> */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;