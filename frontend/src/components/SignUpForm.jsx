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

  const validateSignUpForm = (formData) => {
    let { name, email, password, role } = formData;

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!name || !email || !password || !role) {
      toast.error("All fields are required!");
      return false;
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
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
                  setSignUpFormData({
                    ...signUpFormData,
                    name: e.target.value,
                  })
                }
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
                  setSignUpFormData({
                    ...signUpFormData,
                    role: e.target.value,
                  })
                }
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
                    name="create_user"
                    checked={permissions.create_user}
                    onChange={handlePermissionChange}
                  />
                  Create User
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="get_users"
                    checked={permissions.get_users}
                    onChange={handlePermissionChange}
                  />
                  Get Users
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="update_user"
                    checked={permissions.update_user}
                    onChange={handlePermissionChange}
                  />
                  Update User
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="delete_user"
                    checked={permissions.delete_user}
                    onChange={handlePermissionChange}
                  />
                  Delete User
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="create_task"
                    checked={permissions.create_task}
                    onChange={handlePermissionChange}
                  />
                  Create Task
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="get_tasks"
                    checked={permissions.get_tasks}
                    onChange={handlePermissionChange}
                  />
                  Get Tasks
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="update_task"
                    checked={permissions.update_task}
                    onChange={handlePermissionChange}
                  />
                  Update Task
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="delete_task"
                    checked={permissions.delete_task}
                    onChange={handlePermissionChange}
                  />
                  Delete Task
                </label>
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
