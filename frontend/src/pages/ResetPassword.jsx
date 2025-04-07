import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { authenticationController } from "../controllers/authenticationController";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isPasswordReset } = authenticationController();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await resetPassword(token, password);
    setTimeout(() => {
      navigate("/access");
    }, 2000);
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-page-container">
        <div className="forgot-password-card">
          <h2 className="forgot-password-heading">Reset Password</h2>
          <h3 className="forgot-password-text">
            Enter a new password for your account
          </h3>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="forgot-password-form-input-wrapper">
              <input
                type="password"
                placeholder="Password"
                className="forgot-password-form-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="forgot-password-form-input-wrapper">
              <input
                type="password"
                placeholder="Confirm Password"
                className="forgot-password-form-input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="verify-button"
              disabled={isPasswordReset}
            >
              {isPasswordReset ? (
                <FaSpinner className="loading-icon" />
              ) : (
                "Reset Password"
              )}
            </button>
            <div className="back-to-signin">
              <Link to="/access" className="back-to-signin">
                <FaArrowLeft /> Back to Signin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
