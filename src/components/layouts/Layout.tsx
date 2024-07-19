import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route,} from 'react-router-dom';
import {timer, card, home, briefcase, calendar } from 'ionicons/icons';
import DashboardPage from '../../pages/mainPages/DashboardPage';
import ExpensePage from '../../pages/mainPages/ExpensePage';
import MatterPage from '../../pages/mainPages/MatterPage';
import TimesheetPage from '../../pages/mainPages/TimesheetPage';
import TimeEntries from '../../pages/timesheet/TimeEntryForm';
import './layout.css';
import NewExpense from '../../pages/expense/ExpenseForm';
import ViewExpense from '../../pages/expense/ViewExpense';
import ViewTimeEntry from '../../pages/timesheet/ViewTimeEntry';
// import ApplyLeave from '../../pages/leave/ApplyLeave';



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
          {/* <Route path="/layout/leave/create" component={ApplyLeave} exact />
          <Route path="/layout/leave/edit/:leaveId" component={ApplyLeave} exact/> */}
          {/* <Route path="/layout/leave" component={LeavePage} exact />
          <Route path="/layout/leave/viewHolidayList" component={HolidayList} exact/>
          <Route path="/layout/leave/view/:leaveId" component={ViewLeave} exact/> */}
          <Redirect exact from="/layout" to="/layout/dashboard" />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          
          <IonTabButton tab="timesheet" href="/layout/timesheet">
            <IonIcon icon={timer} />
            <IonLabel>Timesheet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="expense" href="/layout/expense">
            <IonIcon icon={card} />
            <IonLabel>Expense</IonLabel>
          </IonTabButton>
          <IonTabButton tab="dashboard" href="/layout/dashboard">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="matter" href="/layout/matter">
            <IonIcon icon={briefcase} />
            <IonLabel>Matter</IonLabel>
          </IonTabButton>

          <IonTabButton disabled  tab="leave" href="">
            <IonIcon icon={calendar} />
            <IonLabel>Leave</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

     

    </>
  );
};

export default Layout;
