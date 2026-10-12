import React, { useState, useEffect, useRef } from 'react';
import './UserRequests.css'; // Make sure this path is correct

const UserRequests = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Initialize data (Starts empty as requested, but structured to hold the data)
  // Feel free to add mock objects to test, e.g. { id: 'U001', name: 'John Doe', mobile: '1234567890', email: 'john@drdo.gov', status: 'pending' }
  const [reqData, setReqData] = useState([]); 

  const dropdownRef = useRef(null);

  // --- Close Dropdown on Outside Click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // --- Toast Auto-Hide Logic ---
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Filtering Logic ---
  const filteredData = reqData.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.name.toLowerCase().includes(query) ||
      log.id.toLowerCase().includes(query) ||
      log.email.toLowerCase().includes(query)
    );
  });

  // --- Handle Accept / Reject Actions ---
  const updateStatus = (userId, newStatus, userName) => {
    const user = reqData.find((u) => u.id === userId);
    
    // Confirmation prompts
    if (user && user.status === 'accepted' && newStatus === 'rejected') {
      const confirmRevoke = window.confirm(`Are you sure you want to REVOKE access for ${userName}?`);
      if (!confirmRevoke) return;
    } else if (newStatus === 'rejected') {
      const confirmReject = window.confirm(`Are you sure you want to reject the access request for ${userName}?`);
      if (!confirmReject) return;
    }

    // Update state
    setReqData((prevData) =>
      prevData.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    // Show Notification Toast
    if (newStatus === 'accepted') {
      setToast({ show: true, message: `${userName}'s access request has been accepted.`, type: 'success' });
    } else {
      setToast({ show: true, message: `${userName}'s access request has been rejected.`, type: 'error' });
    }
  };

  return (
    <div className="user-requests-container">
      {/* Header Area */}
      <header>
        {/* Replace <a> with <Link to="..."> if using React Router */}
        <a href="/admin-dashboard" className="logo">
          <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="10" fill="#ffffff" />
          </svg>
          DRDO
        </a>

        <div className="profile-menu-container" ref={dropdownRef}>
          <button 
            className="profile-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          
          <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <a href="#logout" className="dropdown-item logout">
              <svg viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="hero">
        <h1>User Registration Requests</h1>

        <div className="control-box">
          <a href="/admin-dashboard" className="back-link">
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Dashboard
          </a>

          {/* Toolbar (Search) */}
          <div className="toolbar">
            <div className="search-container">
              <svg viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                placeholder="Search by Name, User ID, or Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="table-wrapper">
            <table className="req-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Email ID</th>
                  <th>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-msg">
                      No registration requests found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((req) => (
                    <tr key={req.id}>
                      <td style={{ fontFamily: 'monospace', color: '#0284c7', fontWeight: '600' }}>
                        {req.id}
                      </td>
                      <td style={{ fontWeight: '600' }}>{req.name}</td>
                      <td>{req.mobile}</td>
                      <td>{req.email}</td>
                      <td>
                        {/* Dynamic Action Buttons based on status */}
                        {req.status === 'pending' && (
                          <div className="action-cell">
                            <button 
                              className="btn-sm btn-accept" 
                              onClick={() => updateStatus(req.id, 'accepted', req.name)}
                            >
                              Accept
                            </button>
                            <button 
                              className="btn-sm btn-reject" 
                              onClick={() => updateStatus(req.id, 'rejected', req.name)}
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {req.status === 'accepted' && (
                          <div className="action-cell">
                            <span className="status-badge status-accepted">
                              <div className="status-dot"></div>Accepted
                            </span>
                            <button 
                              className="btn-sm btn-reject" 
                              onClick={() => updateStatus(req.id, 'rejected', req.name)}
                            >
                              Revoke & Reject
                            </button>
                          </div>
                        )}

                        {req.status === 'rejected' && (
                          <div className="action-cell">
                            <span className="status-badge status-rejected">
                              <div className="status-dot"></div>Rejected
                            </span>
                            <button 
                              className="btn-sm btn-accept" 
                              onClick={() => updateStatus(req.id, 'accepted', req.name)}
                            >
                              Approve Access
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <div 
        className={`toast ${toast.show ? 'show' : ''}`} 
        style={{ background: toast.type === 'error' ? '#dc2626' : '#107c41' }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default UserRequests;