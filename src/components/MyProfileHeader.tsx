
import { IonButtons, IonButton, IonAvatar } from '@ionic/react';
import { useSessionManager } from '../sessionManager/SessionManager'; // Adjust the import path
const MyProfileHeader = () => {
  const session = useSessionManager();

  return (
    <IonButtons slot="end">
      <IonButton routerLink="/my-profile">
       
          <img className='profilHeader' src={session.user?.ProfilePicture} alt="Profile" />
       
      </IonButton>
    </IonButtons>
  );
};

export default MyProfileHeader;
