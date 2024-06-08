import React, { useState } from 'react';
import Checkbox from '../../checkbox/Checkbox';
import './userPermissions.scss';

function UserPermissions({ user, updateUserInput }) {
  const [permissionsState, setPermissionsState] = useState('closed');
  const [arrowState, setArrowState] = useState('rotateX(0deg)');

  function togglePermissionsView() {
    setPermissionsState((prevState) => (prevState === 'closed' ? 'open' : 'closed'));
    setArrowState((prevState) => (prevState === 'rotateX(0deg)' ? 'rotateX(180deg)' : 'rotateX(0deg)'));
  }
  function placeholderOnChange() {

  }

  return (
    <div className="permissions-section-container">
      <button
        type="button"
        onClick={togglePermissionsView}
        className="toggle-preview-btn"
      >
        <img
          className="toggle-preview-icon"
          style={{ transform: `${arrowState}` }}
          src="/icons/angle-down-solid.svg"
          alt="Toggle preview"
        />
        <h3>Permissions:</h3>
      </button>
      {permissionsState === 'open' && (
      <section className="permissions-section">
        {/* label, checked, customId, name, */}
        <div className="permissions-schematics-container">
          <h3>Schematics </h3>
          <Checkbox
            onChange={placeholderOnChange}
            label="get_schematic:"
            checked={user.permissions.schematic.get_schematic}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="edit_schematic:"
            checked={user.permissions.schematic.edit_schematic}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="download_schematic:"
            checked={user.permissions.schematic.download_schematic}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="remove_schematic:"
            checked={user.permissions.schematic.remove_schematic}
          />
        </div>
        <div className="permissions-collections-container">
          <h3>Collections</h3>
          <Checkbox
            onChange={placeholderOnChange}
            label="add_collection:"
            checked={user.permissions.collection.add_collection}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="remove_collection:"
            checked={user.permissions.collection.remove_collection}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="edit_collection:"
            checked={user.permissions.collection.edit_collection}
          />
        </div>
        <div className="permissions-profile-container">
          <h3>Profile</h3>
          <Checkbox
            onChange={placeholderOnChange}
            label="view_profile:"
            checked={user.permissions.profile.view_profile}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="edit_profile:"
            checked={user.permissions.profile.edit_profile}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="studio_user_manager:"
            checked={user.permissions.profile.studio_user_manager}
          />
          <Checkbox
            onChange={placeholderOnChange}
            label="view_user_stats:"
            checked={user.permissions.profile.view_user_stats}
          />
        </div>
      </section>
      )}
    </div>
  );
}

export default UserPermissions;
