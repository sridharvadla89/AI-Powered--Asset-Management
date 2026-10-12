import React, { useState } from "react";
import axios from "axios";
import "./AddAssetRecord.css";

const API_URL = "http://localhost:8081/auth/add";

const AddAssetRecord = () => {

    const [formData, setFormData] = useState({
        pcUser: "",
        pcAssignTo: "",
        pcMakingModel: "",
        pcName: "",
        ipAddress: "",
        macAddress: "",
        pcSerialNo: "",
        printerAttached: "",
        printerNameAndMakerModel: "",
        colourBlackAndWhite: "",
        os: "",
        osVersion: "",
        msOffice: "",
        antivirus: "",
        buildingNo: "",
        purchaseYear: "",
        ramCapacity: "",
        assetNo: "",
        processer: "",
        endPointSystem: "",
        remark: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special logic for 'printerAttached' to auto-assign "N/A"
        if (name === "printerAttached") {
            if (value === "No") {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    printerNameAndMakerModel: "N/A",
                    colourBlackAndWhite: "N/A"
                }));
                // Clear errors for printer fields since they are now filled with "N/A"
                setErrors((prev) => ({
                    ...prev,
                    [name]: false,
                    printerNameAndMakerModel: false,
                    colourBlackAndWhite: false
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    // Clear "N/A" if user switches back to "Yes"
                    printerNameAndMakerModel: prev.printerNameAndMakerModel === "N/A" ? "" : prev.printerNameAndMakerModel,
                    colourBlackAndWhite: prev.colourBlackAndWhite === "N/A" ? "" : prev.colourBlackAndWhite
                }));
                setErrors((prev) => ({
                    ...prev,
                    [name]: false
                }));
            }
        } else {
            // General Input update
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
            // Remove error for current field
            setErrors((prev) => ({
                ...prev,
                [name]: false
            }));
        }

        setMessage("");
        setErrorMessage("");
    };

    // ==========================================
    // VALIDATE FORM
    // ==========================================

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((field) => {
            // Skip the optional remark field for validation if required
            if (field === "remark") return;

            if (
                formData[field] === null ||
                formData[field] === undefined ||
                String(formData[field]).trim() === ""
            ) {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setErrorMessage("");

        // Validate
        if (!validateForm()) {
            setErrorMessage("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const requestData = {
                pcUser: formData.pcUser,
                pcAssignTo: formData.pcAssignTo,
                pcMakingModel: formData.pcMakingModel,
                pcName: formData.pcName,
                ipAddress: formData.ipAddress,
                macAddress: formData.macAddress,
                pcSerialNo: formData.pcSerialNo,
                printerAttached: formData.printerAttached,
                printerNameAndMakerModel: formData.printerNameAndMakerModel,
                colourBlackAndWhite: formData.colourBlackAndWhite,
                os: formData.os,
                osVersion: formData.osVersion,
                msOffice: formData.msOffice,
                antivirus: formData.antivirus,
                buildingNo: formData.buildingNo,
                purchaseYear: Number(formData.purchaseYear),
                ramCapacity: formData.ramCapacity,
                assetNo: formData.assetNo,
                processer: formData.processer,
                endPointSystem: formData.endPointSystem,
                remark: formData.remark
            };

            const response = await axios.post(API_URL, requestData, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            });

            setMessage(response.data || "Asset added successfully!");

            // Clear form
            setFormData({
                pcUser: "",
                pcAssignTo: "",
                pcMakingModel: "",
                pcName: "",
                ipAddress: "",
                macAddress: "",
                pcSerialNo: "",
                printerAttached: "",
                printerNameAndMakerModel: "",
                colourBlackAndWhite: "",
                os: "",
                osVersion: "",
                msOffice: "",
                antivirus: "",
                buildingNo: "",
                purchaseYear: "",
                ramCapacity: "",
                assetNo: "",
                processer: "",
                endPointSystem: "",
                remark: ""
            });

            setErrors({});
        } catch (error) {
            console.error("Error adding asset:", error);
            if (error.response) {
                setErrorMessage(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Failed to add asset."
                );
            } else if (error.request) {
                setErrorMessage("Spring Boot server is not running or cannot be reached.");
            } else {
                setErrorMessage("Something went wrong while adding the asset.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const handleCancel = () => {
        setFormData({
            pcUser: "",
            pcAssignTo: "",
            pcMakingModel: "",
            pcName: "",
            ipAddress: "",
            macAddress: "",
            pcSerialNo: "",
            printerAttached: "",
            printerNameAndMakerModel: "",
            colourBlackAndWhite: "",
            os: "",
            osVersion: "",
            msOffice: "",
            antivirus: "",
            buildingNo: "",
            purchaseYear: "",
            ramCapacity: "",
            assetNo: "",
            processer: "",
            endPointSystem: "",
            remark: ""
        });
        setErrors({});
        setMessage("");
        setErrorMessage("");
    };

    return (
        <div className="asset-page">

            <header className="top-header">
                <a href="/" className="drdo-logo">
                    <div className="logo-circle">D</div>
                    <span>DRDO</span>
                </a>
            </header>

            <main className="page-content">
                <h1>Add New Asset Record</h1>

                <section className="form-card">
                    <a href="/AdminDashboard" className="back-button">
                        ← Back to Dashboard
                    </a>

                    {message && <div className="success-message">{message}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="asset-form">

                            {/* PC USER */}
                            <div className="field">
                                <label htmlFor="pcUser">PC User <span>*</span></label>
                                <input
                                    id="pcUser"
                                    name="pcUser"
                                    type="text"
                                    value={formData.pcUser}
                                    onChange={handleChange}
                                    placeholder="Enter PC user"
                                    className={errors.pcUser ? "error" : ""}
                                />
                            </div>

                            {/* PC ASSIGN TO */}
                            <div className="field">
                                <label htmlFor="pcAssignTo">PC Assign To <span>*</span></label>
                                <input
                                    id="pcAssignTo"
                                    name="pcAssignTo"
                                    type="text"
                                    value={formData.pcAssignTo}
                                    onChange={handleChange}
                                    placeholder="Enter assigned person"
                                    className={errors.pcAssignTo ? "error" : ""}
                                />
                            </div>

                            {/* PC MAKING MODEL */}
                            <div className="field">
                                <label htmlFor="pcMakingModel">PC Make / Model <span>*</span></label>
                                <input
                                    id="pcMakingModel"
                                    name="pcMakingModel"
                                    type="text"
                                    value={formData.pcMakingModel}
                                    onChange={handleChange}
                                    placeholder="Enter PC make / model"
                                    className={errors.pcMakingModel ? "error" : ""}
                                />
                            </div>

                            {/* PC NAME */}
                            <div className="field">
                                <label htmlFor="pcName">PC Name <span>*</span></label>
                                <input
                                    id="pcName"
                                    name="pcName"
                                    type="text"
                                    value={formData.pcName}
                                    onChange={handleChange}
                                    placeholder="Enter PC name"
                                    className={errors.pcName ? "error" : ""}
                                />
                            </div>

                            {/* IP ADDRESS */}
                            <div className="field">
                                <label htmlFor="ipAddress">IP Address <span>*</span></label>
                                <input
                                    id="ipAddress"
                                    name="ipAddress"
                                    type="text"
                                    value={formData.ipAddress}
                                    onChange={handleChange}
                                    placeholder="192.168.x.x"
                                    className={errors.ipAddress ? "error" : ""}
                                />
                            </div>

                            {/* MAC ADDRESS */}
                            <div className="field">
                                <label htmlFor="macAddress">MAC Address <span>*</span></label>
                                <input
                                    id="macAddress"
                                    name="macAddress"
                                    type="text"
                                    value={formData.macAddress}
                                    onChange={handleChange}
                                    placeholder="00:1A:2B:3C:4D:5E"
                                    className={errors.macAddress ? "error" : ""}
                                />
                            </div>

                            {/* PC SERIAL */}
                            <div className="field">
                                <label htmlFor="pcSerialNo">PC Serial No <span>*</span></label>
                                <input
                                    id="pcSerialNo"
                                    name="pcSerialNo"
                                    type="text"
                                    value={formData.pcSerialNo}
                                    onChange={handleChange}
                                    placeholder="Enter serial number"
                                    className={errors.pcSerialNo ? "error" : ""}
                                />
                            </div>

                            {/* PRINTER ATTACHED */}
                            <div className="field">
                                <label htmlFor="printerAttached">Printer Attached <span>*</span></label>
                                <select
                                    id="printerAttached"
                                    name="printerAttached"
                                    value={formData.printerAttached}
                                    onChange={handleChange}
                                    className={errors.printerAttached ? "error" : ""}
                                >
                                    <option value="">Select option</option>
                                    <option value="Yes - Common">Yes - Common</option>
                                    <option value="Yes - Individual">Yes - Individual</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* PRINTER NAME AND MAKER MODEL */}
                            <div className="field">
                                <label htmlFor="printerNameAndMakerModel">Printer Name And Maker Model <span>*</span></label>
                                <input
                                    id="printerNameAndMakerModel"
                                    name="printerNameAndMakerModel"
                                    type="text"
                                    value={formData.printerNameAndMakerModel}
                                    onChange={handleChange}
                                    placeholder="Enter printer name and maker model"
                                    disabled={formData.printerAttached === "No"}
                                    className={errors.printerNameAndMakerModel ? "error" : ""}
                                />
                            </div>

                            {/* PRINTER TYPE */}
                            <div className="field">
                                <label htmlFor="colourBlackAndWhite">Colour / Black & White <span>*</span></label>
                                <select
                                    id="colourBlackAndWhite"
                                    name="colourBlackAndWhite"
                                    value={formData.colourBlackAndWhite}
                                    onChange={handleChange}
                                    disabled={formData.printerAttached === "No"}
                                    className={errors.colourBlackAndWhite ? "error" : ""}
                                >
                                    <option value="">Select option</option>
                                    <option value="Colour">Colour</option>
                                    <option value="Black and White">Black and White</option>
                                    <option value="N/A">N/A</option>
                                </select>
                            </div>

                            {/* OS */}
                            <div className="field">
                                <label htmlFor="os">Operating System <span>*</span></label>
                                <input
                                    id="os"
                                    name="os"
                                    type="text"
                                    value={formData.os}
                                    onChange={handleChange}
                                    placeholder="e.g. Windows"
                                    className={errors.os ? "error" : ""}
                                />
                            </div>

                            {/* OS VERSION */}
                            <div className="field">
                                <label htmlFor="osVersion">OS Version <span>*</span></label>
                                <input
                                    id="osVersion"
                                    name="osVersion"
                                    type="text"
                                    value={formData.osVersion}
                                    onChange={handleChange}
                                    placeholder="e.g. Windows 11"
                                    className={errors.osVersion ? "error" : ""}
                                />
                            </div>

                            {/* MS OFFICE */}
                            <div className="field">
                                <label htmlFor="msOffice">MS Office <span>*</span></label>
                                <input
                                    id="msOffice"
                                    name="msOffice"
                                    type="text"
                                    value={formData.msOffice}
                                    onChange={handleChange}
                                    placeholder="Enter Office version"
                                    className={errors.msOffice ? "error" : ""}
                                />
                            </div>

                            {/* ANTIVIRUS */}
                            <div className="field">
                                <label htmlFor="antivirus">Antivirus <span>*</span></label>
                                <select
                                    id="antivirus"
                                    name="antivirus"
                                    value={formData.antivirus}
                                    onChange={handleChange}
                                    className={errors.antivirus ? "error" : ""}
                                >
                                    <option value="">Select option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* BUILDING NO */}
                            <div className="field">
                                <label htmlFor="buildingNo">Building No <span>*</span></label>
                                <input
                                    id="buildingNo"
                                    name="buildingNo"
                                    type="text"
                                    value={formData.buildingNo}
                                    onChange={handleChange}
                                    placeholder="Enter building number"
                                    className={errors.buildingNo ? "error" : ""}
                                />
                            </div>

                            {/* PURCHASE YEAR */}
                            <div className="field">
                                <label htmlFor="purchaseYear">Purchase Year <span>*</span></label>
                                <input
                                    id="purchaseYear"
                                    name="purchaseYear"
                                    type="number"
                                    value={formData.purchaseYear}
                                    onChange={handleChange}
                                    placeholder="e.g. 2025"
                                    className={errors.purchaseYear ? "error" : ""}
                                />
                            </div>

                            {/* RAM */}
                            <div className="field">
                                <label htmlFor="ramCapacity">RAM Capacity <span>*</span></label>
                                <input
                                    id="ramCapacity"
                                    name="ramCapacity"
                                    type="text"
                                    value={formData.ramCapacity}
                                    onChange={handleChange}
                                    placeholder="e.g. 8GB / 16GB"
                                    className={errors.ramCapacity ? "error" : ""}
                                />
                            </div>

                            {/* ASSET NO */}
                            <div className="field">
                                <label htmlFor="assetNo">Asset No <span>*</span></label>
                                <input
                                    id="assetNo"
                                    name="assetNo"
                                    type="text"
                                    value={formData.assetNo}
                                    onChange={handleChange}
                                    placeholder="Enter asset number"
                                    className={errors.assetNo ? "error" : ""}
                                />
                            </div>

                            {/* PROCESSER */}
                            <div className="field">
                                <label htmlFor="processer">Processor <span>*</span></label>
                                <input
                                    id="processer"
                                    name="processer"
                                    type="text"
                                    value={formData.processer}
                                    onChange={handleChange}
                                    placeholder="e.g. Intel i5"
                                    className={errors.processer ? "error" : ""}
                                />
                            </div>

                            {/* END POINT SYSTEM */}
                            <div className="field">
                                <label htmlFor="endPointSystem">End Point System <span>*</span></label>
                                <select
                                    id="endPointSystem"
                                    name="endPointSystem"
                                    value={formData.endPointSystem}
                                    onChange={handleChange}
                                    className={errors.endPointSystem ? "error" : ""}
                                >
                                    <option value="">Select option</option>
                                    <option value="LAN">LAN</option>
                                    <option value="Internet">Internet</option>
                                </select>
                            </div>

                            {/* REMARK */}
                            <div className="field full-width">
                                <label htmlFor="remark">Remark</label>
                                <textarea
                                    id="remark"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    placeholder="Enter remarks"
                                />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="form-buttons">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Record"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default AddAssetRecord;