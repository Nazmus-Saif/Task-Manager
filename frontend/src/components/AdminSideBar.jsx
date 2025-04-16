import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdPeopleAlt,
  MdWork,
  MdLogout,
} from "react-icons/md";
import { authController } from "../controllers/authController.js";

const AdminSideBar = () => {
  const { signOut } = authController();

  const links = [
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
  ];

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

export default AdminSideBar;
