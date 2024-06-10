import React, { useState, useEffect, useContext } from 'react';
import './studioUsersManager.scss';
import { v4 as uuid } from 'uuid';
import FormInput from '../FormInput';
import { UserContext } from '../../../UserContext';
import customFetch from '../../../fetchMethod';
import StudioUserInput from './studioUserInput/StudioUserInput';

function StudioUsersManager() {
  const { activeUser, handleSetActiveUser } = useContext(UserContext);
  const [allStudioUsers, setAllStudioUsers] = useState();

  useEffect(() => {
    console.log('LOGGING ALL STUDIO USERS:');
    console.log(allStudioUsers);
  }, [allStudioUsers]);

  // Handles input change
  function onChange(event) {
    const { name, value } = event.target;
    const customId = event.target.getAttribute('data-custom-id');
    const userIndex = allStudioUsers.findIndex((user) => user.custom_id === customId);

    if (userIndex === -1) {
      console.error(`User with custom_id ${customId} not found`);
      return;
    }

    const updatedUser = {
      ...allStudioUsers[userIndex],
      [name]: value,
    };

    const updatedUsers = [
      ...allStudioUsers.slice(0, userIndex),
      updatedUser,
      ...allStudioUsers.slice(userIndex + 1),
    ];
    setAllStudioUsers(updatedUsers);
  }
  // Handles delete button
  function removeUser(event) {
    // Get Custom Id from element
    const customId = event.target.getAttribute('data-custom-id');
    // Find index in allStudioUsers arr
    const userIndex = allStudioUsers.findIndex((user) => user.custom_id === customId);

    if (userIndex === -1) {
      console.error(`User with custom_id ${customId} not found`);
      return;
    }

    // Remove that index from array
    const updatedUsers = [
      ...allStudioUsers.slice(0, userIndex),
      ...allStudioUsers.slice(userIndex + 1),
    ];
    // Update users
    setAllStudioUsers(updatedUsers);
  }
  // Handles checkbox onChange
  function handleCheckboxChange(event, checkState) {
    // Get Custom Id from element
    const customId = event.target.getAttribute('data-custom-id');
    const permission = event.target.getAttribute('data-permission');
    const category = event.target.getAttribute('data-category');

    // Find index in allStudioUsers arr
    const userIndex = allStudioUsers.findIndex((user) => user.custom_id === customId);

    if (userIndex === -1) {
      console.error(`User with custom_id ${customId} not found`);
    }

    const updatedUser = {
      ...allStudioUsers[userIndex],
      permissions: {
        ...allStudioUsers[userIndex].permissions,
        [category]: {
          ...allStudioUsers[userIndex].permissions[category],
          [permission]: checkState,
        },
      },
    };

    const updatedUsers = [
      ...allStudioUsers.slice(0, userIndex),
      updatedUser,
      ...allStudioUsers.slice(userIndex + 1),
    ];
    setAllStudioUsers(updatedUsers);
  }

  useEffect(() => {
    if (activeUser !== undefined) {
      const getAllStudioUsers = async () => {
        const allStudioUsers = await customFetch('/get-all-studio-users', 'GET');
        if (allStudioUsers && allStudioUsers.studio && allStudioUsers.studio.users && allStudioUsers.studio.users.length !== 0) {
          setAllStudioUsers(allStudioUsers.studio.users);
        } else {
          setAllStudioUsers([defaultUserData]);
        }
      };
      getAllStudioUsers();
    }
  }, [activeUser]);

  let usernameUUID = uuid();
  let passwordUUID = uuid();
  let customIdUUID = uuid();
  // Default studio user data
  let defaultUserData = {
    username: usernameUUID,
    password: passwordUUID,
    custom_id: customIdUUID,
    role: 'studio_user',
    session_id: 'this user hasnt logged in yet',
    created_at: Date.now(),
    parent_user_id: activeUser._id,
    avatar: {
      publicId: 'mc-schematic-manager-images/xbcldkvm8tpj3dri4jgg',
      url: 'https://res.cloudinary.com/dm7ymtpki/image/upload/v1717774667/mc-schematic-manager-images/xbcldkvm8tpj3dri4jgg.jpg',
    },
    permissions: {
      schematic: {
        get_schematic: true,
        edit_schematic: true,
        download_schematic: true,
        remove_schematic: false,
      },
      collection: {
        add_collection: true,
        remove_collection: false,
        edit_collection: true,
      },
      profile: {
        view_profile: true,
        edit_profile: true,
        studio_user_manager: false,
        view_user_stats: false,
      },
    },
  };

  function addNewStudioUser() {
    usernameUUID = uuid();
    passwordUUID = uuid();
    customIdUUID = uuid();
    const newUser = { ...defaultUserData };
    setAllStudioUsers((prev) => [...prev, defaultUserData]);
  }

  // if (activeUser !== undefined) {
  //   const getAllStudioUsers = async () => {
  //     const allStudioUsers = await customFetch('/get-all-studio-users', 'GET');
  //     if (allStudioUsers && allStudioUsers.studio && allStudioUsers.studio.users && allStudioUsers.studio.users.length !== 0) {
  //       setAllStudioUsers(allStudioUsers.studio.users);
  //     } else {
  //       setAllStudioUsers([defaultUserData]);
  //     }
  //   };
  //   getAllStudioUsers();
  // }

  async function updateUsers() {
    const allStudioUsersJSON = JSON.stringify(allStudioUsers);

    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await customFetch('/update-studio-users', 'POST', allStudioUsersJSON, headers);
  }

  return (
    <div className="studio-users-wrapper">
      <div className="studio-users-manager-container">
        <div className="studio-users-container">
          {activeUser && allStudioUsers && allStudioUsers.length !== 0
            ? (
              <StudioUserInput
                users={allStudioUsers}
                parentId={activeUser._id}
                updateUserInput={(e) => onChange(e)}
                removeUser={(e) => removeUser(e)}
                handleCheckboxChange={handleCheckboxChange}
              />
            )
            : (
              <>

              </>
            )}
        </div>

      </div>
      <div className="button-container">
        <button type="button" onClick={addNewStudioUser}>Add New</button>
        <button type="button" onClick={updateUsers}>Save All</button>
      </div>
    </div>
  );
}

export default StudioUsersManager;
