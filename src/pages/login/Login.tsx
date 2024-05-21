// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonInput,
  IonButton,
  IonPage,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonAlert,
  IonLoading
} from '@ionic/react';
import { useLogin } from '../../hooks/useLogin';
import './login.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, showAlert, setShowAlert, handleLogin } = useLogin();

  return (
    <IonPage>
      <IonContent
        className="ion-padding login-content"
      >
        <div className="login-container">
          <div className="login-logo-container">
            <img className="login-logo" alt="LegalXGen Logo" src="https://lx2.legalxgen.com/images/logo.png" />
          </div>

          <IonItem className="texts">
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
              clearInput
              required
            />
          </IonItem>

          <IonItem className="texts">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              clearInput
              required
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel>Remember me</IonLabel>
            <IonCheckbox
              slot="end"
              checked={rememberMe}
              onIonChange={(e) => setRememberMe(e.detail.checked)}
            />
          </IonItem>

          <IonButton expand="full" shape="round" onClick={() => handleLogin(username, password)}>
            Login
          </IonButton>

          <IonItem lines="none">
            <IonLabel slot="end" color="primary">
              Forgot Password?
            </IonLabel>
            <IonLabel slot="start" color="primary">
              Create new Account
            </IonLabel>
          </IonItem>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Invalid Credentials'}
        message={'Please enter valid username and password.'}
        buttons={['OK']}
      />

      <IonLoading isOpen={isLoading} message={'Please wait...'} />
    </IonPage>
  );
};

export default LoginPage;
