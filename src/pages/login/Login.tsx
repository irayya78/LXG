import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonInput,
  IonButton,
  IonPage,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonAlert,
  IonLoading,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useManageUser } from '../../hooks/useManageUser';
import './login.css';
import { Link } from 'react-router-dom';
import { useSessionManager } from '../../sessionManager/SessionManager';


const LoginPage: React.FC = () => {
  const { loginInfo, setLoginInfo } = useSessionManager();
  const [username, setUsername] = useState(loginInfo?.username || '');
  const [password, setPassword] = useState(loginInfo?.password || '');
  const [rememberMe, setRememberMe] = useState(loginInfo?.rememberMe || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 const [darkMode]=useState(false);
  const { handleLogin } = useManageUser();

  const isLoginDisabled = !username || !password;

  const onLoginClick = async () => {
    if (rememberMe) {
      setLoginInfo({ username, password, rememberMe,darkMode });
    } else {
      setLoginInfo(null);
    }

    await handleLogin(username, password, setIsLoading, setShowAlert, setAlertMessage);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-content" scroll-y="false" ion-fixed>
        <div className="login-background">
          <IonCard className="login-card">
            <IonCardContent>
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  clearInput
                  required
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                  <IonIcon slot="icon-only" icon={showPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                </IonButton>
              </IonItem>

              <IonItem lines="none">
                <IonLabel>Remember me</IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={rememberMe}
                  onIonChange={(e) => setRememberMe(e.detail.checked)}
                />
              </IonItem>

              <IonButton expand="full" shape="round" onClick={onLoginClick} disabled={isLoginDisabled}>
                Login
              </IonButton>
              <div className='login-links'>
              <IonItem lines="none" className="login-links">
                <Link slot="start" color="primary" to={'/forgot-password'}>
                  Forgot Password?
                </Link>
              </IonItem>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Invalid Credentials'}
        message={alertMessage}
        buttons={['OK']}
      />

      <IonLoading isOpen={isLoading} message={'Please wait...'} />
    </IonPage>
  );
};

export default LoginPage;
