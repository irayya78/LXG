import React, { useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from "@ionic/react";
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import useApprovalManagement from '../../hooks/useApprovalManagement';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { NotificationModel } from '../../types/types';
import { calendar, calendarOutline, cash, cashOutline,chevronForwardOutline, personCircleOutline } from 'ionicons/icons';

const  ApprovalList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {getApprovals} = useApprovalManagement();
    const { formatDateToDDMMYYYY} = useUIUtilities();
    const [approvals, setApprovals] = useState<NotificationModel[]>([]);
    const navigation = useIonRouter();

    const expenseCount = approvals.filter(approval => approval.Type === 'Exp').length;
    const leaveCount = approvals.filter(approval => approval.Type !== 'Exp').length;

    useIonViewDidEnter(() => {
        (async () => {
            setIsLoading(true)
            await getApprovalList ();
            setIsLoading(false)
        })();
    });

    const getApprovalList = async()=>{
        try{
            const approvalList= await getApprovals();
            // const sortedApprovalList: any = sortDataByDate(approvalList, 'FromDate', 'desc');
            setApprovals(approvalList);
            // const summary = await getSummary(Leavelist);
            // await setLeaveSummary(summary);
            console.log("approvalList",approvalList);
        }catch (error) {
            console.error('Error fetching expenses:', error);
        } 
    }

    const viewApprove = (Id: Number,Type: string):void => {
         navigation.push(`/layout/approval/view/${Type}/${Id}`, 'forward', 'push');
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/layout/dashboard" />
                    </IonButtons>
                    <IonTitle>Approvals</IonTitle>
                </IonToolbar>
                <IonToolbar color="none" className="nobottomborder filterBar">
                    <IonLabel slot="start">
                        <IonLabel><span className="font-bold">#Rec: {approvals.length}</span> | 
                            Leaves:&nbsp;<span>{leaveCount}</span>&nbsp;|
                            Expense:&nbsp;<span>{expenseCount}</span>&nbsp;
                        </IonLabel>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <CommonPullToRefresh onRefresh={getApprovalList}>
                    <IonLoading isOpen={isLoading}  message={'Please wait...'} duration={0}/>
            
                    <IonList id="approval-list">
                        
                    {approvals && approvals.map((approval: NotificationModel)=>(
                        
                        <IonItem className='ion-text-wrap' key={approval.Id.toString()} button  onClick={() => viewApprove(approval.Id,approval.Type)}>
                            
                            <IonText className="total-time time-text" slot="end"> {approval.Description}</IonText>
                             {/* <IonIcon slot='end' icon={chevronForwardOutline }></IonIcon> */}
                            
                            <IonLabel className="ion-text-wrap">
                                <span className="font-bold action-item"><IonIcon  icon={approval.Type === 'Exp' ?  cashOutline: calendarOutline}/> {approval.Type}</span>
                                <span className="work-done-desc"> {formatDateToDDMMYYYY(approval.Date)}</span>
                                <br/>
                                <span className="work-done-desc"><IonIcon icon={personCircleOutline}/> {approval.Name}</span>
                                
                            </IonLabel>
                        </IonItem>
                    ))}
                    </IonList>
                </CommonPullToRefresh>
            </IonContent>
        </IonPage>
    );
};

export default ApprovalList;