import React from 'react';
import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { logOutOutline, personOutline, mailOutline, callOutline, pricetagOutline } from 'ionicons/icons';
import {useSessionManager} from '../../sessionManager/SessionManager'
const MyProfile: React.FC = () => {
  const navigation = useIonRouter();
  const { user, clearUserSession } = useSessionManager(); // Destructure user and clearUser from the session manager
  const Logout = () => {
    clearUserSession(); // Clear the user session
    navigation.push('/login', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/layout" />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonItem>
          <IonIcon icon={personOutline} slot="start" />
          <IonLabel>{user?.FirstName} {user?.LastName}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon icon={mailOutline} slot="start" />
          <IonLabel>{user?.Email}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon icon={callOutline} slot="start" />
          <IonLabel>{user?.Cell || 'Phone Number'}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon icon={pricetagOutline} slot="start" />
          <IonLabel>{user?.Designation}</IonLabel>
        </IonItem>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <IonButton onClick={Logout}>
            <IonIcon icon={logOutOutline} slot="start" />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;

