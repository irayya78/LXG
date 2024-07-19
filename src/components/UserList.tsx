import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';
import { person } from 'ionicons/icons';
import { useSessionManager } from '../sessionManager/SessionManager';
import { messageManager } from './MassageManager';

interface UserListProps {
  users: UserModel[];
  onUsersSelect: (selectedUsers: UserModel[]) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUsersSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const session=useSessionManager();
  const {showAlertMessage}=messageManager();

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

  const filteredUsers = users.filter((user) =>
    user.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
   
      {filteredUsers.length > 0 && (
        <div className="user-list">
          {filteredUsers.map((user) => (
            <IonItem key={user.UserId}>
              <IonCheckbox
                slot="start"
                checked={selectedUsers.includes(user)}
                onIonChange={() => handleCheckboxChange(user)}
                disabled={session.user?.UserId===user.UserId}
              />
              <IonLabel><IonIcon icon={person}/>&nbsp;{user.FullName}</IonLabel>
            </IonItem>
          ))}
          <div style={{ textAlign: 'center' }}>
          
          </div>
        </div>
      )}
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <h5>Selected Users</h5>
          {selectedUsers.map((user) => (
            <IonItem key={user.UserId}>
              <IonLabel><IonIcon icon={person}/>&nbsp;{user.FullName}</IonLabel>
            </IonItem>
          ))}
            <IonButton expand='full' slot='center' size='small' shape='round' onClick={handleSelectUsers} disabled={selectedUsers.length === 0}>Save</IonButton>
        </div>
        
      )}
    </>
  );
};

export default UserList;
