import React, { useEffect, useState } from 'react';
import { IonAlert, IonApp, IonLoading, IonRouterOutlet, setupIonicReact, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/login/Login';
import Layout from './components/layouts/Layout';
import MyProfile from './pages/myProfile/MyProfile';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js/auto'; // Import from 'chart.js/auto' for Chart.js version 3
import ForgotPasswordPage from './pages/login/ForgotPassword';
import ResetPassword from './pages/login/ResetPassword';
import { useSessionManager } from './sessionManager/SessionManager';
import { useManageUser } from './hooks/useManageUser';
import { messageManager } from './components/MassageManager';

Chart.register(...registerables);


setupIonicReact();
const App: React.FC = () => {
  const {checkAutoLogin} =useManageUser();
  const {user,loginInfo}=useSessionManager();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const [autoLoginSuccess, setAutoLoginSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}, []);
 
  useEffect(() => {
    const performAutoLogin = async () => {   
      localStorage.removeItem('sessionExpired');
      if (loginInfo?.autoLogin && loginInfo.username && loginInfo.password) {
        setIsLoading(true);
        try {
          await checkAutoLogin(
            loginInfo.username,
            loginInfo.password,
            setShowAlert,
            setAlertMessage,
            setAutoLoginSuccess
          );
        } catch (error) {
          console.error('Auto-login error:', error);
        } finally {
          setIsLoading(false);
          setAutoLoginAttempted(true);
        }
      } else {
        setAutoLoginAttempted(true);
      }
    };

    performAutoLogin();
  }, []);


  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={LoginPage} exact />
          <Route path="/layout" component={Layout} />
          <Route path="/my-profile" component={MyProfile} exact />
          <Route path="/forgot-password" component={ForgotPasswordPage} exact />
          <Route path="/reset-password" component={ResetPassword} exact />
          <Redirect exact from="/" to={autoLoginSuccess && user ? '/layout' : '/login'} />
        </IonRouterOutlet>
      </IonReactRouter>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={()=>setShowAlert(false)}
        message={alertMessage}
        buttons={['OK']}
      />
      {isOffline && (
                    <IonAlert
                        isOpen={isOffline}
                        header={'oops'}
                        message={'Please check your internet connection and try again.'}
                        buttons={['OK']}
                    />
                )}
    </IonApp>
  );
};

export default App;
