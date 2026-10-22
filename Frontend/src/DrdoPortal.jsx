
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "./Apis/axois";
import "./DrdoPortal.css";
import google from "./Icons/google-login.png";

function DrdoPortal() {
  const [activeTab, setActiveTab] = useState("signin");
  const navi = useNavigate();

  // Sign in
  const [signinUserId, setSigninUserId] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [showSigninPassword, setShowSigninPassword] =
    useState(false);

  // Sign up
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

  // Admin
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] =
    useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Shared loading state
  const [loading, setLoading] = useState(false);

  // USER SIGN IN
  const handleSignin = async (e) => {
    e.preventDefault();

    if (!signinUserId.trim() || !signinPassword) {
      alert("Please enter User ID and Password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: signinUserId.trim(),
        password: signinPassword,
      });

      // Assumes the backend returns the JWT as plain text.
      // If your API returns { token: "..." }, use response.data.token.
      const token =
        typeof response.data === "string"
          ? response.data
          : response.data.token;

      if (!token) {
        throw new Error("JWT token was not returned by the server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", signinUserId.trim());

      navi("/DrdoDashboard");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // USER SIGN UP
  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !signupUserId.trim() ||
      !signupName.trim() ||
      !signupMobile.trim() ||
      !signupEmail.trim() ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/Register", {
        username: signupUserId.trim(),
        password: signupPassword,
      });

      alert("Registration successful! Please sign in.");

      setSigninUserId(signupUserId.trim());
      setSignupUserId("");
      setSignupName("");
      setSignupMobile("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setActiveTab("signin");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your registered email address.");
      return;
    }

    setForgotLoading(true);
    setForgotMessage("");

    try {
      // Create this endpoint in your Spring Boot backend.
      await api.post("/auth/forgot-password", {
        email: forgotEmail.trim(),
      });

      setForgotMessage(
        "If an account exists for this email, password reset instructions will be sent."
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response?.status === 404) {
        setForgotMessage(
          "Password reset is not configured on the backend yet."
        );
      } else {
        setForgotMessage(
          "Unable to process your request. Please try again later."
        );
      }
    } finally {
      setForgotLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = () => {
    // UI only: connect Google OAuth 2.0 here.
    alert(
      "Google sign-in requires Google OAuth 2.0 configuration."
    );
  };

  // ADMIN LOGIN
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!adminId.trim() || !adminPassword) {
      alert("Please enter Admin ID and Password");
      return;
    }

    // Demo-only check. Replace with backend admin authentication.
    if (adminId === "Admin" && adminPassword === "@dmin") {
      navi("/AdminDashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  // SIGN IN FORM
  const renderSignin = () => (
    <form onSubmit={handleSignin}>
      <div className="input-group">
        <label htmlFor="signinUserId">User ID</label>
        <input
          id="signinUserId"
          type="text"
          autoComplete="username"
          value={signinUserId}
          onChange={(e) => setSigninUserId(e.target.value)}
          placeholder="Enter your User ID"
          required
        />
      </div>

      <div className="input-group">
        <div className="label-row">
          <label htmlFor="signinPassword">Password</label>

          <button
            type="button"
            className="forgot-link"
            onClick={() => {
              setForgotEmail("");
              setForgotMessage("");
              setActiveTab("forgot");
            }}
          >
            Forgot Password?
          </button>
        </div>

        <div className="password-box">
          <input
            id="signinPassword"
            type={showSigninPassword ? "text" : "password"}
            autoComplete="current-password"
            value={signinPassword}
            onChange={(e) => setSigninPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button
            type="button"
            className="show-password"
            onClick={() =>
              setShowSigninPassword((prev) => !prev)
            }
            aria-label={showSigninPassword ? "Hide password" : "Show password"}
          >
            {showSigninPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div className="bottom-text">
        Don't have an account?
        <button
          type="button"
          className="link-button"
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="divider-text">
        <span />
        <p>OR CONTINUE WITH</p>
        <span />
      </div>

      <button
        type="button"
        className="google-login-button"
        onClick={handleGoogleLogin}
      >
        <img src={google} alt="" className="google-icon" />
        <span>Continue with Google</span>
      </button>
    </form>
  );

  // SIGN UP FORM
  const renderSignup = () => (
    <form onSubmit={handleSignup}>
      <div className="two-column">
        <div className="input-group">
          <label htmlFor="signupUserId">User ID</label>
          <input
            id="signupUserId"
            value={signupUserId}
            onChange={(e) => setSignupUserId(e.target.value)}
            placeholder="User ID"
            autoComplete="username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="signupName">Name</label>
          <input
            id="signupName"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Full Name"
            autoComplete="name"
            required
          />
        </div>
      </div>

      <div className="two-column">
        <div className="input-group">
          <label htmlFor="signupMobile">Mobile</label>
          <input
            id="signupMobile"
            type="tel"
            value={signupMobile}
            onChange={(e) => setSignupMobile(e.target.value)}
            placeholder="Mobile Number"
            autoComplete="tel"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="signupEmail">Email</label>
          <input
            id="signupEmail"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="signupPassword">Password</label>
        <div className="password-box">
          <input
            id="signupPassword"
            type={showSignupPassword ? "text" : "password"}
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Create Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="show-password"
            onClick={() =>
              setShowSignupPassword((prev) => !prev)
            }
          >
            {showSignupPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="password-box">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="show-password"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="bottom-text">
        Already have an account?
        <button
          type="button"
          className="link-button"
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </button>
      </div>
    </form>
  );

  // FORGOT PASSWORD FORM
  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword}>
      <div className="forgot-icon" aria-hidden="true">
        ✉
      </div>

      <div className="forgot-description">
        <p>
          Enter the email address registered with your account.
          If password recovery is configured, we'll send you
          instructions to reset your password.
        </p>
      </div>

      <div className="input-group">
        <label htmlFor="forgotEmail">Registered Email</label>
        <input
          id="forgotEmail"
          type="email"
          autoComplete="email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />
      </div>

      {forgotMessage && (
        <p
          className="forgot-message"
          role="status"
          aria-live="polite"
        >
          {forgotMessage}
        </p>
      )}

      <button
        type="submit"
        className="login-button"
        disabled={forgotLoading}
      >
        {forgotLoading ? "Sending Request..." : "Send Reset Instructions"}
      </button>

      <div className="bottom-text">
        Remember your password?
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setForgotMessage("");
            setActiveTab("signin");
          }}
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );

  // ADMIN FORM
  const renderAdmin = () => (
    <form onSubmit={handleAdminLogin}>
      <div className="admin-info">
        <div className="admin-icon">🛡️</div>
        <p>
          Admin access is restricted to authorized personnel.
        </p>
      </div>

      <div className="input-group">
        <label htmlFor="adminId">Admin ID</label>
        <input
          id="adminId"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter Admin ID"
          autoComplete="username"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="adminPassword">Admin Password</label>
        <div className="password-box">
          <input
            id="adminPassword"
            type={showAdminPassword ? "text" : "password"}
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter Admin Password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="show-password"
            onClick={() =>
              setShowAdminPassword((prev) => !prev)
            }
          >
            {showAdminPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button type="submit" className="login-button">
        Admin Sign In
      </button>

      <div className="bottom-text">
        <button
          type="button"
          className="link-button"
          onClick={() => setActiveTab("signin")}
        >
          Back to User Sign In
        </button>
      </div>
    </form>
  );

  const heading = {
    signin: {
      title: "Welcome Back",
      description: "Sign in to access your account.",
    },
    signup: {
      title: "Create Account",
      description: "Register for the DRDO asset portal.",
    },
    admin: {
      title: "Admin Portal",
      description: "Sign in with your administrator credentials.",
    },
    forgot: {
      title: "Forgot Password?",
      description: "Recover access to your account.",
    },
  }[activeTab];

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="welcome-section">
          <div className="welcome-content">
            <div className="brand-mark">AM</div>
            <h2>Asset Management</h2>
            <p className="welcome-description">
              Secure Asset Management Portal
            </p>
            <div className="welcome-line" />
            <p className="welcome-footer">
              Manage your assets with security and confidence.
            </p>
          </div>
        </section>

        <section className="login-card">
          {activeTab !== "forgot" && (
            <div className="tabs">
              <button
                type="button"
                className={activeTab === "signin" ? "tab active" : "tab"}
                onClick={() => setActiveTab("signin")}
              >
                Sign In
              </button>

              <button
                type="button"
                className={activeTab === "signup" ? "tab active" : "tab"}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>

              <button
                type="button"
                className={activeTab === "admin" ? "tab active" : "tab"}
                onClick={() => setActiveTab("admin")}
              >
                Admin
              </button>
            </div>
          )}

          <div className="form-heading">
            <h1>{heading.title}</h1>
            <p>{heading.description}</p>
          </div>

          {activeTab === "signin" && renderSignin()}
          {activeTab === "signup" && renderSignup()}
          {activeTab === "admin" && renderAdmin()}
          {activeTab === "forgot" && renderForgotPassword()}
        </section>
      </div>
    </div>
  );
}

export default DrdoPortal;
