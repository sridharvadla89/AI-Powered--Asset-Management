import { useState } from "react";
import api from "./Apis/axois"
import "./DrdoPortal.css";
import {useNavigate} from "react-router"
function DrdoPortal() {
  const [activeTab, setActiveTab] = useState("signin");

  // ==============================
  // SIGN IN
  // ==============================
const navi=useNavigate();
  const [signinUserId, setSigninUserId] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [showSigninPassword, setShowSigninPassword] =
    useState(false);

  // ==============================
  // SIGN UP
  // ==============================

  const [signupUserId, setSignupUserId] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] =
    useState("");

  const [showSignupPassword, setShowSignupPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==============================
  // ADMIN
  // ==============================

  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] =
    useState(false);

  // =====================================================
  // USER LOGIN
  // =====================================================

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!signinUserId || !signinPassword) {
      alert("Please enter User ID and Password");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        username: signinUserId,
        password: signinPassword,
      });

      // Backend returns JWT
      const token = response.data;

      // Save JWT
      localStorage.setItem("token", token);

      // Save username
      localStorage.setItem(
        "username",
        signinUserId
      );

      console.log("JWT Token:", token);
      navi("/DrdoDashboard")
      
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log(
          "Backend Response:",
          error.response.data
        );

        alert(
          error.response.data ||
            "Invalid User ID or Password"
        );
      } else {
        alert(
          "Unable to connect to backend. Make sure Spring Boot is running."
        );
      }
    }
  };

  // =====================================================
  // SIGN UP
  // =====================================================

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !signupUserId ||
      !signupName ||
      !signupMobile ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/Register", {
        username: signupUserId,
        // name: signupName,
        // mobile: signupMobile,
        // email: signupEmail,
        password: signupPassword,
      });

      alert("Registration successful!");

      // Clear fields
      setSignupUserId("");
      setSignupName("");
      setSignupMobile("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");

      // Go to Sign In
      setActiveTab("signin");
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      if (error.response) {
        console.log(
          "Backend Response:",
          error.response.data
        );

        alert(
          error.response.data ||
            "Registration failed"
        );
      } else {
        alert(
          "Unable to connect to backend."
        );
      }
    }
  };

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!adminId || !adminPassword) {
      alert(
        "Please enter Admin ID and Password"
      );
      return;
    }
    if(adminId=="Admin"||adminPassword=="@dmin"){
      navi("/AdminDashboard")}
  };

  // =====================================================
  // SIGN IN FORM
  // =====================================================

  const renderSignin = () => {
    return (
      <form onSubmit={handleSignin}>

        <div className="input-group">

          <label>User ID</label>

          <input
            type="text"
            value={signinUserId}
            onChange={(e) =>
              setSigninUserId(
                e.target.value
              )
            }
            placeholder="Enter your User ID"
          />

        </div>

        <div className="input-group">

          <label>Password</label>

          <div className="password-box">

            <input
              type={
                showSigninPassword
                  ? "text"
                  : "password"
              }
              value={signinPassword}
              onChange={(e) =>
                setSigninPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowSigninPassword(
                  !showSigninPassword
                )
              }
            >
              {showSigninPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

        </div>

        <button
          type="submit"
          className="login-button"
        >
          Sign In
        </button>

        <div className="bottom-text">

          Don't have an account?

          <button
            type="button"
            className="link-button"
            onClick={() =>
              setActiveTab("signup")
            }
          >
            Sign Up
          </button>

        </div>

      </form>
    );
  };

  // =====================================================
  // SIGN UP FORM
  // =====================================================

  const renderSignup = () => {
    return (
      <form onSubmit={handleSignup}>

        <div className="two-column">

          <div className="input-group">

            <label>User ID</label>

            <input
              type="text"
              value={signupUserId}
              onChange={(e) =>
                setSignupUserId(
                  e.target.value
                )
              }
              placeholder="User ID"
            />

          </div>

          <div className="input-group">

            <label>Name</label>

            <input
              type="text"
              value={signupName}
              onChange={(e) =>
                setSignupName(
                  e.target.value
                )
              }
              placeholder="Full Name"
            />

          </div>

        </div>

        <div className="two-column">

          <div className="input-group">

            <label>Mobile</label>

            <input
              type="tel"
              value={signupMobile}
              onChange={(e) =>
                setSignupMobile(
                  e.target.value
                )
              }
              placeholder="Mobile Number"
            />

          </div>

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              value={signupEmail}
              onChange={(e) =>
                setSignupEmail(
                  e.target.value
                )
              }
              placeholder="Email"
            />

          </div>

        </div>

        <div className="input-group">

          <label>Password</label>

          <div className="password-box">

            <input
              type={
                showSignupPassword
                  ? "text"
                  : "password"
              }
              value={signupPassword}
              onChange={(e) =>
                setSignupPassword(
                  e.target.value
                )
              }
              placeholder="Create Password"
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowSignupPassword(
                  !showSignupPassword
                )
              }
            >
              {showSignupPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

        </div>

        <div className="input-group">

          <label>Confirm Password</label>

          <div className="password-box">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                signupConfirmPassword
              }
              onChange={(e) =>
                setSignupConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm Password"
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

        </div>

        <button
          type="submit"
          className="login-button"
        >
          Create Account
        </button>

        <div className="bottom-text">

          Already have an account?

          <button
            type="button"
            className="link-button"
            onClick={() =>
              setActiveTab("signin")
            }
          >
            Sign In
          </button>

        </div>

      </form>
    );
  };

  // =====================================================
  // ADMIN FORM
  // =====================================================

  const renderAdmin = () => {
    return (
      <form onSubmit={handleAdminLogin}>

        <div className="admin-info">

          <div className="admin-icon">
            🛡️
          </div>

          <p>
            Admin access is restricted to
            authorized personnel.
          </p>

        </div>

        <div className="input-group">

          <label>Admin ID</label>

          <input
            type="text"
            value={adminId}
            onChange={(e) =>
              setAdminId(
                e.target.value
              )
            }
            placeholder="Enter Admin ID"
          />

        </div>

        <div className="input-group">

          <label>Admin Password</label>

          <div className="password-box">

            <input
              type={
                showAdminPassword
                  ? "text"
                  : "password"
              }
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(
                  e.target.value
                )
              }
              placeholder="Enter Admin Password"
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowAdminPassword(
                  !showAdminPassword
                )
              }
            >
              {showAdminPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

        </div>

        <button
          type="submit"
          className="login-button"
        >
          Admin Sign In
        </button>

        <div className="bottom-text">

          <button
            type="button"
            className="link-button"
            onClick={() =>
              setActiveTab("signin")
            }
          >
            Back to User Sign In
          </button>

        </div>

      </form>
    );
  };

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT */}

        <div className="welcome-section">

          <div>

            <div className="drdo-logo">
              DRDO
            </div>

            <h2>
              Asset Management
            </h2>

            <p>
              Secure Asset Management Portal
            </p>

            <div className="welcome-line"></div>

            <span>
              Defence Research and
              Development Organisation
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div className="login-card">

          {/* TABS */}

          <div className="tabs">

            <button
              type="button"
              className={
                activeTab === "signin"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("signin")
              }
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                activeTab === "signup"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("signup")
              }
            >
              Sign Up
            </button>

            <button
              type="button"
              className={
                activeTab === "admin"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("admin")
              }
            >
              Admin
            </button>

          </div>

          {/* HEADING */}

          <div className="form-heading">

            <h1>

              {activeTab === "signin" &&
                "Welcome Back"}

              {activeTab === "signup" &&
                "Create Account"}

              {activeTab === "admin" &&
                "Admin Portal"}

            </h1>

            <p>

              {activeTab === "signin" &&
                "Sign in to access your account."}

              {activeTab === "signup" &&
                "Register for the DRDO asset portal."}

              {activeTab === "admin" &&
                "Sign in with your administrator credentials."}

            </p>

          </div>

          {/* FORMS */}

          {activeTab === "signin" &&
            renderSignin()}

          {activeTab === "signup" &&
            renderSignup()}

          {activeTab === "admin" &&
            renderAdmin()}

        </div>

      </div>

    </div>
  );
}

export default DrdoPortal;