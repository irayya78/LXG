import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';

const  ApplyLeave: React.FC = () => {
  const [date, setDate] = useState<string>(''); // State for Date
  const [matter, setMatter] = useState<string>(''); // State for Matter
  const [time, setTime] = useState<string>(''); // State for Time
  const [description, setDescription] = useState<string>(''); // State for Description

  // Function to handle saving time entry
  const saveMatter = () => {
    // Perform save operation with the entered data
    console.log('Date:', date);
    console.log('Matter:', matter);
    console.log('Time:', time);
    console.log('Description:', description);
  };

  return (
    <IonPage>
      <IonHeader>
     
      <IonToolbar color='secondary'>
      <IonButtons slot="start">
            <IonBackButton defaultHref="" />
          </IonButtons>
         <IonTitle>Apply Leave</IonTitle>
       </IonToolbar>


      </IonHeader>
      <IonContent fullscreen>
        {/* Date Input */}
      

        {/* Matter Dropdown */}
        <IonItem>
          <IonLabel>Matter</IonLabel>
          <IonSelect value={matter} placeholder="Select Matter" onIonChange={(e) => setMatter(e.detail.value)}>
            <IonSelectOption value="matter1">Matter 1</IonSelectOption>
            <IonSelectOption value="matter2">Matter 2</IonSelectOption>
            {/* Add more options as needed */}
          </IonSelect>
        </IonItem>

        {/* Time Input */}
       
        {/* Description Input */}
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value!)}></IonTextarea>
        </IonItem>

        {/* Save Button */}
        <IonButton expand="block" onClick={saveMatter}>Save</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ApplyLeave;
