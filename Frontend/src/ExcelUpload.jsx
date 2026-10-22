import React, { useState } from "react";
import axios from "axios";
import "./ExcelUpload.css"; // Ensure this matches your CSS file name

function ExcelUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Added a small state to handle red/green message styling
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setMessage("");
        setIsSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select an Excel file.");
            setIsSuccess(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You are not logged in. Please login first.");
            setIsSuccess(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            setMessage("");
            setIsSuccess(false);

            const response = await axios.post(
                "http://localhost:8081/auth/import",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setIsSuccess(true);
            setMessage(
                `Successfully Imported: ${response.data.successfulRows} | Skipped: ${response.data.skippedRows}`
            );

        } catch (error) {
            setIsSuccess(false);
            
            if (error.response?.status === 401) {
                setMessage("Session expired or JWT is invalid. Please login again.");
                return;
            }
            if (error.response?.status === 403) {
                setMessage("You don't have permission to import Excel.");
                return;
            }
            setMessage(error.response?.data?.message || "Excel upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                
                <div className="upload-header">
                    <h2>Import Assets</h2>
                    <p>Upload your Excel (.xlsx) file to update the inventory system.</p>
                </div>

                {/* Styled Custom File Input */}
                <label className="file-dropzone" htmlFor="excel-file">
                    <div className="dropzone-content">
                        <svg 
                            className="upload-icon" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                            />
                        </svg>
                        
                        {file ? (
                            <span className="file-name">{file.name}</span>
                        ) : (
                            <span className="file-placeholder">
                                Click to browse or drag & drop .xlsx
                            </span>
                        )}
                    </div>
                    
                    {/* The actual input is hidden by CSS */}
                    <input
                        id="excel-file"
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="hidden-file-input"
                    />
                </label>

                {/* Status Message Banner */}
                {message && (
                    <div className={`message-banner ${isSuccess ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

                {/* Upload Button with Loading Spinner */}
                <button
                    className={`upload-btn ${loading ? "loading" : ""}`}
                    onClick={handleUpload}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span> Processing...
                        </>
                    ) : (
                        "Upload Document"
                    )}
                </button>

            </div>
        </div>
    );
}

export default ExcelUpload;