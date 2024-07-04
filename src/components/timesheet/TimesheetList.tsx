
import {  IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, 
    IonItemSliding, IonLabel, IonList, IonText } from '@ionic/react';
  import React from 'react';
  import {  chevronForwardOutline,  pencil, time, trashOutline } from 'ionicons/icons';
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

      const editTimeEntry = (timesheet: TimesheetModel) => {
        props.onEditTimesheet(timesheet);
      };
    
    
      return (
          <IonList  id="time-list">
          {   
              props.timeEntries && (props.timeEntries.map((timeEntry: TimesheetModel) =>(
  
                <IonItemSliding key={timeEntry.TrackingId.toString()}>
               <IonItem key={timeEntry.TrackingId.toString()} onClick={() => handleViewTimesheet(timeEntry)}>
                <IonLabel>
                <h3 ><span className="matter-Code-font">{timeEntry.MatterCode} -</span> {timeEntry.MatterTitle}</h3>
                <h2 className="small-font"> {timeEntry.ContactName}</h2>
               
                <p className="work-done-desc" >{timeEntry.Description}</p>  
                </IonLabel>
                  <IonText className="time-text" slot="end" > 
                    <p className="total-time">{timeEntry.TrackedTime} </p>
                    <p className="Billable-nonbillable-hrs">B: <span>{timeEntry.BillableHour}</span> | &nbsp;NB:<span>{timeEntry.NonBillableHour}</span></p>
                  </IonText>
                
                <IonButton className="btninlinemarg" color="dark" shape="round" fill="clear"  slot="end">
                <IonIcon   className="action-item " icon={chevronForwardOutline} slot="end"></IonIcon>
                </IonButton>                         
              </IonItem>
  
              <IonItemOptions side="end">
                <IonItemOption onClick={(e:any) => deleteTimeEntry(timeEntry)} color="danger"  > 
                  <IonIcon icon={trashOutline}></IonIcon>
                </IonItemOption>
              </IonItemOptions>  
              <IonItemOptions onClick={() => editTimeEntry(timeEntry)} side="start">
                                    <IonItemOption color="light">
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
  