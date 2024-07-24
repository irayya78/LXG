import React, { useState, useEffect } from 'react';
import { 
    IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonAvatar, IonButton, IonLoading, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonAlert, 
    useIonRouter,
    useIonViewDidEnter
  } from '@ionic/react';
import MyProfileHeader from '../../components/MyProfileHeader';

import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { LeaveModel } from '../../types/types';
import { calendarOutline, checkmarkCircle, chevronForwardOutline, informationCircleOutline, list, pencil, trash } from 'ionicons/icons';
import FabMenu from '../../components/layouts/FabIcon';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { isPlatform } from '@ionic/react';
import { messageManager } from '../../components/MassageManager';

const LeavePage: React.FC = () => {
    const navigation = useIonRouter();
    const { getLeaves,getLeaveStatusColor} = useLeaveManagement();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [leaves, setLeaves] = useState<LeaveModel[]>([]);
    const [credit, setCredit] = useState<number>(0);
    const [deduct, setDeduct] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const {sortDataByDate} = useUIUtilities();
    const isIos = isPlatform('ios');
    const { showToastMessage, showAlertMessage, showConfirmMessage } = messageManager();

    useIonViewDidEnter(() => {
        (async () => {
            setIsLoading(true)
            await getLeavesList ();
            setIsLoading(false)
        })();
    });
    
    const getLeavesList = async()=>{
        try{
            const Leavelist= await getLeaves();
            const sortedLeavelist: any = sortDataByDate(Leavelist, 'FromDate', 'desc');
            setLeaves(sortedLeavelist);
            await getSummary(Leavelist);
        }catch (error) {
            console.error('Error fetching expenses:', error);
        } 
        // finally {
        //     setIsLoading(false); // Stop loading
        // }
    }
    
    const getSummary = async(leaveList: LeaveModel[]) =>{
        let credit: number = 0
        let deduct: number = 0
        let balance: number = 0

        leaveList.forEach((element: any) => {
            const leaveCount: number = Number(element.LeaveCount);
    
            if (element.LeaveTransactionId === 1) {
                credit += leaveCount;
            } else if (element.LeaveTransactionId === 2 && element.LeaveStatusId !== 3) {
                deduct += leaveCount;
            }
        });
    
        balance = credit - deduct;
        setCredit(credit);
        setDeduct(deduct);
        setBalance(balance);
    }
    
    // Navigation For Edit Leave Window 
    const editLeaveByLeaveId = (leave : LeaveModel): void =>{
        if(leave.LeaveStatusId != 2){
            navigation.push(`/layout/leave/edit/${leave.LeaveId}`, 'forward', 'push');
        }else{
            showAlertMessage("Can't edit! The leave has been approved!");
        }
    }

    // Navigation For Delete Leave Window 
    const deleteLeaveByLeaveId = (leave : LeaveModel): void =>{
        if(leave.LeaveStatusId != 2){
            navigation.push(`/layout/leave/delete/${leave.LeaveId}`, 'forward', 'push');
        }else{
            showAlertMessage("Can't delete! The leave has been approved!");
        }
    }

    const viewHolidayList = ():void=>{       
        navigation.push(`/layout/leave/viewHolidayList`, 'forward', 'push');
    }

    const viewLeave = (LeaveId: Number): void => {
        navigation.push(`/layout/leave/view/${LeaveId}`, 'forward', 'push');
    };

    return (
        
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Leave</IonTitle>
                    <MyProfileHeader/>
                </IonToolbar>
            </IonHeader>
            <CommonPullToRefresh onRefresh={getLeavesList}>
                <IonContent>
                    <IonLoading isOpen={isLoading}  message={'Please wait...'}duration={0}/>
                    <IonItem color="light" className="nobottomborder"> 
                       <IonList className='nopadding' slot="start">
                            <IonLabel className="font-grey-color greyback"><span className="font-bold">#Rec: {leaves.length}</span>&nbsp;|
                                Credit(s):&nbsp;<span className="billable-hours">{credit}</span>&nbsp;|
                                Deduction(s):&nbsp;<span className="nonbillable-hours">{deduct}</span>&nbsp;|
                                Balance:&nbsp;<span className="font-bold total-exp">{balance}</span>
                            </IonLabel>
                            
                        </IonList>
                        {/* <IonIcon icon={list} slot="end" onClick={()=> viewHolidayList()}/>  */}
                       
                       
                    </IonItem>

                    <IonList id="leave-list">
                        {leaves && leaves.map((leave: LeaveModel)=>(
                        <IonItemSliding key={leave.LeaveId.toString()}>
                            
                           <IonItem className='ion-text-wrap' key={leave.LeaveId.toString()} button onClick={() => viewLeave(leave.LeaveId)}> 
                                
                                <IonButton className="time-text" fill="clear" slot="end">
                                    <IonText className="total-time" slot="end">{`${leave.LeaveCount.toFixed(1)}`}</IonText> 
                                   
                                </IonButton>  
                               {isIos ? null :<IonIcon className="action-item" icon={pencil} slot="end"/>}
                                <IonLabel className="ion-text-wrap">
                                
                                    <span className="font-bold action-item"><IonIcon icon={checkmarkCircle} style={{ color: getLeaveStatusColor(leave.LeaveStatusId as number) }} />&nbsp;{leave.LeaveType.leaveTypeName}</span>&nbsp;-&nbsp;
                                    <span className="work-done-desc">{leave.LeaveTransactionType}</span>
                                     <br/>                               
                                    <span className="work-done-desc"> <IonIcon icon={calendarOutline}/>&nbsp;{leave.LeaveFromDateToToDate}</span><br/>
                                    <span className="small-font ellipsis"><IonIcon icon={informationCircleOutline}/>&nbsp;{leave.Description}</span> 
                                </IonLabel>

                            </IonItem>
                            <IonItemOptions onClick={() => editLeaveByLeaveId(leave)} side="start">
                                <IonItemOption color="success">
                                    <IonIcon icon={pencil}></IonIcon>
                                </IonItemOption>
                            </IonItemOptions>

                            <IonItemOptions onClick={() => deleteLeaveByLeaveId(leave)} side="end">
                                <IonItemOption color="danger">
                                    <IonIcon icon={trash}></IonIcon>
                                </IonItemOption>
                            </IonItemOptions>
                           
                       </IonItemSliding>
                        ))}
                        
                        
                    </IonList>
                    <IonLoading isOpen={isLoading} message={'Please wait...'} duration={0} />
                                       
                </IonContent>
            </CommonPullToRefresh>
            <FabMenu />
        </IonPage>
        
      
    );
};

export default LeavePage;
