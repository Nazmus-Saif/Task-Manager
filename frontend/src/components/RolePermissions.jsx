import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { authController } from "../controllers/authController.js";

const permissionGroups = {
  Role: ["Create Role", "Get Roles", "Update Role", "Delete Role"],
  User: ["Create User", "Get Users", "Update User", "Delete User"],
  Task: ["Create Task", "Get Tasks", "Update Task", "Delete Task"],
};

const RolePermissionForm = () => {
  const [roleName, setRoleName] = useState("");
  const { createRole, setIsCreatingRole } = authController();
  const [selectAll, setSelectAll] = useState(false);
  const [checkedPermissions, setCheckedPermissions] = useState([]);

  const handleCheckboxChange = (permission) => {
    if (checkedPermissions.includes(permission)) {
      setCheckedPermissions(checkedPermissions.filter((p) => p !== permission));
    } else {
      setCheckedPermissions([...checkedPermissions, permission]);
    }
  };

  const handleGroupSelectAll = (group) => {
    const groupPermissions = permissionGroups[group];
    const isAllSelected = groupPermissions.every((perm) =>
      checkedPermissions.includes(perm)
    );

    if (isAllSelected) {
      setCheckedPermissions(
        checkedPermissions.filter((perm) => !groupPermissions.includes(perm))
      );
    } else {
      setCheckedPermissions([
        ...new Set([...checkedPermissions, ...groupPermissions]),
      ]);
    }
  };

  const handleGlobalSelectAll = () => {
    const allPermissions = Object.values(permissionGroups).flat();
    if (selectAll) {
      setCheckedPermissions([]);
    } else {
      setCheckedPermissions([...allPermissions]);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      return toast.error("Role name is required!");
    }

    const allPermissions = Object.values(permissionGroups).flat();
    const permissionObj = {};

    allPermissions.forEach((perm) => {
      const transformedPermission = perm.toLowerCase().replace(/ /g, "_");
      permissionObj[transformedPermission] = checkedPermissions.includes(perm);
    });

    const payload = {
      name: roleName,
      permissions: permissionObj,
    };

    await createRole(payload);
    setRoleName("");
    setCheckedPermissions([]);
    setSelectAll(false);
  };

  return (
    <form className="form-content" onSubmit={handleSubmit}>
      <h2>Create Role</h2>
      <div className="form-input-wrapper">
        <input
          type="text"
          placeholder="Name"
          className="form-input-field"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>
      <p className="permissions-label">Set Permissions</p>
      <label className="select-all-label">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleGlobalSelectAll}
        />
        Select all
      </label>
      <div className="group-permissions-container">
        {Object.entries(permissionGroups).map(([groupName, permissions]) => {
          const allGroupChecked = permissions.every((perm) =>
            checkedPermissions.includes(perm)
          );

          return (
            <div key={groupName} className="permission-group">
              <label className="group-select-label">
                <input
                  type="checkbox"
                  checked={allGroupChecked}
                  onChange={() => handleGroupSelectAll(groupName)}
                />
                {groupName} all
              </label>

              {permissions.map((permission) => (
                <label key={permission} className="permission-item">
                  <input
                    type="checkbox"
                    checked={checkedPermissions.includes(permission)}
                    onChange={() => handleCheckboxChange(permission)}
                  />
                  {permission}
                </label>
              ))}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className="form-button"
        disabled={setIsCreatingRole}
      >
        {setIsCreatingRole ? (
          <FaSpinner className="loading-icon animate-spin" />
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default RolePermissionForm;
