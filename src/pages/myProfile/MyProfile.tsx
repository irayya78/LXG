import React, { useState } from 'react';
import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonRouter, IonAvatar, IonCard, IonCardContent, IonToggle, IonList, IonListHeader } from '@ionic/react';
import { logOutOutline, personOutline, mailOutline, callOutline, pricetagOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { useSessionManager } from '../../sessionManager/SessionManager';
import './myProfile.css'
const MyProfile: React.FC = () => {
  const navigation = useIonRouter();
  const { user, clearUserSession } = useSessionManager();
  const [darkMode, setDarkMode] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);

  const Logout = () => {
    clearUserSession();
    navigation.push('/login', 'root', 'replace');
    window.location.reload();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', darkMode);

  };

  const toggleRememberLogin = () => {
    setRememberLogin(!rememberLogin);
    // Implement any remember login logic here
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
      <IonContent class={`ion-padding ${darkMode ? 'dark-theme' : ''}`}>
        <div className="profile-container">
          <IonAvatar  className="profile-avatar">
            <img src={user?.ProfilePicture} alt="Profile" />    
          </IonAvatar>
       
          <IonList className="profile-details">
            <IonListHeader>Personal Information</IonListHeader>
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
          </IonList>
          <IonCard className="profile-card">
            <IonCardContent>
              <IonItem lines="none">
                <IonIcon icon={darkMode ? moonOutline : sunnyOutline} slot="start" />
                <IonLabel>Dark Mode</IonLabel>
                <IonToggle checked={darkMode} onIonChange={toggleDarkMode} />
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>Remember Login</IonLabel>
                <IonToggle checked={rememberLogin} onIonChange={toggleRememberLogin} />
              </IonItem>
            </IonCardContent>
          </IonCard>
          <div className="logout-button">
            <IonButton expand="block" onClick={Logout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyProfile;
