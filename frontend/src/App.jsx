import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import SuperAdminPage from "./pages/admin/SuperAdminPage.jsx";
import ProjectManagers from "./pages/admin/ProjectManagers.jsx";
import Developers from "./pages/admin/Developers.jsx";
import Tasks from "./pages/admin/Tasks.jsx";
import DeveloperPage from "./pages/developer/DeveloperPage.jsx";
import MyTasks from "./pages/developer/MyTasks.jsx";
import Notifications from "./pages/developer/Notifications.jsx";
import ProjectManagerPage from "./pages/manager/ProjectManagerPage.jsx";
import DevelopersManaged from "./pages/manager/DevelopersManaged.jsx";
import Operations from "./pages/manager/Operations.jsx";
import { authenticationController } from "./controllers/authenticationController.js";
import "./styles/GlobalVariables.css";
import "./styles/Authentication.css";
import "./styles/UserDashboard.css";
import "./styles/UserProfilePage.css";

function App() {
  const { authorizedUser, checkAuth, isCheckingAuthentication } =
    authenticationController();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuthentication) {
    return (
      <div className="global-loading-state">
        <h1>
          TASK<span className="text-highlight">MANAGER</span>
        </h1>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/user/verify-email" element={<VerifyEmailPage />} />
          <Route path="/user/profile" element={<UserProfilePage />} />
          <Route path="/user/signin" element={<SignInPage />} />
          <Route
            path="/user/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/super-admin/dashboard" element={<SuperAdminPage />} />
          <Route
            path="/super-admin/project-managers"
            element={<ProjectManagers />}
          />
          <Route path="/super-admin/developers" element={<Developers />} />
          <Route path="/super-admin/tasks" element={<Tasks />} />
          <Route path="/developer/dashboard" element={<DeveloperPage />} />
          <Route path="/developer/my-tasks" element={<MyTasks />} />
          <Route path="/developer/notifications" element={<Notifications />} />
          <Route
            path="/project-manager/dashboard"
            element={<ProjectManagerPage />}
          />
          <Route
            path="/project-manager/developers"
            element={<DevelopersManaged />}
          />
          <Route path="/project-manager/operations" element={<Operations />} />
          <Route
            path="*"
            element={<Navigate to="/project-manager/dashboard" />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster toastOptions={{ className: "toast-custom-style" }} />
    </div>
  );
}

export default App;
