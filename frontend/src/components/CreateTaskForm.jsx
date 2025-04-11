import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { authController } from "../controllers/authController.js";

const CreateTaskForm = ({ closeForm }) => {
  const { addTask, isTaskAdded, getUsers, users } = authController();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState(1);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();

    const priorityMap = {
      1: "low",
      2: "medium",
      3: "high",
    };

    const statusMap = {
      1: "pending",
      2: "in-progress",
      3: "completed",
    };

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      assigned_to: assignedTo,
      priority: priorityMap[priority],
      status: statusMap[status],
      deadline,
    };

    await addTask(taskData);

    setTaskTitle("");
    setTaskDescription("");
    setAssignedTo("");
    setPriority(1);
    setStatus(1);
    setDeadline("");
    closeForm();
  };

  return (
    <form onSubmit={handleTaskFormSubmit}>
      <div className="form-content">
        <h2>Create Task</h2>
        <div className="form-input-wrapper">
          <input
            type="text"
            placeholder="Task Title"
            className="form-input-field"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>
        <div className="form-input-wrapper">
          <textarea
            placeholder="Description"
            className="form-input-field"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-input-wrapper">
          <select
            className="form-input-field"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.role}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input-wrapper">
          <select
            className="form-input-field"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-input-wrapper">
          <input
            type="date"
            className="form-input-field"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button type="submit" className="form-button">
          {isTaskAdded ? <FaSpinner className="loading-icon" /> : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
