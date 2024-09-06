import React, { useState, useEffect } from 'react';
import { IonBackButton, IonButtons, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonRouter, IonAvatar, IonList, IonListHeader, IonToggle } from '@ionic/react';
import { logOutOutline, personOutline, mailOutline, callOutline, pricetagOutline, logInOutline } from 'ionicons/icons';
import { useSessionManager } from '../../sessionManager/SessionManager';
// import './myProfile.css';
import Footer from '../../components/layouts/Footer';
import withSessionCheck from '../../components/WithSessionCheck';

const MyProfile: React.FC = () => {
  const navigation = useIonRouter();
  const { user, clearUserSession, loginInfo, setLoginInfo } = useSessionManager();
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    if (loginInfo) {
      setAutoLogin(loginInfo.autoLogin);
    }
  }, [loginInfo?.autoLogin]);

const Logout = () => {
  // Clear user session
  clearUserSession();
  localStorage.setItem('sessionExpired', 'true'); 

  // Remove login info if not remembered
  if (!loginInfo?.rememberMe) {
    setLoginInfo(null);
    localStorage.removeItem('loginInfo');
  }

  // Navigate to login page
  navigation.push('/login', 'root', 'replace');
 // window.location.reload();
};

 const toggleAutoLogin = () => {
    if (loginInfo) {
      const updatedLoginInfo = {
        ...loginInfo,
        autoLogin: !autoLogin,
      };
      setLoginInfo(updatedLoginInfo);
      setAutoLogin(!autoLogin);
      
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref='/layout/dashboard' />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="profile-container">
          <IonAvatar className="profile-avatar">
            <img src={user?.ProfilePicture} alt="Profile" />
          </IonAvatar>
          <IonList className="profile-details">
            <IonListHeader className='listHeader'>Personal Information</IonListHeader>
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
            <IonItem lines="none">
              <IonIcon icon={logInOutline} slot="start" />
              <IonLabel>Auto Login</IonLabel>
              <IonToggle checked={autoLogin} onIonChange={toggleAutoLogin} />
            </IonItem>
          </IonList>
         
           
          <IonButton className="logout-button" slot='center' onClick={Logout}>
              <IonIcon  icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
        </div>
        
      </IonContent>
   
      <Footer />
    </IonPage>
  );
};

export default MyProfile;
