import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage.jsx";
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
          <Route
            path="/super-admin/dashboard"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "super_admin" ? (
                <SuperAdminPage />
              ) : (
                <Navigate to="/user/signin" />
              )
            }
          />
          <Route
            path="/super-admin/project-managers"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "super_admin" ? (
                <ProjectManagers />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/super-admin/developers"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "super_admin" ? (
                <Developers />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/super-admin/tasks"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "super_admin" ? (
                <Tasks />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/user/signin"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "super_admin" ? (
                <Navigate to="/super-admin/dashboard" />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/developer/dashboard"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "developer" ? (
                <DeveloperPage />
              ) : (
                <Navigate to="/user/signin" />
              )
            }
          />
          <Route
            path="/developer/my-tasks"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "developer" ? (
                <MyTasks />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/developer/notifications"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "developer" ? (
                <Notifications />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/user/signin"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "developer" ? (
                <Navigate to="/developer/dashboard" />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/project-manager/dashboard"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "project_manager" ? (
                <ProjectManagerPage />
              ) : (
                <Navigate to="/user/signin" />
              )
            }
          />
          <Route
            path="/project-manager/developers"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "project_manager" ? (
                <DevelopersManaged />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/project-manager/operations"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "project_manager" ? (
                <Operations />
              ) : (
                <SignInPage />
              )
            }
          />
          <Route
            path="/user/signin"
            element={
              authorizedUser &&
              authorizedUser?.user_data.role === "project_manager" ? (
                <Navigate to="/project-manager/dashboard" />
              ) : (
                <SignInPage />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster toastOptions={{ className: "toast-custom-style" }} />
    </div>
  );
}

export default App;
