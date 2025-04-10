import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdPeopleAlt,
  MdWork,
  MdLogout,
  MdNotifications,
  MdAssessment,
} from "react-icons/md";
import { authController } from "../controllers/authController.js";

const SideBar = () => {
  const { authorizedUser, signOut } = authController();
  const [role, setRole] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (authorizedUser) {
      setRole(authorizedUser.data.role);
    }
  }, [authorizedUser]);

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/notifications/${authorizedUser.data.id}/`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotificationCount((prevCount) => prevCount + 1);
      };

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      return () => ws.close();
    }
  }, [authorizedUser]);

  const sidebarData = {
    super_admin: [
      {
        to: "/super-admin/dashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/super-admin/users",
        icon: <MdPeopleAlt />,
        label: "Users",
      },
      {
        to: "/super-admin/tasks",
        icon: <MdWork />,
        label: "Tasks",
      },
    ],
    user: [
      {
        to: "/user/dashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/user/my-tasks",
        icon: <MdAssessment />,
        label: "My Tasks",
      },
      {
        to: "/user/notifications",
        icon: <MdNotifications />,
        label: "Notifications",
        notificationCount: notificationCount,
      },
    ],
  };

  const links =
    role === "super_admin" ? sidebarData.super_admin : sidebarData.user;

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          TASK<span className="text-highlight">MANAGER</span>
        </h1>
      </div>

      <nav className="sidebar-menu">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={
              link.label === "Notifications"
                ? handleNotificationClick
                : undefined
            }
          >
            {link.icon}
            <h4>{link.label}</h4>
            {link.notificationCount > 0 && link.label === "Notifications" && (
              <span className="notification-badge">
                <p>{link.notificationCount}</p>
              </span>
            )}
          </NavLink>
        ))}
        <div className="sidebar-link signout" onClick={signOut}>
          <MdLogout />
          <h4>Sign Out</h4>
        </div>
      </nav>
    </aside>
  );
};

export default SideBar;
