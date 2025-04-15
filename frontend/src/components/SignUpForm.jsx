import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController.js";

const SignUpForm = ({ closeForm }) => {
  const [isSignUpPasswordVisible, setIsSignUpPasswordVisible] = useState(false);
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const { signUp, isSigningUp, getRoles, roles } = authController();

  useEffect(() => {
    getRoles();
    console.log(roles);
  }, []);

  const toggleSignUpPasswordVisibility = () =>
    setIsSignUpPasswordVisible(!isSignUpPasswordVisible);

  const validateEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const validateSignUpForm = (formData) => {
    let { name, email, password, role } = formData;

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!name || !email || !password || !role) {
      toast.error("All fields are required!");
      return false;
    }
    if (!validateEmail.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

  const handleSignUpSubmission = async (e) => {
    e.preventDefault();

    if (validateSignUpForm(signUpFormData)) {
      await signUp(signUpFormData);
      setSignUpFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      closeForm();
    }
  };

  return (
    <form onSubmit={handleSignUpSubmission} className="sign-up-form">
      <div className="form-content">
        <h2>Add New User</h2>

        <div className="form-input-wrapper">
          <input
            type="text"
            placeholder="Full Name"
            className="form-input-field"
            value={signUpFormData.name}
            onChange={(e) =>
              setSignUpFormData({ ...signUpFormData, name: e.target.value })
            }
            onBlur={() => {
              if (!signUpFormData.name.trim()) {
                toast.error("Name is required!");
              }
            }}
          />
        </div>

        <div className="form-input-wrapper">
          <input
            type="email"
            placeholder="Email"
            className="form-input-field"
            value={signUpFormData.email}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                email: e.target.value,
              })
            }
            onBlur={() => {
              if (!signUpFormData.email.trim()) {
                toast.error("Email is required!");
              } else if (!validateEmail.test(signUpFormData.email)) {
                toast.error("Invalid email format!");
              }
            }}
          />
        </div>

        <div className="form-input-wrapper">
          <input
            type={isSignUpPasswordVisible ? "text" : "password"}
            placeholder="Password"
            className="form-input-field"
            value={signUpFormData.password}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                password: e.target.value,
              })
            }
            onBlur={() => {
              if (!signUpFormData.password) {
                toast.error("Password is required!");
              } else if (signUpFormData.password.length < 8) {
                toast.error("Password must be at least 8 characters long!");
              }
            }}
          />
          <span
            className="password-toggle-icon"
            onClick={toggleSignUpPasswordVisibility}
          >
            {isSignUpPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="form-input-wrapper">
          <select
            className="form-input-field"
            value={signUpFormData.role}
            onChange={(e) =>
              setSignUpFormData({ ...signUpFormData, role: e.target.value })
            }
            onBlur={() => {
              if (!signUpFormData.role.trim()) {
                toast.error("Role is required!");
              }
            }}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="form-button" disabled={isSigningUp}>
          {isSigningUp ? <FaSpinner className="loading-icon" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
