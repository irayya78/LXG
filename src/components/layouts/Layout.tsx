import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonFab, IonFabButton, IonFabList } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import { add, homeOutline, calendarOutline, cardOutline, briefcaseOutline } from 'ionicons/icons';
import LoginPage from '../../pages/login/Login';
import DashboardPage from '../../pages/mainPages/DashboardPage';
import ExpensePage from '../../pages/mainPages/ExpensePage';
import MatterPage from '../../pages/mainPages/MatterPage';
import TimesheetPage from '../../pages/mainPages/TimesheetPage';

const Layout: React.FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" component={LoginPage} exact />
        <Route path="/dashboard" component={DashboardPage} exact />
        <Route path="/timesheet" component={TimesheetPage} exact />
        <Route path="/expense" component={ExpensePage} exact />
        <Route path="/matter" component={MatterPage} exact />
        <Redirect exact from="/" to="/dashboard" />
      </IonRouterOutlet>

      <IonTabs>
        <IonRouterOutlet>
          <Route path="/dashboard" component={DashboardPage} exact />
          <Route path="/timesheet" component={TimesheetPage} exact />
          <Route path="/expense" component={ExpensePage} exact />
          <Route path="/matter" component={MatterPage} exact />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="dashboard" href="/dashboard" >
            <IonIcon icon={homeOutline} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          <IonTabButton tab="timesheet" href="/timesheet">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Timesheet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="expense" href="/expense">
            <IonIcon icon={cardOutline} />
            <IonLabel>Expense</IonLabel>
          </IonTabButton>
          <IonTabButton tab="matter" href="/matter">
            <IonIcon icon={briefcaseOutline} />
            <IonLabel>Matter</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 999, marginBottom: '8px' }}>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton routerLink="">
              <IonIcon icon={calendarOutline} color="secondary" />
            </IonFabButton>
            <IonFabButton routerLink="">
              <IonIcon icon={cardOutline} color="success" />
            </IonFabButton>
            <IonFabButton routerLink="">
              <IonIcon icon={briefcaseOutline} color="primary" />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </div>
    </IonReactRouter>
  );
};

export default Layout;
