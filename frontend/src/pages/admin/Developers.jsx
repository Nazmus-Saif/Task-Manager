import React, { useState } from "react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";

const Developers = () => {
  const [developers, setDevelopers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    },
    {
      id: 2,
      name: "Bob Brown",
      email: "bob.brown@example.com",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const userRole = "admin";

  const handleEdit = (developer) => {
    setEditingDeveloper(developer);
    setFormData({
      name: developer.name,
      email: developer.email,
    });
  };

  const handleDelete = (devId) => {
    setDevelopers((prevDevs) => prevDevs.filter((dev) => dev.id !== devId));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedDeveloper = { ...editingDeveloper, ...formData };
    setDevelopers((prevDevs) =>
      prevDevs.map((dev) =>
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
      <SideBarLayout role={userRole} />

      <main className="main-content">
        <header className="top-nav">
          <h1>Developers</h1>
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

        <section className="developer-section">
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
                {developers
                  .filter((dev) =>
                    dev.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((developer) => (
                    <tr key={developer.id}>
                      <td>{developer.name}</td>
                      <td>{developer.email}</td>
                      <td className="action-buttons">
                        <button
                          className="btn edit-btn"
                          onClick={() => handleEdit(developer)}
                        >
                          <MdEdit /> Edit
                        </button>
                        <button
                          className="btn delete-btn"
                          onClick={() => handleDelete(developer.id)}
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

export default Developers;
