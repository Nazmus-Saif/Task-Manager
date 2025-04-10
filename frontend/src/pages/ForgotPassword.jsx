import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { authController } from "../controllers/authController";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { isSendingForgotPasswordEmail, forgotPassword } =
    authController();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-page-container">
        <div className="forgot-password-card">
          <h2 className="forgot-password-heading">Forgot Password</h2>
          <h3 className="forgot-password-text">
            Enter your email address to get link to reset your password. Also
            check in your spam.
          </h3>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="forgot-password-form-input-wrapper">
              <input
                type="email"
                placeholder="Email"
                className="forgot-password-form-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="verify-button"
              disabled={isSendingForgotPasswordEmail}
            >
              {isSendingForgotPasswordEmail ? (
                <FaSpinner className="loading-icon" />
              ) : (
                "Send Reset Link"
              )}
            </button>
            <div className="back-to-signin">
              <Link to="/signin" className="back-to-signin">
                <FaArrowLeft /> Back to Signin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
