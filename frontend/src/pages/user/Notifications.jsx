import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authController } from "../../controllers/authController.js";

const Notifications = () => {
  const {
    authorizedUser,
    notifications,
    getNotifications,
    isGettingNotifications,
  } = authController();

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      getNotifications(authorizedUser.data.id);
    }
  }, [authorizedUser, getNotifications]);

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Notifications</h1>
        </header>

        <section className="notification-section">
          {isGettingNotifications ? (
            <div className="task-loading-state">
              <Loader className="task-loading-spinner" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="notifications">No new notifications</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <small>
                      {new Date(notification.created_at).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </section>
  );
};

export default Notifications;
