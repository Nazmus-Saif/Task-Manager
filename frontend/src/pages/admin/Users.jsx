import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdNotificationsActive,
} from "react-icons/md";
import AdminSideBar from "../../components/AdminSideBar.jsx";
import { authController } from "../../controllers/authController.js";

const Users = () => {
  const {
    getUsers,
    users,
    isUserFetching,
    updateUser,
    deleteUser,
    isUserUpdating,
    isUserDeleting,
    sendAlert,
  } = authController();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [alertingUser, setAlertingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [alertFormData, setAlertFormData] = useState({
    message: "",
    deliveryMethod: "in-app",
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleAlert = (user) => {
    setAlertingUser(user);
    setAlertFormData({
      message: "",
      deliveryMethod: "in-app",
    });
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    authController.setState((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    await updateUser(editingUser.id, updatedUser);
    getUsers();
    setEditingUser(null);
  };

  const handleAlertFormSubmit = async (e) => {
    e.preventDefault();
    const alertData = {
      message: alertFormData.message,
      delivery_type: alertFormData.deliveryMethod,
    };

    await sendAlert(alertingUser.id, alertData);

    setAlertingUser(null);
    setAlertFormData({
      message: "",
      deliveryMethod: "in-app",
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setAlertingUser(null);
  };

  return (
    <section className="dashboard-container">
      <AdminSideBar />

      {isUserFetching ? (
        <div className="user-loading-state">
          <Loader className="user-loading-spinner" />
        </div>
      ) : (
        <main className="main-content">
          <header className="top-nav">
            <h1>Users</h1>
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
            {editingUser ? (
              <div className="edit-form-container">
                <h2>Edit User</h2>
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
                  <div className="input-group">
                    <label>Role:</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="save-btn"
                      disabled={isUserUpdating}
                    >
                      {isUserUpdating ? "Saving..." : "Save Changes"}
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
            ) : alertingUser ? (
              <div className="edit-form-container">
                <h2>Send Alert to {alertingUser.name}</h2>
                <form onSubmit={handleAlertFormSubmit} className="edit-form">
                  <div className="input-group">
                    <label>Message:</label>
                    <textarea
                      rows="4"
                      value={alertFormData.message}
                      onChange={(e) =>
                        setAlertFormData({
                          ...alertFormData,
                          message: e.target.value,
                        })
                      }
                      placeholder="Type your alert message here..."
                    />
                  </div>
                  <div className="input-group">
                    <label>Delivery Method:</label>
                    <select
                      value={alertFormData.deliveryMethod}
                      onChange={(e) =>
                        setAlertFormData({
                          ...alertFormData,
                          deliveryMethod: e.target.value,
                        })
                      }
                    >
                      <option value="in-app">In-App Only</option>
                      <option value="email">Email Only</option>
                      <option value="both">Both In-App and Email</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Send Alert
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
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td className="action-buttons">
                          <button
                            className="btn edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            <MdEdit /> Edit
                          </button>
                          <button
                            className="btn delete-btn"
                            onClick={() => handleDelete(user.id)}
                            disabled={isUserDeleting}
                          >
                            {isUserDeleting ? (
                              "Deleting..."
                            ) : (
                              <>
                                <MdDelete /> Delete
                              </>
                            )}
                          </button>
                          <button
                            className="btn alert-btn"
                            onClick={() => handleAlert(user)}
                          >
                            <MdNotificationsActive /> Alert
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      )}
    </section>
  );
};

export default Users;
