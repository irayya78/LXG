import React, { useState, useEffect } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonAlert, IonLoading } from '@ionic/react';
import { chevronForwardOutline, mailOpen } from 'ionicons/icons';
import { useManageUser } from '../../hooks/useManageUser';
// import './forgotPassword.css';
import { UserModel } from '../../types/types';
import { useHistory } from 'react-router-dom';
import LoginLogo from './LoginLogo';

const ForgotPasswordPage: React.FC = () => {

  const { isValidUser } = useManageUser();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false); // State for the loader
  const history = useHistory();

  useEffect(() => {
    // Basic email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(email));
  }, [email]);

  const validateEmail = async () => {
    try {
      setShowLoader(true); // Show loader when validation starts
      const user: UserModel = await isValidUser(email);
      console.log("user", user);
      if (user.UserId === 0) {
        setShowAlert(true); // Show alert if user is not found
      } else {
        history.push('/reset-password', { email: user.Email, userId: user.UserId });
      }
    } catch (error) {
      console.error('Error validating email:', error);
    } finally {
      setShowLoader(false); // Hide loader when validation ends (success or error)
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton/>
          </IonButtons>
          <IonTitle>Forget Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="loginlogo">
        <LoginLogo/>
        </div>
        <div className="inputarea">
      <IonText className="reset-pwd-text">Enter your email we'll help you to reset your password.</IonText>
      <div className="input-with-icon">
        <IonInput
          value={email}
          placeholder="Email"
          onIonInput={(e: CustomEvent) => setEmail(e.detail.value)}
          type="email"
          style={{ borderBottom: "2px solid #ccc", padding: "10px 5px", transition: "border-color 0.3s" }}
        />
        <IonIcon icon={mailOpen} />
      </div>
    </div>
        <IonButton shape='round'  expand="full" onClick={validateEmail} disabled={!isEmailValid}>
          Next <IonIcon icon={chevronForwardOutline} slot="end" />
        </IonButton>
        {/* Loader */}
        <IonLoading
          isOpen={showLoader}
       
        /> 
        {/* Alert for user not found */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'User Not Found'}
          message={'No user found with the provided email address.'}
          buttons={['OK']} 
        />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
