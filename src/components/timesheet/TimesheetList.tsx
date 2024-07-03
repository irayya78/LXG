
import {  IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, 
    IonItemSliding, IonLabel, IonList, IonText } from '@ionic/react';
  import React from 'react';
  import {  chevronForwardOutline,  pencil, trashOutline } from 'ionicons/icons';
  import './TimesheetList.css'
  import { TimesheetModel } from '../../types/types';
  
  const TimesheetList: React.FC<{timeEntries: TimesheetModel[]; 
     onDeleteTimesheet : (timesheet: TimesheetModel) => void ;
     onEditTimesheet : (timesheet: TimesheetModel) => void ;
     onViewTimesheet : (timesheet: TimesheetModel) => void 
    }> =  props => {
  
      const deleteTimeEntry = ( timesheet:TimesheetModel) => {
          
          props.onDeleteTimesheet(timesheet)
      }

      const handleViewTimesheet = (timesheet: TimesheetModel) => {
        props.onViewTimesheet(timesheet);
      };

      return (
          <IonList  id="time-list">
          {   
              props.timeEntries && (props.timeEntries.map((ts: any) =>(
  
                <IonItemSliding key={ts.TrackingId.toString()}>
               <IonItem key={ts.TrackingId.toString()} onClick={() => handleViewTimesheet(ts)}>
                <IonLabel>
                <h3 ><span className="matter-Code-font">{ts.MatterCode} -</span> {ts.MatterTitle}</h3>
                <h2 className="small-font"> {ts.ContactName}</h2>
               
                <p className="work-done-desc" >{ts.Description}</p>  
                </IonLabel>
                  <IonText className="time-text" slot="end" > 
                    <p className="total-time">{ts.TrackedTime} </p>
                    <p className="Billable-nonbillable-hrs">B: <span>{ts.BillableHour}</span> | &nbsp;NB:<span>{ts.NonBillableHour}</span></p>
                  </IonText>
                
                <IonButton className="btninlinemarg" color="dark" shape="round" fill="clear"  slot="end">
                <IonIcon   className="action-item " icon={chevronForwardOutline} slot="end"></IonIcon>
                </IonButton>                         
              </IonItem>
  
              <IonItemOptions side="end">
                <IonItemOption onClick={(e:any) => deleteTimeEntry(ts)} color="danger"  > 
                  <IonIcon icon={trashOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>  
              <IonItemOptions side="start">
                <IonItemOption  color="light" onClick={(e:any)=>props.onEditTimesheet(ts)}> 
                  <IonIcon icon={pencil}></IonIcon>
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
                  )))
          }
          
  
          </IonList>
      );
  };
  
  export default TimesheetList;
  