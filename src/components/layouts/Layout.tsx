import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonFab, IonFabButton, IonFabList } from '@ionic/react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { add, homeOutline, calendarOutline, cardOutline, briefcaseOutline, timeOutline, timerOutline } from 'ionicons/icons';
import DashboardPage from '../../pages/mainPages/DashboardPage';
import ExpensePage from '../../pages/mainPages/ExpensePage';
import MatterPage from '../../pages/mainPages/MatterPage';
import TimesheetPage from '../../pages/mainPages/TimesheetPage';
import TimeEntries from '../../pages/timesheet/TimeEntryForm';
import './layout.css';
import NewExpense from '../../pages/expense/ExpenseForm';
import ViewExpense from '../../pages/expense/ViewExpense';
import ApplyLeave from '../../pages/leave/ApplyLeave';
import ViewTimeEntry from '../../pages/timesheet/ViewTimeEntry';

const Layout: React.FC = () => {


  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/layout/dashboard" component={DashboardPage} exact />
          <Route path="/layout/timesheet" component={TimesheetPage} exact />
          <Route path="/layout/timesheet/:date" component={TimesheetPage} exact />
          <Route path="/layout/expense" component={ExpensePage} exact />
          <Route path="/layout/matter" component={MatterPage} exact />
          <Route path="/layout/timesheet/create" component={TimeEntries} exact />
          <Route path="/layout/timesheet/create/:date" component={TimeEntries} exact />
          <Route path="/layout/timesheet/update/:trackingId" component={TimeEntries} exact />
          <Route path="/layout/timesheet/view-timesheet/:trackingId" component={ViewTimeEntry}exact/>
          <Route path="/layout/expense/create" component={NewExpense} exact />
          <Route path="/layout/expense/update/:expenseId" component={NewExpense} exact />
          <Route path="/layout/expense/view/:expenseId" component={ViewExpense} exact />
          <Route path="/layout/matter/create" component={ApplyLeave} exact />
          <Redirect exact from="/layout" to="/layout/dashboard" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          
          <IonTabButton tab="timesheet" href="/layout/timesheet">
            <IonIcon icon={timerOutline} />
            <IonLabel>Timesheet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="expense" href="/layout/expense">
            <IonIcon icon={cardOutline} />
            <IonLabel>Expense</IonLabel>
          </IonTabButton>
          <IonTabButton tab="dashboard" href="/layout/dashboard">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="matter" href="/layout/matter">
            <IonIcon icon={briefcaseOutline} />
            <IonLabel>Matter</IonLabel>
          </IonTabButton>

          <IonTabButton tab="leave" href="">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Leave</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

     

    </>
  );
};

export default Layout;
