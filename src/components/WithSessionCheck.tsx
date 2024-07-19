import React, { useEffect, useState } from 'react';
import { useIonRouter, IonAlert } from '@ionic/react';
import {useSessionManager, isSessionExpired } from '../sessionManager/SessionManager';


const withSessionCheck = (WrappedComponent: React.ComponentType) => {
  const SessionCheck: React.FC = (props) => {
    const navigation = useIonRouter();
    const { user } = useSessionManager();
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
      if (!user || isSessionExpired()) {
        setShowAlert(true);
      }
    }, [user, navigation]);

    const handleAlertDismiss = () => {
      localStorage.removeItem('sessionExpired');
      navigation.push('/login', 'root', 'pop');
    };

    return (
      <>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertDismiss}
          header={'Session Expired'}
          message={'Please log in again.'}
          buttons={['OK']}
        />
        <WrappedComponent {...props} />
      </>
    );
  };

  return SessionCheck;
};

export default withSessionCheck;
