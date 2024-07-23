
import {  IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, 
    IonItemSliding, IonLabel, IonList, IonText } from '@ionic/react';
  import React from 'react';
  import {briefcaseOutline,chevronForwardOutline, informationCircleOutline, pencil,  personOutline, pricetag, trash,} from 'ionicons/icons';
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
                <span className="matter-Code-font">
                <IonIcon icon={briefcaseOutline}/>
                  &nbsp;{timeEntry.MatterCode} | {timeEntry.MatterTitle}
               </span>
               <h2 className="small-font"> <IonIcon icon={personOutline}></IonIcon> {timeEntry.ContactName}</h2>
               
                <p className="small-font" ><IonIcon icon={informationCircleOutline}/>{timeEntry.Description}</p>  
                </IonLabel>
                  <IonText className="time-text" slot="end" > 
                  
                    <p className="total-time">  <small>   {timeEntry.ParentId > 0 && (
                  <IonIcon icon={pricetag}/>
                     )}</small>{timeEntry.TrackedTime}  </p>
                    <p className="Billable-nonbillable-hrs">B: <span>{timeEntry.BillableHour}</span> | &nbsp;NB:<span>{timeEntry.NonBillableHour}</span>
                    </p> 
                 
                  </IonText>
                
                <IonButton className="btninlinemarg" color="dark" shape="round" fill="clear"  slot="end">
                <IonIcon   className="action-item " icon={chevronForwardOutline} slot="end"></IonIcon>
                </IonButton>                         
              </IonItem>
  
              <IonItemOptions side="end">
                <IonItemOption onClick={(e:any) => deleteTimeEntry(timeEntry)} color="danger"  > 
                  <IonIcon  icon={trash}></IonIcon>
                </IonItemOption>
              </IonItemOptions>  
              <IonItemOptions onClick={() => editTimeEntry(timeEntry)} side="start">
                                    <IonItemOption color="success">
                                        <IonIcon className='' size='small' icon={pencil}></IonIcon>
                                    </IonItemOption>
                                </IonItemOptions>
            </IonItemSliding>
                  )))
          }
           
  
          </IonList>
      );
  };
  
  export default TimesheetList;
  