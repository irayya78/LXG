import React, { useState, useEffect } from 'react';
import { IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/react';
import { add, calendarOutline, cardOutline, timerOutline } from 'ionicons/icons';

const FabMenu: React.FC = () => {
  const [fabMenu, setFabMenu] = useState(false);

  // useEffect(() => {
  //   const pageContent = document.querySelector('.page-content');
  //   if (pageContent) {
  //     if (fabMenu) {
  //       pageContent.classList.add('blur-background');
  //     } else {
  //       pageContent.classList.remove('blur-background');
  //     }
  //   }
  // }, [fabMenu]);

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      <IonFabButton onClick={() => setFabMenu(!fabMenu)}>
        <IonIcon icon={add} />
      </IonFabButton>
      <IonFabList side="top">
        <IonFabButton routerLink="/layout/leave/create" className="fab-button fab-matter" data-label="Apply Leave" onClick={() => setFabMenu(false)}>
          <IonIcon icon={calendarOutline} color="primary" />
        </IonFabButton>
        <IonFabButton routerLink="/layout/expense/create" className="fab-button fab-expense" data-label="Add Expense" onClick={() => setFabMenu(false)}>
          <IonIcon icon={cardOutline} color="success" />
        </IonFabButton>
        <IonFabButton routerLink="/layout/timesheet/create" className="fab-button fab-timesheet" data-label="Add Timesheet" onClick={() => setFabMenu(false)}>
          <IonIcon icon={timerOutline} color="secondary" />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
};

export default FabMenu;
