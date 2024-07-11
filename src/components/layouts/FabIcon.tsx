import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import { add, calendarOutline, cardOutline, briefcaseOutline, timerOutline } from 'ionicons/icons';

const FabMenu: React.FC = () => {
  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed" >
      <IonFabButton >
        <IonIcon icon={add} />
      </IonFabButton>
      <IonFabList side="top" >

        <IonFabButton routerLink="/layout/matter/create" className="fab-button fab-matter" data-label="Apply Leave">
          <IonIcon icon={calendarOutline} color="primary" />
        </IonFabButton>
        <IonFabButton routerLink="/layout/expense/create" className="fab-button fab-expense" data-label="Add Expense">
          <IonIcon icon={cardOutline} color="success" />
        </IonFabButton>
        <IonFabButton routerLink="/layout/timesheet/create" className="fab-button fab-timesheet" data-label="Add Timesheet">
          <IonIcon icon={timerOutline} color="secondary" />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};

export default FabMenu;
