import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController.js";

const SignInPage = () => {
  const { signIn, isSigningIn } = authController();
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignInPasswordVisible, setIsSignInPasswordVisible] = useState(false);

  const toggleSignInPasswordVisibility = () =>
    setIsSignInPasswordVisible(!isSignInPasswordVisible);

  const validateSignInForm = (formData) => {
    let { email, password } = formData;
    email = email.trim().toLowerCase();

    if (!email && !password) {
      toast.error("All fields are required!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      return false;
    }

    return true;
  };

  const handleSignInSubmission = (e) => {
    e.preventDefault();
    if (validateSignInForm(signInFormData)) {
      signIn(signInFormData);
    }
  };
  return (
    <main className="signin-page">
      <div className="signin-card">
        <div className="card-heading">
          <h1>Task Manager</h1>
        </div>
        <form onSubmit={handleSignInSubmission} className="signin-form">
          <div className="form-content">
            <h3>Sign In With Your Email & Password</h3>
            <div className="form-input-wrapper">
              <input
                type="email"
                placeholder="Email"
                className="form-input-field"
                value={signInFormData.email}
                onChange={(e) =>
                  setSignInFormData({
                    ...signInFormData,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-input-wrapper">
              <input
                type={isSignInPasswordVisible ? "text" : "password"}
                placeholder="Password"
                className="form-input-field"
                value={signInFormData.password}
                onChange={(e) =>
                  setSignInFormData({
                    ...signInFormData,
                    password: e.target.value,
                  })
                }
              />
              <span
                className="password-toggle-icon"
                onClick={toggleSignInPasswordVisibility}
              >
                {isSignInPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="forgot-password-wrapper">
              <Link to="/user/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="form-button"
              disabled={isSigningIn}
            >
              {isSigningIn ? <FaSpinner className="loading-icon" /> : "Sign In"}
            </button>
            <div className="or-separator">
              <span>or</span>
            </div>
            <div className="social-signin-wrapper">
              <Link className="social-signin">Continue with Google</Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignInPage;
