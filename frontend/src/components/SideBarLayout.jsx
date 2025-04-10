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

  useEffect(() => {
    if (authorizedUser) {
      setRole(authorizedUser.data.role);
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
      },
    ],
  };

  const links =
    role === "super_admin" ? sidebarData.super_admin : sidebarData.user;

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
          >
            {link.icon}
            <h4>{link.label}</h4>
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
