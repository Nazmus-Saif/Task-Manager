import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { authController } from "./controllers/authController.js";
import SignInPage from "./pages/SignIn.jsx";
import SuperAdmin from "./pages/admin/SuperAdmin.jsx";
import Users from "./pages/admin/Users.jsx";
import Tasks from "./pages/admin/Tasks.jsx";
import User from "./pages/user/User.jsx";
import MyTasks from "./pages/user/MyTasks.jsx";
import Notifications from "./pages/user/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import "./styles/GlobalVariables.css";
import "./styles/Authentication.css";
import "./styles/UserDashboard.css";
import "./styles/UserProfilePage.css";

const PrivateRoute = ({ element, allowedRole }) => {
  const { authorizedUser } = authController();

  if (!authorizedUser) return <Navigate to="/user/signin" />;

  if (authorizedUser?.data.role === "super_admin" && allowedRole === "user") {
    return <Navigate to="/super-admin/dashboard" />;
  }
  if (
    authorizedUser?.data.role !== "super_admin" &&
    allowedRole === "super_admin"
  ) {
    return <Navigate to="/user/dashboard" />;
  }
  return element;
};

const AuthRedirect = () => {
  const { authorizedUser } = authController();
  const location = useLocation();

  if (authorizedUser) {
    const redirectPath =
      authorizedUser?.data.role === "super_admin"
        ? "/super-admin/dashboard"
        : "/user/dashboard";

    // Prevent infinite loop if already on the correct dashboard
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} />;
    }
  }

  return <SignInPage />;
};

function App() {
  const { authorizedUser, checkAuth, isCheckingAuthentication } =
    authController();

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
          <Route path="/user/signin" element={<AuthRedirect />} />
          <Route path="/user/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/reset-password" element={<ResetPassword />} />
          <Route
            path="/user/profile"
            element={
              authorizedUser ? <Profile /> : <Navigate to="/user/signin" />
            }
          />
          <Route
            path="/super-admin/dashboard"
            element={
              <PrivateRoute
                element={<SuperAdmin />}
                allowedRole="super_admin"
              />
            }
          />
          <Route
            path="/super-admin/users"
            element={
              <PrivateRoute element={<Users />} allowedRole="super_admin" />
            }
          />
          <Route
            path="/super-admin/tasks"
            element={
              <PrivateRoute element={<Tasks />} allowedRole="super_admin" />
            }
          />
          <Route
            path="/user/dashboard"
            element={<PrivateRoute element={<User />} allowedRole="user" />}
          />
          <Route
            path="/user/my-tasks"
            element={<PrivateRoute element={<MyTasks />} allowedRole="user" />}
          />
          <Route
            path="/user/notifications"
            element={
              <PrivateRoute element={<Notifications />} allowedRole="user" />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={
                  !authorizedUser
                    ? "/user/signin"
                    : authorizedUser?.data.role === "super_admin"
                    ? "/super-admin/dashboard"
                    : "/user/dashboard"
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster toastOptions={{ className: "toast-custom-style" }} />
    </div>
  );
}

export default App;
