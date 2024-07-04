import { IonAlert, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { trashOutline, pencilOutline, attachOutline, arrowBack } from 'ionicons/icons';
import React, { useState } from 'react';
import { ExpenseDocumentModel, ExpenseModel, TimesheetModel } from '../../types/types';
import { useTimesheetManagement } from '../../hooks/useTimesheetManagement';
import { messageManager } from '../../components/MassageManager';
import { RouteComponentProps } from 'react-router';
import { useUIUtilities } from '../../hooks/useUIUtilities';




interface ViewTimesheetParams extends RouteComponentProps<{trackingId: string; }> {}

    const ViewTimesheet: React.FC<ViewTimesheetParams> = ({match}) => {
     
    const navigation=useIonRouter();    
    const{showToastMessage,showAlertMessage} = messageManager()
    const{getTimesheetByTrackingId, getBlankTimesheetObject, deleteTimesheet, canEditOrDeleteTimesheet} = useTimesheetManagement()
    const {convertToDDMMYYYYWithoutSeparator} = useUIUtilities()
    const[timesheet, setTimesheet] = useState<TimesheetModel>(getBlankTimesheetObject())
    const[showAlert, setShowAlert] = useState<boolean>(false)
    const[busy, setBusy] = useState<boolean>(false)




    useIonViewDidEnter(
       ()=>{
        const fetchExpense = async () => {
            setBusy(true);
            const timeEntry: TimesheetModel = await getTimesheetByTrackingId(Number(match.params.trackingId));
         console.log(timeEntry)
            setTimesheet(timeEntry);
            setBusy(false);
          };
      
          fetchExpense();

    });
//Edit the Time Entry
    const editRecord = async () =>{
        const canEditOrDelete = await  canEditOrDeleteTimesheet(timesheet)

        if(!canEditOrDelete.OperationAllowed){
            showToastMessage(canEditOrDelete.Message)
            return false
        }
        navigation.push(`/layout/timesheet/update/${timesheet.TrackingId}`)  
       
    }

 //Delete the Time Entry ask First ?  
    const showDeleteConfirmation = async () => {
        const validation = await  canEditOrDeleteTimesheet(timesheet)

        if(!validation.OperationAllowed){
            showAlertMessage(validation.Message)
            return false
        }

        setShowAlert(true)
    }
 
    //Delete
    const deleteRecord = async () =>{
        setBusy(true)
        await deleteTimesheet(timesheet.TrackingId)
        setBusy(false)
        showToastMessage("Timesheet deleted successfully!")
        navigation.push(`/layout/timesheet`);
    }

    

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar color="secondary">
             <IonButtons slot="start">
            <IonBackButton defaultHref='/layout/timesheet'></IonBackButton>
            <IonButtons/>

          </IonButtons>
            <IonButtons slot="end" >
                  <IonButton  slot="end" onClick={() => showDeleteConfirmation()} > <IonIcon  slot="start" icon={trashOutline}  /></IonButton>
                  <IonButton onClick={() => editRecord()}  slot="end" > <IonIcon  slot="start" icon={pencilOutline}  /></IonButton>
              </IonButtons>
            
            <IonTitle>View Time</IonTitle>
        </IonToolbar>
        
            </IonHeader>
            <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>

            <IonContent  class="ion-padding">
            <IonList id="listTimeEntry">
                <IonItem>
                    <IonLabel  position="fixed">Matter</IonLabel>
                    <IonLabel  position="fixed">{timesheet.MatterCode}</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel position="fixed">Date</IonLabel>
                    <IonLabel>{timesheet.TrackingDate}</IonLabel>
                </IonItem>
                {
                    timesheet.MatterActivityId > 0 ? 
                    <IonItem>
                    <IonLabel position="fixed">Task</IonLabel>
                    <IonLabel>{timesheet.MatterActivityName}</IonLabel>
                    </IonItem> : null
                }
                
                {
                    timesheet.TimeTrackingActivityId > 0 ? 
                    <IonItem>
                        <IonLabel position="fixed">Activity</IonLabel>
                        <IonLabel>{timesheet.TimeTrackingActivityName}</IonLabel>
                    </IonItem> : null
                }
                <IonItem>
                    <IonLabel position="fixed">Billable?</IonLabel>
                    {
                         timesheet.IsBillable  ? 
                            <IonLabel>Yes</IonLabel>
                         :  <IonLabel>No</IonLabel>
                    }
                </IonItem>
                
                <IonItem>
                    <IonLabel position="fixed">Total Time</IonLabel>
                    <IonLabel>{timesheet.TrackedTime}</IonLabel>                
                </IonItem>
                <IonItem>
                    <IonLabel position="fixed">Billable Time</IonLabel>
                    <IonLabel>{timesheet.BillableHour}</IonLabel>                
                </IonItem>
                <IonItem>
                    <IonLabel position="fixed">Non Billable Time</IonLabel>
                    <IonLabel>{timesheet.NonBillableHour}</IonLabel>                
                </IonItem>
                <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonText className="small-font">{timesheet.Description}</IonText>
                </IonItem>
            </IonList>

        
            <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header={'Delete time entry'}
                        message={'Are you sure you want to delete this time entry?'}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    setShowAlert(false);
                                }
                            },
                            {
                                text: 'Okay',
                                handler: deleteRecord
                            }
                        ]}
                    />

            </IonContent>
            

           
          

         
        </IonPage>
      );
};

export default ViewTimesheet;
