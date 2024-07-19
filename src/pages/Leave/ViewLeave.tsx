import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { LeaveModel } from '../../types/types';
import useLeaveManagement from '../../hooks/useLeaveManagement';

interface LeaveParams extends RouteComponentProps<{ leaveId: string }> { }

const ViewLeave: React.FC<LeaveParams> = ({match}) => {
    const [isLoading, setIsLoading] = useState(true);
    const { getBlankLeaveObject,getLeave} = useLeaveManagement();
    const [leave, setLeave] = useState<LeaveModel>(getBlankLeaveObject());
    const navigation = useIonRouter();

    //When this page  will enter or load
    useIonViewDidEnter(() => {
        const fetchLeave = async () => {
            setIsLoading(true);
            const lev: LeaveModel = await getLeave(Number(match.params.leaveId));   
            console.log("leave data ",lev)
            setLeave(lev);
            setIsLoading(false);
        };
        fetchLeave();
    });
    
    const editLeave = () =>{
    //     //Sending the data of expense to the Update page With expense Id
    //    const validation = canEditOrDeleteExpense(leave)

    //    if (!validation.OperationAllowed) {
    //      showAlertMessage(validation.Message);
    //      return;
    //    }
   
       navigation.push(`/layout/leave/edit/${leave.LeaveId}`, 'forward', 'push');
     }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/layout/leave" />
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={() => editLeave()}> <IonIcon  slot="start" icon={pencilOutline} /></IonButton>
                    </IonButtons>
                    <IonTitle>View Holiday</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonLoading message="Please wait..." duration={0} isOpen={isLoading}/>

            <IonContent class="ion-padding">
                <IonList id="viewLeave">
                    <IonItem>
                        <IonLabel position="fixed">Leave Type</IonLabel>
                        <IonLabel position="fixed">{leave.LeaveTypeName}</IonLabel>
                    </IonItem>
                    {/* <IonItem>
                        <IonLabel position="fixed">From Date</IonLabel>
                        <IonLabel position="fixed">{leave.FromDate}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="fixed">To Date</IonLabel>
                        <IonLabel position="fixed">{leave.ToDate}</IonLabel>
                    </IonItem> */}
                    <IonItem>
                        <IonLabel position="fixed">Leave Dates</IonLabel>
                        <IonLabel position="fixed">{leave.LeaveFromDateToToDate}</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="fixed">Leave Count</IonLabel>
                        <IonLabel position="fixed">{leave.LeaveCount}</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
};

export default ViewLeave;