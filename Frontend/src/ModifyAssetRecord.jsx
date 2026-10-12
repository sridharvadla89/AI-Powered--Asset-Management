import React, { useState } from "react";
import axios from "axios";
import "./ModifyAssetRecord.css"; 

export default function ModifyAssetRecord() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  
  const [assetData, setAssetData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const API_BASE_URL = "http://localhost:8081/auth";

  // Handle data coming FROM backend (Accounts for Jackson capitalization quirks)
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
    processor: data.processer || "", 
    endpoint_system: data.endPointSystem || "LAN",
    remark: data.remark || ""
  });

  // Handle data going TO backend
  const mapToBackend = (data) => {
    const parsedYear = parseInt(data.purchase_year, 10);
    const parsedSno = parseInt(data.s_no, 10);

    return {
      sNo: isNaN(parsedSno) ? null : parsedSno, 
      pcUser: data.pc_user || "",
      pcAssignTo: data.pc_assign_to || "",
      pcMakingModel: data.pc_making_model || "",
      pcName: data.pc_name || "",
      ipAddress: data.ip_address || "",
      macAddress: data.mac_address || "",
      pcSerialNo: data.pc_serial_no || "",
      printerAttached: data.printer_attached || "No",
      printerNameAndMakerModel: data.printer_model || "",
      colourBlackAndWhite: data.colour_bw || "",
      os: data.os || "",
      osVersion: data.os_version || "",
      msOffice: data.ms_office || "",
      antivirus: data.antivirus || "Yes",
      buildingNo: data.building_no || "",
      purchaseYear: isNaN(parsedYear) ? null : parsedYear,
      ramCapacity: data.ram_capacity || "",
      assetNo: data.asset_no || "",
      processer: data.processor || "", 
      endPointSystem: data.endpoint_system || "LAN",
      remark: data.remark || ""
    };
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); 
    return { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" 
    };
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== "") setFetchError("");
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
      setFetchError("Please enter an Asset ID.");
      return;
    }

    setFetchError("");
    setIsFetching(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/asset/${query}`, {
        headers: getAuthHeaders()
      });
      setAssetData(mapToFrontend(response.data));
    } catch (error) {
      console.error("Error fetching record:", error);
      if (error.response?.status === 404) {
        setFetchError("Asset not found in database.");
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setFetchError("Unauthorized. Please log in.");
      } else {
        setFetchError("Failed to fetch record. Check server connection.");
      }
      setAssetData(null);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    setAssetData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, [name]: value };

      if (name === "printer_attached") {
        if (value === "No") {
          newData.printer_model = "N/A";
          newData.colour_bw = "N/A";
        } else if (value !== "No" && prev.printer_attached === "No") {
          newData.printer_model = "";
          newData.colour_bw = "Black & White";
        }
      }
      return newData;
    });
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.");
    if (confirmCancel) {
      setAssetData(null);
      setSearchQuery("");
      setFetchError("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const backendPayload = mapToBackend(assetData);
      
      // FIXED: Sending asset_no (String) instead of s_no (Long) to match backend String id requirement
      await axios.put(`${API_BASE_URL}/update/${assetData.asset_no}`, backendPayload, {
        headers: getAuthHeaders()
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

    } catch (error) {
      console.error("Error updating record:", error);
      
      if (error.response && error.response.data) {
        let errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
        alert(`Backend Error: ${errorMsg}`);
      } else {
        alert("Failed to update asset. Is your Spring Boot server running?");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="modify-asset-container">
        <header>
          <a href="#" className="logo" onClick={(e) => e.preventDefault()}>
            <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="6" />
              <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(45 50 50)" />
              <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(-45 50 50)" />
              <circle cx="50" cy="50" r="10" fill="#ffffff" />
            </svg>
            DRDO
          </a>
        </header>

        <main className="hero">
          <h1>Modify Asset Record</h1>

          <div className="control-box">
            <a href="/AdminDashboard" className="back-link" onClick={(e) => { e.preventDefault(); handleCancel();window.location.href = "/AdminDashboard"; }}>
              <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Back to Dashboard
            </a>

            <div className="fetch-section">
              <div>
                <strong style={{ display: "block", fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>
                  Find Asset to Edit
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
                    {fetchError}
                  </span>
                )}
              </div>

              <button className="btn-action" onClick={fetchRecord} disabled={isFetching}>
                {isFetching ? "Fetching..." : "Fetch Record"}
              </button>
            </div>

            {assetData && (
              <div className="fade-in-container">
                <div className="form-header">
                  <h2>Edit Asset Details</h2>
                  <span style={{ fontSize: "13px", color: "#0891b2", fontWeight: "600", background: "#e0f2fe", padding: "4px 10px", borderRadius: "20px" }}>
                    Editing Record #{assetData.s_no || "--"}
                  </span>
                </div>

                <form onSubmit={handleUpdate}>
                  <div className="form-grid">
                    <div className="asset-form-group"><label>S.No</label><input type="text" name="s_no" value={assetData.s_no} readOnly /></div>
                    <div className="asset-form-group"><label>PC User</label><input type="text" name="pc_user" value={assetData.pc_user} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>PC Assign To</label><input type="text" name="pc_assign_to" value={assetData.pc_assign_to} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>PC Making Model</label><input type="text" name="pc_making_model" value={assetData.pc_making_model} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>PC Name</label><input type="text" name="pc_name" value={assetData.pc_name} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>IP Address</label><input type="text" name="ip_address" value={assetData.ip_address} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>MAC Address</label><input type="text" name="mac_address" value={assetData.mac_address} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>PC Serial No</label><input type="text" name="pc_serial_no" value={assetData.pc_serial_no} onChange={handleFormChange} required /></div>

                    <div className="asset-form-group">
                      <label>Printer Attached</label>
                      <select name="printer_attached" value={assetData.printer_attached} onChange={handleFormChange}>
                        <option value="Yes - Common">Yes - Common</option>
                        <option value="Yes - Individual">Yes - Individual</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="asset-form-group">
                      <label>Printer Model</label>
                      <input 
                        type="text" 
                        name="printer_model" 
                        value={assetData.printer_model} 
                        onChange={handleFormChange} 
                        readOnly={assetData.printer_attached === 'No'}
                      />
                    </div>

                    <div className="asset-form-group">
                      <label>Colour/Black and White</label>
                      <select 
                        name="colour_bw" 
                        value={assetData.colour_bw} 
                        onChange={handleFormChange}
                        disabled={assetData.printer_attached === 'No'}
                      >
                        <option value="Black & White">Black & White</option>
                        <option value="Colour">Colour</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>

                    <div className="asset-form-group"><label>OS</label><input type="text" name="os" value={assetData.os} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>OS Version</label><input type="text" name="os_version" value={assetData.os_version} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>MS Office</label><input type="text" name="ms_office" value={assetData.ms_office} onChange={handleFormChange} /></div>

                    <div className="asset-form-group">
                      <label>Antivirus</label>
                      <select name="antivirus" value={assetData.antivirus} onChange={handleFormChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="asset-form-group"><label>Building No</label><input type="text" name="building_no" value={assetData.building_no} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>Purchase Year</label><input type="number" name="purchase_year" value={assetData.purchase_year} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>Ram Capacity</label><input type="text" name="ram_capacity" value={assetData.ram_capacity} onChange={handleFormChange} /></div>
                    <div className="asset-form-group"><label>Asset No</label><input type="text" name="asset_no" value={assetData.asset_no} onChange={handleFormChange} required /></div>
                    <div className="asset-form-group"><label>Processor</label><input type="text" name="processor" value={assetData.processor} onChange={handleFormChange} /></div>

                    <div className="asset-form-group">
                      <label>End Point System</label>
                      <select name="endpoint_system" value={assetData.endpoint_system} onChange={handleFormChange}>
                        <option value="LAN">LAN</option>
                        <option value="Internet">Internet</option>
                      </select>
                    </div>

                    <div className="asset-form-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Remark</label>
                      <textarea name="remark" rows="2" value={assetData.remark} onChange={handleFormChange}></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-action btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-action btn-success" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Asset"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>

        <div className={`toast ${showToast ? "show" : ""}`}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>Database updated successfully!</span>
        </div>
      </div>
    </>
  );
}