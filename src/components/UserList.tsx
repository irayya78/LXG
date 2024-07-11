import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';
import { person } from 'ionicons/icons';

interface UserListProps {
  users: UserModel[];
  onUsersSelect: (selectedUsers: UserModel[]) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUsersSelect }) => {
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);

  const handleCheckboxChange = (user: UserModel) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user]
    );
  };

  const handleSelectUsers = () => {
    onUsersSelect(selectedUsers);
  };

  return (
    <>
      {users.length > 0 && (
        <div className="user-list">
          {users.map((user) => (
            <IonItem key={user.UserId}>
              <IonCheckbox
                slot="start"
                checked={selectedUsers.includes(user)}
                onIonChange={() => handleCheckboxChange(user)}
              />
              <IonLabel><IonIcon icon={person}/>&nbsp;{user.FullName}</IonLabel>
            </IonItem>
          ))}
          <div style={{ textAlign: 'center' }}>
            <IonButton size='small' shape='round' onClick={handleSelectUsers}  disabled={selectedUsers.length === 0}>Save</IonButton>
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
