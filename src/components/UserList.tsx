import React, { useEffect, useState } from 'react';
import { IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';
import { checkmark, person, pricetag, pricetags } from 'ionicons/icons';
import { useSessionManager } from '../sessionManager/SessionManager';

interface UserListProps {
  users: UserModel[];
  onUsersSelect: (newUsers: UserModel[]) => void; // Will send only new users
  existingTaggedUsers: { associateName: string; userId: number; firstName: string; email: string }[];
}

const UserList: React.FC<UserListProps> = ({ users, onUsersSelect, existingTaggedUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [newlyTaggedUsers, setNewlyTaggedUsers] = useState<UserModel[]>([]); // Track new users only
  const session = useSessionManager();

  // Map existingTaggedUsers to match UserModel structure and initialize selectedUsers with them
  useEffect(() => {
    const mappedTaggedUsers = existingTaggedUsers.map(taggedUser => ({
      FullName: taggedUser.associateName,
      UserId: taggedUser.userId,
      LastName: '',
      Password: '',
      EmailOTP: '',
      Email: taggedUser.email,
      FirstName: taggedUser.firstName,
    }));

    setSelectedUsers(mappedTaggedUsers); // Pre-select existing tagged users
  }, [existingTaggedUsers]);

  const handleCheckboxChange = (user: UserModel) => {
    // Check if the user is already in the list of existing tagged users
    const isAlreadyTagged = selectedUsers.some((u) => u.UserId === user.UserId);

    if (isAlreadyTagged) {
      // Existing tagged users can't be toggled, return early
      return;
    }

    // Toggle only new users
    setNewlyTaggedUsers((prevNewUsers) =>
      prevNewUsers.some((u) => u.UserId === user.UserId)
        ? prevNewUsers.filter((u) => u.UserId !== user.UserId) // Remove if already tagged
        : [...prevNewUsers, user] // Add if not tagged
    );
  };

  // When new users are tagged, send only the newly added users to the parent component
  useEffect(() => {
    onUsersSelect(newlyTaggedUsers); // Send new users
  }, [newlyTaggedUsers, onUsersSelect]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {filteredUsers.length > 0 && (
        <div className="user-list">
          {filteredUsers.map((user) => {
            const isAlreadyTagged = selectedUsers.some((u) => u.UserId === user.UserId);
            return (
              <IonItem
                key={user.UserId}
                onClick={() => handleCheckboxChange(user)}
                button
                disabled={session.user?.UserId === user.UserId || isAlreadyTagged} // Disable for current user and existing tagged users
                detail={false}
              >
                <IonCheckbox
                  slot="start"
                  checked={
                    selectedUsers.some((u) => u.UserId === user.UserId) || 
                    newlyTaggedUsers.some((u) => u.UserId === user.UserId)
                  } // Check if user is already tagged or newly tagged
                  disabled={session.user?.UserId === user.UserId || isAlreadyTagged} // Disable checkbox for existing tagged users
                />
                <IonLabel>
                  <IonIcon icon={person} />
                  &nbsp;{user.FullName}
                  {isAlreadyTagged && (
                    <span style={{ color: 'green', marginLeft: '8px' }}>(TAGGED)</span>
                  )}
                </IonLabel>
              </IonItem>
            );
          })}
        </div>
      )}
      {/* Show existing tagged users */}
      {selectedUsers.length > 0 && (
        <div className="tagged-users-list">
          <IonItem>
          <IonLabel className='matter-Code-font'><IonIcon className='icon-align' color='primary' icon={pricetags}></IonIcon>&nbsp; Tagged Users</IonLabel>
          </IonItem>
          
          {selectedUsers.map((user, index) => (
            <IonItem key={index}>
              
              <IonLabel className='disabled'>
                <IonIcon icon={person} />
                &nbsp;{user.FullName} 
              </IonLabel>
            </IonItem>
          ))}
        </div>
      )}

      {newlyTaggedUsers.length > 0 && (
        <div className="newly-tagged-users">
          {newlyTaggedUsers.map((user, index) => (
            <IonItem key={index}>
              <IonLabel>
                <IonIcon icon={person} />
                &nbsp;{user.FullName}
              </IonLabel>
            </IonItem>
          ))}
        </div>
      )}
    </>
  );
};

export default UserList;
