import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonFab, IonFabButton, IonFabList } from '@ionic/react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { add, homeOutline, calendarOutline, cardOutline, briefcaseOutline } from 'ionicons/icons';
import DashboardPage from '../../pages/mainPages/DashboardPage';
import ExpensePage from '../../pages/mainPages/ExpensePage';
import MatterPage from '../../pages/mainPages/MatterPage';
import TimesheetPage from '../../pages/mainPages/TimesheetPage';
import TimeEntries from '../../pages/timesheet/TimeEntry';
import NewExpense from '../../pages/expense/NewExpense';
import NewMatter from '../../pages/matter/NewMatter';
import './layout.css';

const Layout: React.FC = () => {
  const location = useLocation();
  const hiddenFabRoutes = ['/layout',  '/login', '/my-profile'];

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/layout/dashboard" component={DashboardPage} exact />
          <Route path="/layout/timesheet" component={TimesheetPage} exact />
          <Route path="/layout/expense" component={ExpensePage} exact />
          <Route path="/layout/matter" component={MatterPage} exact />
          <Route path="/layout/timesheet/create" component={TimeEntries} exact />
          <Route path="/layout/expense/create" component={NewExpense} exact />
          <Route path="/layout/matter/create" component={NewMatter} exact />
          <Redirect exact from="/layout" to="/layout/dashboard" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="dashboard" href="/layout/dashboard">
            <IonIcon icon={homeOutline} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          <IonTabButton tab="timesheet" href="/layout/timesheet">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Timesheet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="expense" href="/layout/expense">
            <IonIcon icon={cardOutline} />
            <IonLabel>Expense</IonLabel>
          </IonTabButton>
          <IonTabButton tab="matter" href="/layout/matter">
            <IonIcon icon={briefcaseOutline} />
            <IonLabel>Matter</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      {!hiddenFabRoutes.includes(location.pathname) && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 999, marginBottom: '8px' }}>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton>
              <IonIcon icon={add} />
            </IonFabButton>
            <IonFabList side="top">
              <IonFabButton routerLink="/layout/timesheet/create" className="fab-button fab-timesheet" data-label="New Timesheet">
                <IonIcon icon={calendarOutline} color="secondary" />
              </IonFabButton>
              <IonFabButton routerLink="/layout/expense/create" className="fab-button fab-expense" data-label="New Expense">
                <IonIcon icon={cardOutline} color="success" />
              </IonFabButton>
              <IonFabButton routerLink="/layout/matter/create" className="fab-button fab-matter" data-label="New Matter">
                <IonIcon icon={briefcaseOutline} color="primary" />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        </div>
      )}
    </>
  );
};

export default Layout;
