import React, { useState } from 'react';
import './studioUserInput.scss';
import { v4 as uuid } from 'uuid';
import FormInput from '../../FormInput';
import Checkbox from '../../checkbox/Checkbox';
import UserPermissions from '../userPermissions/UserPermissions';
import UserInputDisplay from './UserInputDisplay';

function StudioUserInput({
  users, parentId, updateUserInput, removeUser, handleCheckboxChange,
}) {
  return (
    <div>
      {users && users.map((user, index) => (
        <UserInputDisplay
          key={user.custom_id}
          user={user}
          index={index}
          updateUserInput={updateUserInput}
          removeUser={removeUser}
          handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
}

export default StudioUserInput;
