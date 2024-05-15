import React, { useState } from 'react';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter, IonReactRouter } from '@ionic/react-router';

import { Route, Redirect, Router } from 'react-router-dom';
import LoginPage from './pages/login/Login';
import DashboardPage from './pages/mainPages/DashboardPage';
import TimesheetPage from './pages/mainPages/TimesheetPage';
import MatterPage from './pages/mainPages/MatterPage';
import ExpensePage from './pages/mainPages/ExpensePage';
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
import Layout from './components/layouts/Layout';


import 'chartjs-adapter-date-fns';

import { Chart, registerables } from 'chart.js/auto'; // Import from 'chart.js/auto' for Chart.js version 3

Chart.register(...registerables)

setupIonicReact();

 const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={LoginPage} exact />
        <Route path="/dashboard" component={DashboardPage} exact />
        <Route path="/timesheet" component={TimesheetPage} exact />
        <Route path="/expense" component={ExpensePage} exact />
        <Route path="/matter" component={MatterPage} exact />
        <Redirect exact from="/" to="/dashboard" />
      </IonRouterOutlet>
      <Layout />
    </IonReactRouter>
  </IonApp>
);


export default App;


