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
  IonCardContent,
  IonTabButton,
  IonToggle
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useManageUser } from '../../hooks/useManageUser';
// import './login.css';
import { Link } from 'react-router-dom';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { messageManager } from '../../components/MassageManager';


const LoginPage: React.FC = () => {
  const { loginInfo, setLoginInfo } = useSessionManager();
  const [username, setUsername] = useState(loginInfo?.username || '');
  const [password, setPassword] = useState(loginInfo?.password || '');
  const [rememberMe, setRememberMe] = useState(loginInfo?.rememberMe || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin]=useState(loginInfo?.autoLogin||false);
  const { handleLogin } = useManageUser();

  const isLoginDisabled = !username || !password;

  const onLoginClick = async () => {
    localStorage.removeItem('sessionExpired');
    setLoginInfo({ username, password, rememberMe,autoLogin });
    
    await handleLogin(username, password, setIsLoading, setShowAlert, setAlertMessage);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-content" scroll-y="false" ion-fixed>
        
          <IonCard className="login-card">
            <IonCardContent class="card-content">
              <div className="login-logo-container">
                <img className="login-logo" alt="LegalXGen Logo" src="https://lx2.legalxgen.com/images/logo.png" />
              </div>
              <IonLabel className='lablesLogin' >Username</IonLabel>
              <IonItem className="texts">
               
                <IonInput
                  type="text"
                  value={username}
                  onIonInput={(e) => setUsername(e.detail.value!)}
                  clearInput
                  required
                />
              </IonItem>
              <IonLabel className='lablesLogin'>Password</IonLabel>
              <IonItem className="texts">
              
                <IonInput className='inputFiled'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                  //clearInput
                  required
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                  <IonIcon slot="icon-only" icon={showPassword ? eyeOutline : eyeOffOutline}></IonIcon>
                </IonButton>
              </IonItem>
           
              <div className='remMe'>
              <IonCheckbox
                 title='Remember me'
                 color={"success"}
                 
                  checked={rememberMe}
                  onIonChange={(e) => setRememberMe(e.detail.checked)}
                />
               <span className='lablesLogin'>Remember me ?</span>
               
             
                </div>
             

              <IonButton expand="full" shape="round" onClick={onLoginClick} disabled={isLoginDisabled}>
                Login
              </IonButton>
              <div className='login-links'>
                <Link style={{color:"white",textDecoration:"none"}}to={'/forgot-password'}>
                  Forgot Password?
                </Link>
            
              </div>
             
            </IonCardContent>
          </IonCard>
    
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Invalid Credentials'}
        message={alertMessage}
        buttons={['OK']}
      />

      <IonLoading isOpen={isLoading} message={'Login.....'} />
    </IonPage>
  );
};

export default LoginPage;
