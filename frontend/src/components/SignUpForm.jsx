import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController.js";

const SignUpForm = ({ closeForm }) => {
  const [isSignUpPasswordVisible, setIsSignUpPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [permissions, setPermissions] = useState({
    create_user: false,
    get_users: false,
    update_user: false,
    delete_user: false,
    create_task: false,
    get_tasks: false,
    update_task: false,
    delete_task: false,
  });

  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const { signUp, isSigningUp } = authController();

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

  const handleNext = (e) => {
    e.preventDefault();

    if (validateSignUpForm(signUpFormData)) {
      setStep(2);
    }
  };

  const handlePermissionChange = (e) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  const handleSignUpSubmission = async (e) => {
    e.preventDefault();
    const finalData = { ...signUpFormData, permissions };
    await signUp(finalData);
    setSignUpFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setPermissions({
      create_user: false,
      get_users: false,
      update_user: false,
      delete_user: false,
      create_task: false,
      get_tasks: false,
      update_task: false,
      delete_task: false,
    });
    closeForm();
    setStep(1);
  };

  return (
    <form onSubmit={handleSignUpSubmission} className="sign-up-form">
      <div className="form-content">
        {step === 1 ? (
          <>
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
              <input
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
                placeholder="Role"
              />
            </div>

            <button type="button" className="form-button" onClick={handleNext}>
              Next
            </button>
          </>
        ) : (
          <>
            <h2>Set Permissions</h2>
            <div className="checkbox-container">
              <div className="checkbox-wrapper">
                <label>
                  <input
                    type="checkbox"
                    name="all"
                    checked={Object.values(permissions).every(Boolean)}
                    onChange={(e) => {
                      const newState = Object.fromEntries(
                        Object.entries(permissions).map(([key]) => [
                          key,
                          e.target.checked,
                        ])
                      );
                      setPermissions(newState);
                    }}
                  />
                  All
                </label>

                {Object.entries(permissions).map(([key, value]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handlePermissionChange}
                    />
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={isSigningUp}
            >
              {isSigningUp ? <FaSpinner className="loading-icon" /> : "Submit"}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
