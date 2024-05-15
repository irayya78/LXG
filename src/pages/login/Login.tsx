import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonPage, IonItem, IonLabel, IonCheckbox, IonText, IonAlert, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import './login.css';



const LoginPage: React.FC = () => { // Accept onLogin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add state for loading indicator
  const history = useHistory();
  const backGroundImageURL ='https://legalxgen.blob.core.windows.net/customerlogos/lxdoc8dcec87c6fc640569fbd73762acbe7ba.jpeg';

  const handleUsernameChange = (e: CustomEvent) => {
    setUsername(e.detail.value as string);
  }; 

  const handlePasswordChange = (e: CustomEvent) => {
    setPassword(e.detail.value as string);
  };

  const handleLogin = () => {
  history.push('/layout')
   
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-content" style={{ backgroundImage: `url(${backGroundImageURL})` }}>
        {/* Background Image */}
        <div className="login-container">
          {/* Logo */}
          <div className="login-logo-container" slot="center">
            <img className="login-logo" alt="LegalXGen Logo" src="https://lx2.legalxgen.com/images/logo.png" />
          </div>
          
          {/* Username Input */}
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={handleUsernameChange}
              clearInput
              required
            />
          </IonItem>
          
          {/* Password Input */}
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={handlePasswordChange}
              clearInput
              required
            />
          </IonItem> 
          
          {/* Remember Me Checkbox */}
          <IonItem lines="none">
            <IonLabel color={''}>Remember me</IonLabel>
            <IonCheckbox slot='end' 
              checked={rememberMe} 
              onIonChange={e => setRememberMe(e.detail.checked)} 
            />
          </IonItem>

          {/* Login Button */}
          <IonButton expand="full" shape='round' onClick={handleLogin} >Login</IonButton>
          
          {/* Forgot Password Link */}
          <IonItem lines="none">
             <IonLabel slot="end" color="primary">Forgot Password?</IonLabel>
             <IonLabel slot="start" color="primary">Create new Account</IonLabel>
          </IonItem>
        </div>
      </IonContent>
      
      {/* Alert for Invalid Credentials */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Invalid Credentials'}
        message={'Please enter valid username and password.'}
        buttons={['OK']}
      />

      {/* Loading Indicator */}
      <IonLoading
        isOpen={isLoading}
        message={'Please wait...'}
      />
    </IonPage>
  );
};

export default LoginPage;
