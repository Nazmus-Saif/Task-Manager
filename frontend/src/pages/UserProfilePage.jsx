import React, { useState } from "react";
import { FiUser, FiMail, FiCamera } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController.js";

const ProfilePage = () => {
  const { authorizedUser, isUpdatingProfile, updateProfile } =
    authController();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (!image) return false;

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImage(base64Image);
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
      }
    };
  };

  return (
    <main className="profile-page">
      <div className="profile-page-container">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">Your profile information</p>
            <div className="profile-picture">
              <img
                src={
                  selectedImage ||
                  authorizedUser?.profilePic ||
                  "../images/avatar.png"
                }
                alt="Profile"
              />
              <label htmlFor="avatar-upload">
                {isUpdatingProfile ? (
                  <FaSpinner className="loading-icon" />
                ) : (
                  <FiCamera className="camera-icon" />
                )}
              </label>
              <input
                type="file"
                id="avatar-upload"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </div>
            <p className="update-photo-instruction">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="profile-info">
            <div className="info-wrapper">
              <label>
                <FiUser className="user-icon" /> Full Name
              </label>
              <input
                type="text"
                value={authorizedUser?.fullName || "N/A"}
                readOnly
              />
            </div>
            <div className="info-wrapper">
              <label>
                <FiMail className="mail-icon" /> Email Address
              </label>
              <input
                type="email"
                value={authorizedUser?.email || "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="account-information">
            <div className="information-row">
              <span>Member Since</span>
              <span>
                {authorizedUser?.createdAt
                  ? new Date(authorizedUser.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
