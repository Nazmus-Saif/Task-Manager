import React, { useState } from "react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";

const ProjectManagers = () => {
  const [pms, setPms] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      status: "Active",
      lastActive: "2025-03-22 12:30",
      teamLead: ["Team X"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      status: "Inactive",
      lastActive: "2025-03-20 10:00",
      teamLead: ["Team A"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingPm, setEditingPm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const userRole = "admin";

  const handleDelete = (pmId) => {
    setPms((prevPms) => prevPms.filter((pm) => pm.id !== pmId));
  };

  const handleEdit = (pm) => {
    setEditingPm(pm);
    setFormData({
      name: pm.name,
      email: pm.email,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedPm = { ...editingPm, ...formData };
    setPms((prevPms) =>
      prevPms.map((pm) => (pm.id === updatedPm.id ? updatedPm : pm))
    );
    setEditingPm(null); // Close the edit form
  };

  const handleCancel = () => {
    setEditingPm(null); // Close the edit form
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={userRole} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Project Managers</h1>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <MdSearch />
          </div>
        </header>
        <section className="project-manager-section">
          {editingPm ? (
            <div className="edit-form-container">
              <h2>Edit Project Manager</h2>
              <form onSubmit={handleFormSubmit} className="edit-form">
                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pms
                  .filter((pm) =>
                    pm.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((pm) => (
                    <tr key={pm.id}>
                      <td>{pm.name}</td>
                      <td>{pm.email}</td>
                      <td className="action-buttons">
                        <button
                          className="btn edit-btn"
                          onClick={() => handleEdit(pm)}
                        >
                          <MdEdit /> Edit
                        </button>
                        <button
                          className="btn delete-btn"
                          onClick={() => handleDelete(pm.id)}
                        >
                          <MdDelete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </section>
  );
};

export default ProjectManagers;
