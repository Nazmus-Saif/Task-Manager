import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef(Array(6).fill(null));
  const navigate = useNavigate();
  const { verifyEmail, isVerifyingEmail } = authController();

  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    const pastedCode = pastedText.slice(0, 6).split("");

    if (pastedCode.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((char) => char !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("").trim();
    if (!verificationCode) {
      toast.error("All fields are required!");
      return;
    }
    if (verificationCode.length < 6) {
      toast.error("Please enter the complete 6-character code!");
      return;
    }
    await verifyEmail(verificationCode);
    navigate("/");
  };

  useEffect(() => {
    if (code.every((char) => char !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendActive(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <main className="verify-email-page">
      <div className="verification-card">
        <h2 className="verification-heading">Verify Your Email</h2>
        <h3 className="verification-text">
          Enter the 6-character code sent to your email address. Also check in
          your spam.
        </h3>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-group">
            {code.map((char, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={char}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
              />
            ))}
          </div>
          <button
            type="submit"
            className="verify-button"
            disabled={isVerifyingEmail}
          >
            {isVerifyingEmail ? (
              <FaSpinner className="loading-icon" />
            ) : (
              "Verify Email"
            )}
          </button>
          <p className="resend-otp-text">
            Didn't receive a code?{" "}
            {isResendActive ? (
              <a className="resend-otp-link">Resend OTP</a>
            ) : (
              <>{formatTime(timer)}</>
            )}
          </p>
        </form>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
