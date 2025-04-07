import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authenticationController } from "../../controllers/authenticationController.js";

const DevelopersManaged = () => {
  const { authorizedUser } = authenticationController();
  const userPermissions = { canEdit: true, canDelete: false };
  const showActionsColumn =
    userPermissions.canEdit || userPermissions.canDelete;

  const [developers, setDevelopers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      task: "UI Component Development",
      deadline: "2025-04-10",
    },
    {
      id: 2,
      name: "Emily Smith",
      email: "emilysmith@example.com",
      task: "API Integration",
      deadline: "2025-05-05",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michaelbrown@example.com",
      task: "Test Automation",
      deadline: "2025-05-20",
    },
  ]);

  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    task: "",
    deadline: "",
  });

  const handleEdit = (developer) => {
    setEditingDeveloper(developer);
    setFormData({
      name: developer.name,
      email: developer.email,
      task: developer.task,
      deadline: developer.deadline,
    });
  };

  const handleDelete = (developerId) => {
    setDevelopers((prevDevelopers) =>
      prevDevelopers.filter((dev) => dev.id !== developerId)
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedDeveloper = { ...editingDeveloper, ...formData };
    setDevelopers((prevDevelopers) =>
      prevDevelopers.map((dev) =>
        dev.id === updatedDeveloper.id ? updatedDeveloper : dev
      )
    );
    setEditingDeveloper(null);
  };

  const handleCancel = () => {
    setEditingDeveloper(null);
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.user_data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Developers Managed</h1>
        </header>

        <section className="task-section">
          {editingDeveloper ? (
            <div className="edit-form-container">
              <h2>Edit Developer</h2>
              <form onSubmit={handleFormSubmit} className="edit-form">
                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
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
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Assigned Task:</label>
                  <input
                    type="text"
                    value={formData.task}
                    onChange={(e) =>
                      setFormData({ ...formData, task: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Deadline:</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    required
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
                  <th>Assigned Task</th>
                  <th>Deadline</th>
                  {showActionsColumn && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {developers.map((developer) => (
                  <tr key={developer.id}>
                    <td>{developer.name}</td>
                    <td>{developer.email}</td>
                    <td>{developer.task}</td>
                    <td>{developer.deadline}</td>
                    {showActionsColumn && (
                      <td className="action-buttons">
                        {userPermissions.canEdit && (
                          <button
                            className="btn edit-btn"
                            onClick={() => handleEdit(developer)}
                          >
                            <MdEdit /> Edit
                          </button>
                        )}
                        {userPermissions.canDelete && (
                          <button
                            className="btn delete-btn"
                            onClick={() => handleDelete(developer.id)}
                          >
                            <MdDelete /> Delete
                          </button>
                        )}
                      </td>
                    )}
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

export default DevelopersManaged;
