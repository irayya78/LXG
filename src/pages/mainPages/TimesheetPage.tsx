// TimesheetPage.tsx
import React from 'react';
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useSessionManager } from '../../sessionManager/SessionManager';
import FabMenu from '../../components/layouts/FabIcon';

const TimesheetPage: React.FC = () => {
  const session =useSessionManager();
  // Demo time entries
  const timeEntries = [
    { 
      id: 1, 
      date: '2024-05-01', 
      matter: 'Legal Matter 1', 
      client: 'Ashish tripathi', 
      time: '8:00 AM - 4:00 PM', 
      description: 'Research and preparation for upcoming trial.'
    },
    { 
      id: 2, 
      date: '2024-05-02', 
      matter: 'Ecourt Matter for Delhi', 
      client: 'Himanshu Saran', 
      time: '9:00 AM - 4:30 PM', 
      description: 'Drafting legal documents and agreements.'
    },
    { 
      id: 3, 
      date: '2024-05-03', 
      matter: 'Matter for june ', 
      client: 'Priya jain', 
      time: '10:00 AM - 5:00 PM', 
      description: 'Meeting with clients and discussing case strategy.'
    },
  ];

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar color="primary">
          
          <IonTitle>Timesheet</IonTitle>
          <IonButtons slot="end">
       <IonButton routerLink="/my-profile">
    <IonAvatar>
    <img src ={session.user?.ProfilePicture}alt="Profile" />
    </IonAvatar>
     </IonButton>
</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Timesheet entries */}
        <IonList>
          {timeEntries.map(entry => (
            <IonItem key={entry.id}>
              <IonLabel>
                <h2>{entry.date}</h2>
                <h3>{entry.matter}</h3>
                <p>Client: {entry.client}</p>
                <p>Time: {entry.time}</p>
                <p>Description: {entry.description}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
                 <FabMenu />
       </div>
      </IonContent>
    </IonPage>
  );
};

export default TimesheetPage;
