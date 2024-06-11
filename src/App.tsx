import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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
Chart.register(...registerables);


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={LoginPage} exact />
        <Route path="/layout" component={Layout} />
        <Route path="/my-profile" component={MyProfile} exact />
        <Route path="/forgot-password" component={ForgotPasswordPage}exact/>
        <Route path="/reset-password" component={ResetPassword}exact/>
        <Redirect exact from="/" to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
