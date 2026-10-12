import React, { useState } from "react";
import axios from "axios";
import "./DeleteAssetRecord.css";

const DeleteAssetRecord = () => {
  // State for search and validation
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // State for form data and UI
  const [assetData, setAssetData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const API_BASE_URL = "http://localhost:8081/auth";

  // Helper to get JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Maps backend JSON response to frontend form state
  const mapToFrontend = (data) => ({
    s_no: data.sNo || data.sno || data.SNo || "",
    pc_user: data.pcUser || "",
    pc_assign_to: data.pcAssignTo || "",
    pc_making_model: data.pcMakingModel || "",
    pc_name: data.pcName || "",
    ip_address: data.ipAddress || "",
    mac_address: data.macAddress || "",
    pc_serial_no: data.pcSerialNo || "",
    printer_attached: data.printerAttached || "No",
    printer_model: data.printerNameAndMakerModel || "",
    colour_bw: data.colourBlackAndWhite || "N/A",
    os: data.os || "",
    os_version: data.osVersion || "",
    ms_office: data.msOffice || "",
    antivirus: data.antivirus || "Yes",
    building_no: data.buildingNo || "",
    purchase_year: data.purchaseYear || "",
    ram_capacity: data.ramCapacity || "",
    asset_no: data.assetNo || "",
    processor: data.processer || "", // Handle backend spelling 'processer'
    endpoint_system: data.endPointSystem || "LAN",
    remark: data.remark || ""
  });

  // --- Handlers ---

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== "") {
      setFetchError(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchRecord();
    }
  };

  const fetchRecord = async () => {
    const query = searchQuery.trim();
    
    if (!query) {
      setFetchError(true);
      return;
    }

    setFetchError(false);
    setIsFetching(true);

    try {
      // Fetch asset by Asset No
      const response = await axios.get(`${API_BASE_URL}/asset/${query}`, {
        headers: getAuthHeaders()
      });
      
      setAssetData(mapToFrontend(response.data));
    } catch (error) {
      console.error("Error fetching record:", error);
      setFetchError(true);
      setAssetData(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCancel = () => {
    setAssetData(null);
    setSearchQuery("");
    setFetchError(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete this record? This action cannot be undone."
    );

    if (confirmDelete) {
      setIsDeleting(true);

      try {
        // Delete endpoint expects the database Primary Key (s_no) which is a Long in Java
        await axios.delete(`${API_BASE_URL}/delete/${assetData.s_no}`, {
          headers: getAuthHeaders()
        });
        
        setAssetData(null); // Hide form
        setSearchQuery(""); // Reset search

        // Show Success Toast
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (error) {
        console.error("Error deleting record:", error);
        alert(
          "Failed to delete the asset. " + 
          (error.response?.data || "Please check the server connection.")
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="delete-asset-container">
      {/* Header */}
      <header>
        <a href="/" className="logo">
          <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="10" fill="#ffffff" />
          </svg>
          DRDO
        </a>
      </header>

      {/* Main Area */}
      <main className="hero">
        <h1>Delete Asset Record</h1>

        <div className="control-box">
          {/* Note: In a real React app using React Router, change this <a> tag to <Link to="/dashboard"> */}
          <a href="/AdminDashboard" className="back-link">
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Dashboard
          </a>

          {/* Fetch Section */}
          <div className="fetch-section">
            <div>
              <strong style={{ display: "block", fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>
                Find Asset to Delete
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                Enter Asset No
              </span>
            </div>

            <div className="fetch-input-wrapper">
              <input
                type="text"
                placeholder="e.g., AST-2023-001"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className={fetchError ? "input-error" : ""}
              />
              {fetchError && (
                <span className="warning-msg" style={{ display: "block" }}>
                  Please enter a valid Asset ID.
                </span>
              )}
            </div>

            <button 
              className="btn-action" 
              onClick={fetchRecord} 
              disabled={isFetching}
            >
              {isFetching ? "Fetching..." : "Fetch Record"}
            </button>
          </div>

          {/* Delete Form (Conditionally Rendered) */}
          {assetData && (
            <div className="fade-in-container">
              <div className="delete-warning-banner">
                <svg viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                Warning: You are about to permanently delete this asset record. Please verify the details below. This action cannot be undone.
              </div>

              <div className="form-header">
                <h2>Review Asset Details</h2>
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600", background: "#fef2f2", padding: "4px 10px", borderRadius: "20px" }}>
                  Targeted for Deletion
                </span>
              </div>

              <form onSubmit={handleDelete}>
                <div className="form-grid">
                  <div className="form-group"><label>S.No</label><input type="text" value={assetData.s_no} readOnly /></div>
                  <div className="form-group"><label>PC User</label><input type="text" value={assetData.pc_user} readOnly /></div>
                  <div className="form-group"><label>PC Assign To</label><input type="text" value={assetData.pc_assign_to} readOnly /></div>
                  <div className="form-group"><label>PC Making Model</label><input type="text" value={assetData.pc_making_model} readOnly /></div>
                  <div className="form-group"><label>PC Name</label><input type="text" value={assetData.pc_name} readOnly /></div>
                  <div className="form-group"><label>IP Address</label><input type="text" value={assetData.ip_address} readOnly /></div>
                  <div className="form-group"><label>MAC Address</label><input type="text" value={assetData.mac_address} readOnly /></div>
                  <div className="form-group"><label>PC Serial No</label><input type="text" value={assetData.pc_serial_no} readOnly /></div>

                  <div className="form-group">
                    <label>Printer Attached</label>
                    <select value={assetData.printer_attached} disabled>
                      <option value="Yes - Common">Yes - Common</option>
                      <option value="Yes - Individual">Yes - Individual</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="form-group"><label>Printer Model</label><input type="text" value={assetData.printer_model} readOnly /></div>

                  <div className="form-group">
                    <label>Colour/Black and White</label>
                    <select value={assetData.colour_bw} disabled>
                      <option value="Black & White">Black & White</option>
                      <option value="Colour">Colour</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>

                  <div className="form-group"><label>OS</label><input type="text" value={assetData.os} readOnly /></div>
                  <div className="form-group"><label>OS Version</label><input type="text" value={assetData.os_version} readOnly /></div>
                  <div className="form-group"><label>MS Office</label><input type="text" value={assetData.ms_office} readOnly /></div>

                  <div className="form-group">
                    <label>Antivirus</label>
                    <select value={assetData.antivirus} disabled>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="form-group"><label>Building No</label><input type="text" value={assetData.building_no} readOnly /></div>
                  <div className="form-group"><label>Purchase Year</label><input type="text" value={assetData.purchase_year} readOnly /></div>
                  <div className="form-group"><label>Ram Capacity</label><input type="text" value={assetData.ram_capacity} readOnly /></div>
                  <div className="form-group"><label>Asset No</label><input type="text" value={assetData.asset_no} readOnly /></div>
                  <div className="form-group"><label>Processor</label><input type="text" value={assetData.processor} readOnly /></div>

                  <div className="form-group">
                    <label>End Point System</label>
                    <select value={assetData.endpoint_system} disabled>
                      <option value="LAN">LAN</option>
                      <option value="Internet">Internet</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Remark</label>
                    <textarea rows="2" value={assetData.remark} readOnly />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-action btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-action btn-danger" disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Asset"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Success Toast */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <span>Asset Record Deleted Successfully!</span>
      </div>
    </div>
  );
};

export default DeleteAssetRecord;