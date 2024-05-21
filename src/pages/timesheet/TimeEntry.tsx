import { IonButton,  IonCard, IonCardContent, 
  IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem,  IonLabel, IonList, 
  IonLoading,  IonPage, 
  IonSelect,  IonSelectOption, 
  IonTextarea, IonToggle, useIonViewDidEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { saveOutline, alertCircle } from 'ionicons/icons'
import './timeEntry.css';


import { RouteComponentProps } from 'react-router';




interface TimesheetParams extends RouteComponentProps<{trackingId: string; date: string }> {}



const TimeEntryForm: React.FC<TimesheetParams> = ({match}) => {


  return (
      <IonPage>
         
          <IonLoading ></IonLoading>
          <IonContent  class="ion-padding">
          <IonList id="listTimeEntry">
              <IonItem>
                  <IonLabel  position="fixed">Matter</IonLabel>
                  <IonInput ></IonInput>
              </IonItem>
             
              <IonItem>
                  <IonLabel position="fixed">Date</IonLabel>
                  <IonDatetime></IonDatetime>
              </IonItem>
              {
               
                  <IonItem>
                  <IonLabel position="fixed">Task</IonLabel>
                  
                  </IonItem> 
              }
              
             
              <IonItem>
                  <IonLabel position="fixed">Billable?</IonLabel>
                  <IonToggle  color="primary" />
              </IonItem>

  
              <IonItem>
                  <IonLabel position="fixed">Total Time</IonLabel>
                  <IonDatetime ></IonDatetime>
              </IonItem>
              <IonItem>
                  <IonLabel position="fixed">Billable Time</IonLabel>
                  <IonDatetime ></IonDatetime>
              </IonItem>
           
              <IonItem>
              <IonLabel position="stacked">Description</IonLabel>
                  <IonTextarea  value={""} maxlength={2000} placeholder="Description of workdone. (minumum 5 characters)"  
                  onIonChange={(e:any) => (e.target.value)} rows={3}>                       
                  </IonTextarea>
              </IonItem>
             
          
              
          </IonList>

      
          </IonContent>
          

         
          {
             
              <IonCard>
                      <IonCardContent>
                      <IonIcon className="validationError" icon={alertCircle}></IonIcon> <span className="validationError" color="warning"> {"hello"}</span> 
                      </IonCardContent>
              </IonCard> 
              
          }

          <IonButton expand="full" color="primary">
              <IonIcon  slot="start" icon={saveOutline}  />Save
          </IonButton>
      </IonPage>
    );
};

export default TimeEntryForm;


