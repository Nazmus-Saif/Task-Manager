import React from "react";

const FloatingForm = ({ isOpen, onClose, children }) => {
  return (
    <div className={`form-container ${isOpen ? "active" : ""}`}>
      <div
        className={`form-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div className="form-wrapper">
        <button className="btn close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default FloatingForm;
