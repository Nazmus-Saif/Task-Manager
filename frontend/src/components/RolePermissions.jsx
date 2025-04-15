import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const permissionGroups = {
  Role: ["Create Role", "Get Role", "Update Role", "Delete Role"],
  User: ["Create User", "Get User", "Update User", "Delete User"],
  Task: ["Create Task", "Get Task", "Update Task", "Delete Task"],
};

const PermissionForm = () => {
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  return (
    <form className="form-content">
      <h2>Create Role</h2>
      <div className="form-input-wrapper">
        <input type="text" placeholder="Name" className="form-input-field" />
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
      <button type="submit" className="form-button">
        {false ? <FaSpinner className="loading-icon" /> : "Submit"}
      </button>
    </form>
  );
};

export default PermissionForm;
