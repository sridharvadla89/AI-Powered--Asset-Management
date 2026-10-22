
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Form.css";

const API_BASE_URL = "http://localhost:8081/auth";

const columns = [
  "S.No", "PC User", "PC Assign To", "PC Making Model",
  "PC Name", "IP Address", "MAC Address", "PC Serial No",
  "Printer Attached", "Printer Model", "Colour/Black and White",
  "OS", "OS Version", "MS Office", "Antivirus", "Building No",
  "Purchase Year", "Ram Capacity", "Asset No", "Processer",
  "End Point System", "Remark"
];

// Map frontend column labels to backend entity fields.
// Adjust these values to match your actual Spring Boot entity.
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
  "Printer Model": "printerModel",
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

// Normalize backend records for the table.
// Update aliases if your entity uses different JSON property names.
const mapToFrontend = (item) => ({
  "S.No": item.sNo ?? item.serialNo ?? item.id ?? "",
  "PC User": item.pcUser ?? "",
  "PC Assign To": item.pcAssignTo ?? "",
  "PC Making Model": item.pcMakingModel ?? "",
  "PC Name": item.pcName ?? "",
  "IP Address": item.ipAddress ?? "",
  "MAC Address": item.macAddress ?? "",
  "PC Serial No": item.pcSerialNo ?? "",
  "Printer Attached": item.printerAttached ?? "",
  "Printer Model": item.printerModel ?? "",
  "Colour/Black and White": item.colourBlackAndWhite ?? "",
  "OS": item.os ?? "",
  "OS Version": item.osVersion ?? "",
  "MS Office": item.msOffice ?? "",
  "Antivirus": item.antivirus ?? "",
  "Building No": item.buildingNo ?? "",
  "Purchase Year": item.purchaseYear ?? "",
  "Ram Capacity": item.ramCapacity ?? "",
  "Asset No": item.assetNo ?? "",
  "Processer": item.processer ?? "",
  "End Point System": item.endPointSystem ?? "",
  "Remark": item.remark ?? ""
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

function Form() {
  const [records, setRecords] = useState([]);
  const [index, setIndex] = useState(0);

  const [activeTab, setActiveTab] = useState("Asset No");
  const [searchQuery, setSearchQuery] = useState("");

  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchStatus, setSearchStatus] = useState("loading");

  const visibleCount = 5;

  const searchField = activeTab
    ? FIELD_MAP[activeTab]
    : "assetNo";

  // Retrieve records from the backend.
  const handleSearch = useCallback(async () => {
    setSearchStatus("loading");

    try {
      const params = {};

      if (searchQuery.trim()) {
        params.field = searchField;
        params.value = searchQuery.trim();
      }

      const response = await axios.get(
        `${API_BASE_URL}/search`,
        {
          params,
          headers: getAuthHeaders()
        }
      );

      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data == null
          ? []
          : [response.data];

      const formattedRecords = dataArray.map(mapToFrontend);

      setRecords(formattedRecords);
      setCurrentPage(1);

      setSearchStatus(
        formattedRecords.length ? "success" : "empty"
      );
    } catch (error) {
      console.error("Search error:", error);
      setRecords([]);
      setSearchStatus("error");
    }
  }, [searchField, searchQuery]);

  // Load all records when the component first mounts.
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleLeft = () => {
    setIndex(prev => Math.max(prev - 1, 0));
  };

  const handleRight = () => {
    setIndex(prev =>
      Math.min(prev + 1, columns.length - visibleCount)
    );
  };

  const handleColumnChange = (value) => {
    setActiveTab(value);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Download Excel or PDF from the backend.
 
const handleExport = async (format) => {
    try {
      const params = {
        format,
        page: currentPage - 1, // Backend pages start at 0
        size: pageSize,
        sortBy: "sNo",
        direction: "asc"
      };
  
      // Apply the selected column and search value
      if (searchQuery.trim()) {
        params.field = searchField;
        params.value = searchQuery.trim();
      }
  
      const response = await axios.get(
        `${API_BASE_URL}/export`,
        {
          params,
          headers: getAuthHeaders(),
          responseType: "blob"
        }
      );
  
      // Create the downloadable file
      const blob = new Blob([response.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf"
      });
  
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      link.href = blobUrl;
      link.download = `DRDO_Data.${format === "excel" ? "xlsx" : "pdf"}`;
  
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(`Export ${format} error:`, error);
      alert(
        `Failed to export ${format.toUpperCase()}. Please check your session and backend connection.`
      );
    }
  };
  

  // Client-side pagination of the records returned by /search.
  const totalPages = Math.ceil(records.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const pageData = records.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="asset-container">

      <div className="toolbar">
        <div className="search-bar">
          <select
            value={activeTab}
            onChange={e => handleColumnChange(e.target.value)}
          >
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            placeholder={`Search by ${activeTab}`}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searchStatus === "loading"}
          >
            Search
          </button>
        </div>

        <div className="export-buttons">
          <button
            type="button"
            onClick={() => handleExport("excel")}
          >
            Download Excel
          </button>

          <button
            type="button"
            onClick={() => handleExport("pdf")}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="input-tab">
        <button
          type="button"
          onClick={handleLeft}
          disabled={index === 0}
        >
          ←
        </button>

        <div className="columns">
          {columns.slice(index, index + visibleCount).map(col => (
            <div className="tab-item" key={col}>
              {col}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRight}
          disabled={index >= columns.length - visibleCount}
        >
          →
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {searchStatus === "loading" ? (
              <tr>
                <td colSpan={columns.length}>
                  Loading records...
                </td>
              </tr>
            ) : searchStatus === "error" ? (
              <tr>
                <td colSpan={columns.length}>
                  Failed to retrieve records. Check your backend
                  connection and authentication.
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  No records found.
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIndex) => (
                <tr key={`${row["Asset No"]}-${rowIndex}`}>
                  {columns.map(col => (
                    <td key={col}>{row[col] ?? ""}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="page-size">
          <label htmlFor="pageSize">Rows per page:</label>

          <select
            id="pageSize"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[8, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <span>
          {records.length === 0
            ? "0 records"
            : `${startIndex + 1}–${Math.min(
                startIndex + pageSize,
                records.length
              )} of ${records.length}`}
        </span>

        <div className="page-buttons">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              setCurrentPage(prev => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            disabled={
              currentPage >= totalPages || totalPages === 0
            }
            onClick={() =>
              setCurrentPage(prev => prev + 1)
            }
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default Form;
