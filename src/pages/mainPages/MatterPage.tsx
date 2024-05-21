import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonListHeader, IonBackButton, IonButtons, IonAvatar, IonButton } from '@ionic/react';

const MatterPage: React.FC = () => {
  // Your demo data for the list
  const [items, setItems] = useState([
    { id: 1, name: 'Matter of Delhi', description: 'Matter number 1' },
    { id: 2, name: 'Matter of Mumbai', description: 'Description for matter of Mumbai' },
    { id: 3, name: 'Matter of Kolkata', description: 'Description for matter of Kolkata' },
    { id: 4, name: 'Matter of Chennai', description: 'Description for matter of Chennai' },
    { id: 5, name: 'Matter of Bengaluru', description: 'Description for matter of Bengaluru' },
    { id: 6, name: 'Matter of Hyderabad', description: 'Description for matter of Hyderabad' },
    { id: 7, name: 'Matter of Ahmedabad', description: 'Description for matter of Ahmedabad' },
    { id: 8, name: 'Matter of Pune', description: 'Description for matter of Pune' },
    { id: 9, name: 'Matter of Surat', description: 'Description for matter of Surat' },
    { id: 10, name: 'Matter of Jaipur', description: 'Description for matter of Jaipur' },
    { id: 11, name: 'Matter of Lucknow', description: 'Description for matter of Lucknow' },
    { id: 12, name: 'Matter of Kanpur', description: 'Description for matter of Kanpur' },
    { id: 13, name: 'Matter of Nagpur', description: 'Description for matter of Nagpur' },
    { id: 14, name: 'Matter of Indore', description: 'Description for matter of Indore' },
    { id: 15, name: 'Matter of Thane', description: 'Description for matter of Thane' },
  ]);

  // Function to handle item selection
  const handleItemClick = (item: any) => {
    console.log(`Clicked on ${item.name}`);
    // You can implement logic to navigate to a detail page or perform other actions here
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          
          <IonTitle>Matters</IonTitle>
          <IonButtons slot="end">
       <IonButton routerLink="/my-profile">
    <IonAvatar>
      <img src="https://hotpot.ai/images/site/ai/photoshoot/corporate_headshot/style_gallery/39.jpg" alt="Profile" />
    </IonAvatar>
     </IonButton>
</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Timesheet entries */}
        <IonList>
          {items.map(entry => (
            <IonItem key={entry.id}>
              <IonLabel>
                <h2>{entry.name}</h2>
                <h3>{entry.description}</h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MatterPage;
