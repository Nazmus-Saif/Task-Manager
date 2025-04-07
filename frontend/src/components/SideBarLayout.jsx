import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdSupervisorAccount,
  MdPeopleAlt,
  MdWork,
  MdLogout,
  MdManageAccounts,
  MdNotifications,
  MdAssessment,
} from "react-icons/md";
import { authenticationController } from "../controllers/authenticationController.js";

const SideBar = ({ role }) => {
  const { signOut } = authenticationController();

  const sidebarData = {
    super_admin: [
      {
        to: "/super-admin/dashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/super-admin/project-managers",
        icon: <MdSupervisorAccount />,
        label: "Project Managers",
      },
      {
        to: "/super-admin/developers",
        icon: <MdPeopleAlt />,
        label: "Developers",
      },
      {
        to: "/super-admin/tasks",
        icon: <MdWork />,
        label: "Tasks",
      },
    ],
    project_manager: [
      {
        to: "/project-manager/dashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/project-manager/developers",
        icon: <MdPeopleAlt />,
        label: "Developers",
      },
      {
        to: "/project-manager/operations",
        icon: <MdManageAccounts />,
        label: "Operations",
      },
    ],
    developer: [
      {
        to: "/developer/dashboard",
        icon: <MdSpaceDashboard />,
        label: "Dashboard",
      },
      {
        to: "/developer/my-tasks",
        icon: <MdAssessment />,
        label: "My Tasks",
      },
      {
        to: "/developer/notifications",
        icon: <MdNotifications />,
        label: "Notifications",
      },
    ],
  };

  const links = sidebarData[role] || [];

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
