import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DrdoDashboard.css"; 

const COLUMNS = [
  "S.No", "PC User", "PC Assign To", "PC Making Model", "PC Name",
  "IP Address", "MAC Address", "PC Serial No", "Printer Attached",
  "Printer Model", "Colour/Black and White", "OS", "OS Version",
  "MS Office", "Antivirus", "Building No", "Purchase Year",
  "Ram Capacity", "Asset No", "Processer", "End Point System", "Remark"
];

const COLUMN_KEYS = [
  "s_no", "pc_user", "pc_assign_to", "pc_making_model", "pc_name",
  "ip_address", "mac_address", "pc_serial_no", "printer_attached",
  "printer_model", "colour_bw", "os", "os_version",
  "ms_office", "antivirus", "building_no", "purchase_year",
  "ram_capacity", "asset_no", "processor", "endpoint_system", "remark"
];

// Map UI column headers to the exact variable names in DrdoAssetRequestDto/Entity
const FIELD_MAP = {
  "S.No": "sNo",
  "PC User": "pcUser",
  "PC Assign To": "pcAssignTo",
  "PC Making Model": "pcMakingModel",
  "PC Name": "pcName",
  "IP Address": "ipAddress",
  "MAC Address": "macAddress",
  "PC Serial No": "pcSerialNo",
  "Printer Attached": "printerAttached",
  "Printer Model": "printerNameAndMakerModel",
  "Colour/Black and White": "colourBlackAndWhite",
  "OS": "os",
  "OS Version": "osVersion",
  "MS Office": "msOffice",
  "Antivirus": "antivirus",
  "Building No": "buildingNo",
  "Purchase Year": "purchaseYear",
  "Ram Capacity": "ramCapacity",
  "Asset No": "assetNo",
  "Processer": "processer",
  "End Point System": "endPointSystem",
  "Remark": "remark"
};

const DrdoDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("idle"); 
  const [records, setRecords] = useState([]);

  const profileDropdownRef = useRef(null);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const API_BASE_URL = "http://localhost:8081/auth";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // --- Slider Drag Logic ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grabbing";
      startX.current = e.pageX - sliderRef.current.offsetLeft;
      scrollLeftPos.current = sliderRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2.5; 
    sliderRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleTabClick = (col, e) => {
    setActiveTab(col === activeTab ? null : col); 
    const tabElement = e.target;
    const slider = sliderRef.current;

    if (slider && tabElement) {
      const viewLeft = slider.scrollLeft;
      const viewRight = slider.scrollLeft + slider.clientWidth;
      const tabLeft = tabElement.offsetLeft;
      const tabRight = tabElement.offsetLeft + tabElement.offsetWidth;

      if (tabRight > viewRight) {
        slider.scrollTo({ left: tabRight - slider.clientWidth, behavior: "smooth" });
      } else if (tabLeft < viewLeft) {
        slider.scrollTo({ left: tabLeft, behavior: "smooth" });
      }
    }
  };

  // --- UPDATED Backend Search Logic ---
  const handleSearch = async () => {
    setSearchStatus("loading");

    // Default to Asset No if no tab is actively selected
    const searchField = activeTab ? FIELD_MAP[activeTab] : "assetNo";
    const searchValue = searchQuery.trim();

    try {
      // Build the URL for the new dynamic search endpoint
      let url = `${API_BASE_URL}/search`;
      
      // If user typed something, append the parameters. (If blank, it fetches all)
      if (searchValue) {
        url += `?field=${searchField}&value=${searchValue}`;
      }

      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });
      
      // Spring Boot returns an Array of objects from the /search endpoint
      const dataArray = Array.isArray(response.data) ? response.data : [response.data];
      
      if (dataArray.length === 0) {
        setRecords([]);
        setSearchStatus("empty");
      } else {
        const formattedRecords = dataArray.map(item => mapToFrontend(item));
        setRecords(formattedRecords); 
        setSearchStatus("success");
      }

    } catch (error) {
      console.error("Search error:", error);
      setSearchStatus("error");
    }
  };

  // --- Backend Export Logic ---
  const handleExport = async (format) => {
    try {
      let url = `${API_BASE_URL}/export?format=${format}`;
      
      if (activeTab && searchQuery.trim()) {
        const backendField = FIELD_MAP[activeTab];
        if (backendField) {
          url += `&field=${backendField}&value=${searchQuery.trim()}`;
        }
      }

      const response = await axios.get(url, {
        headers: getAuthHeaders(),
        responseType: "blob" 
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `DRDO_Data.${format === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Export ${format} error:`, error);
      alert(`Failed to generate ${format.toUpperCase()} export. Please check session/connection.`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="dashboard-page-wrapper">
      <header className="drdo-header">
        <div className="logo">
          <svg viewBox="0 0 100 100" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="6" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#ffffff" strokeWidth="4" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="10" fill="#ffffff" />
          </svg>
          DRDO
        </div>

        <div className="profile-menu-container" ref={profileDropdownRef}>
          <button 
            className="profile-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          <div className={`profile-dropdown ${isDropdownOpen ? "show" : ""}`}>
            {/* <a href="#profile" className="dropdown-item">
              <svg viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Profile
            </a> */}
            <a href="/" className="dropdown-item logout">
              <svg viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="hero">
        <h1>DRDO<br />Asset Management</h1>

        <div className="control-box">
          <div className="slider-container">
            <button className="scroll-arrow" onClick={scrollLeft}>
              <svg viewBox="0 0 24 24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
              </svg>
            </button>

            <div
              className="slider-wrapper"
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {COLUMNS.map((col, index) => (
                <div
                  key={index}
                  className={`tab-item ${activeTab === col ? "active" : ""}`}
                  onClick={(e) => handleTabClick(col, e)}
                >
                  {col}
                </div>
              ))}
            </div>

            <button className="scroll-arrow" onClick={scrollRight}>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          </div>

          <hr className="divider" />

          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={activeTab ? `Searching by ${activeTab}...` : "Select a tab above to search specific data, or leave blank to fetch all."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn-search-action"
              onClick={handleSearch}
              disabled={searchStatus === "loading"}
            >
              {searchStatus === "loading" ? "Searching..." : "Search"}
            </button>
          </div>

          {searchStatus !== "idle" && (
            <div className="results-container show">
              <div className="results-header-bar">
                <div>
                  <span style={{ fontWeight: 600 }}>Database Query Results</span>
                  <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "10px" }}>
                    {searchStatus === "loading" ? "Searching..." : `${records.length} record(s) found`}
                  </span>
                </div>
                
                <div className="export-buttons">
                  <button className="btn-export excel" onClick={() => handleExport("excel")}>
                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
                    Export Excel
                  </button>
                  <button className="btn-export pdf" onClick={() => handleExport("pdf")}>
                    <svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1.5h1.5V11H19v1.5h1.5V14H17.5V7h3v1.5zM9 9.5h1v-1H9v1z" /></svg>
                    Export PDF
                  </button>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="excel-table">
                  <thead>
                    <tr>
                      {COLUMNS.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searchStatus === "loading" && (
                      <tr>
                        <td colSpan={COLUMNS.length} className="status-msg">Querying database...</td>
                      </tr>
                    )}
                    
                    {searchStatus === "empty" && (
                      <tr>
                        <td colSpan={COLUMNS.length} className="status-msg">No matching records found in database.</td>
                      </tr>
                    )}
                    
                    {searchStatus === "error" && (
                      <tr>
                        <td colSpan={COLUMNS.length} className="status-msg" style={{ color: "#ef4444" }}>
                          Error retrieving records from the database. 
                        </td>
                      </tr>
                    )}

                    {searchStatus === "success" && records.map((record, rowIndex) => (
                      <tr key={rowIndex}>
                        {COLUMN_KEYS.map((key, colIndex) => (
                          <td key={colIndex}>{record[key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DrdoDashboard;