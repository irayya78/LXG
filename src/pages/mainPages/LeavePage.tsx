import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonButton, IonLoading, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonAlert, 
    useIonRouter,
    useIonViewDidEnter,
    IonButtons,
    IonMenuButton,
    IonMenu,
    IonFab,
    IonFabButton
  } from '@ionic/react';
import MyProfileHeader from '../../components/MyProfileHeader';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { HolidayListModel, LeaveModel } from '../../types/types';
import { add, calendar, calendarClear, calendarNumber, calendarNumberOutline, calendarOutline, checkmarkCircle, chevronForwardOutline, flag, flame, happySharp, informationCircleOutline, leaf, leafOutline, leafSharp, moonSharp, pencil, snowOutline, starSharp, sunnySharp, trash } from 'ionicons/icons';
import FabMenu from '../../components/layouts/FabIcon';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { isPlatform } from '@ionic/react';
import { messageManager } from '../../components/MassageManager';
import { fireEvent } from '@testing-library/react';

const LeavePage: React.FC = () => {
    const navigation = useIonRouter();
    const { getLeaves,getLeaveStatusColor,getSummary,deleteLeave,getHolidayList} = useLeaveManagement();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [leaves, setLeaves] = useState<LeaveModel[]>([]);
    const [credit, setCredit] = useState<number>(0);
    const [deduct, setDeduct] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const {sortDataByDate} = useUIUtilities();
    const { showToastMessage, showAlertMessage } = messageManager();
    const [ leaveToDelete, setLeaveToDelete] = useState<LeaveModel | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [holidays, setHolidays] = useState<HolidayListModel[]>([]);
    
    useIonViewDidEnter(() => {
        (async () => {
            setIsLoading(true)
            await getLeavesList ();
            let holidays = await getHolidayList();
            const sortedholidayList: any = sortDataByDate(holidays, 'HolidayDate', 'asc');
            setHolidays(sortedholidayList);
            setIsLoading(false)
        })();
    });
    
    const getLeavesList = async()=>{
        try{
            const Leavelist= await getLeaves();
            const sortedLeavelist: any = sortDataByDate(Leavelist, 'FromDate', 'desc');
            setLeaves(sortedLeavelist);
            const summary = await getSummary(Leavelist);
            await setLeaveSummary(summary);

        }catch (error) {
            console.error('Error fetching expenses:', error);
        } 
    }
    
    const setLeaveSummary = async (summary: { credit: number; deduct: number; balance: number }) => {
        setCredit(summary.credit);
        setDeduct(summary.deduct);
        setBalance(summary.balance);
    };
    
    // Navigation For Edit Leave Window 
    const editLeaveByLeaveId = (leave : LeaveModel): void =>{
        if(leave.LeaveStatusId != 2){
            navigation.push(`/layout/leave/edit/${leave.LeaveId}`, 'forward', 'push');
        }else{
            showAlertMessage("Can't edit! The leave has been approved!");
        }
    }

    // Navigation For Delete Leave Window 
    const showDeleteConfirm = (leave : LeaveModel): void =>{
        if(leave.LeaveStatusId != 2){
            setLeaveToDelete(leave);
            setShowAlert(true);
        }else{
            showAlertMessage("Can't delete! The leave has been approved!");
        }
    }

    const confirmDeleteLeave = async () => {
        if (leaveToDelete) {
            try {
               await deleteLeave(leaveToDelete.LeaveId);
                showToastMessage("Leave deleted successfully!");
                setLeaves(leaves.filter(e => e.LeaveId !== leaveToDelete.LeaveId));
                navigation.push('/layout/leave','back','push');
            } catch (error) {
                console.error('Error deleting leave:', error);
            } finally {
                setShowAlert(false);
                setLeaveToDelete(null);
            }
        }
    };


    return (
        
        <IonPage>
            
     

            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Leaves</IonTitle>
                    <MyProfileHeader/>
                </IonToolbar>
                <IonToolbar color="none" className="nobottomborder filterBar">
                    <IonLabel slot="start">
                        <IonLabel><span className="font-bold">#Rec: {leaves.length}</span> | 
                            Credit:&nbsp;<span className="billable-hours">{credit}</span>&nbsp;|
                            Deduction:&nbsp;<span className="nonbillable-hours">{deduct}</span>&nbsp;|
                            Balance:&nbsp;<span className="font-bold total-exp">{balance}</span>
                        </IonLabel>
                        
                    </IonLabel>
                    <IonButtons slot='end' className='menuBtn'>
                    <IonMenuButton><IonIcon size='small' color='dark' className="customMenuBtn" icon={calendar}></IonIcon></IonMenuButton>
                    </IonButtons>
                  
                </IonToolbar>
                
            </IonHeader>
            
            <IonContent id="content-1">
                <CommonPullToRefresh onRefresh={getLeavesList}>
                    <IonLoading isOpen={isLoading}  message={'Please wait...'}duration={0}/>
                    
                    <IonList id="leave-list">
                        {leaves && leaves.map((leave: LeaveModel)=>(
                        <IonItemSliding key={leave.LeaveId.toString()}>
                            
                           <IonItem className='' key={leave.LeaveId.toString()} onClick={() => editLeaveByLeaveId(leave)}> 
                                
                                <IonButton className="time-text" fill="clear" slot="end">
                                    <IonText className="total-time" slot="end">{`${leave.LeaveCount.toFixed(1)}`}</IonText> 
                                   
                                </IonButton>  
                               <IonIcon className="action-item" icon={chevronForwardOutline} slot="end"/>

                               <IonLabel className="ion-text-wrap">
  <div className="row">
    <span className="matter-Code-font">
      <IonIcon className="icon-align" icon={checkmarkCircle} color={getLeaveStatusColor(leave.LeaveStatusId as number)} />
      &nbsp;{leave.LeaveType.leaveTypeName}-<small>{leave.LeaveTransactionType}</small>
    </span>
    
    <span className="ellipsis">
      <IonIcon className="icon-align" icon={calendarOutline}/>&nbsp;{leave.LeaveFromDateToToDate}
    </span>
    <span className="ellipsis">
      <IonIcon icon={informationCircleOutline} />
      &nbsp;{leave.Description}
    </span>
  </div>
 
</IonLabel>

                            </IonItem>
                            <IonItemOptions onClick={() => editLeaveByLeaveId(leave)} side="start">
                                <IonItemOption color="success">
                                    <IonIcon icon={pencil}></IonIcon>
                                </IonItemOption>
                            </IonItemOptions>

                            <IonItemOptions onClick={() => showDeleteConfirm(leave)} side="end">
                                <IonItemOption color="danger">
                                    <IonIcon icon={trash}></IonIcon>
                                </IonItemOption>
                            </IonItemOptions>
                           
                       </IonItemSliding>
                        ))}
                        
                       
                    </IonList>
                    {/* <IonLoading isOpen={isLoading} message={'Please wait...'} duration={0} /> */}

                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header={'Delete Leave'}
                        message={'Are you sure you want to delete this leave?'}
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
                                handler: confirmDeleteLeave
                            }
                        ]}
                    />

                    </CommonPullToRefresh>                 
            </IonContent>
            
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/layout/leave/create">
          <IonIcon icon={add} />
         </IonFabButton>

          </IonFab>
            <IonMenu maxEdgeStart={20} side="end" menuId="holidayMenu" contentId="content-1" type="overlay">
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>Holiday's</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonList>
                        {holidays.map((holiday, index) => (
                        <IonItem key={index}>                
                                <IonIcon size='small' icon={snowOutline} style={{ paddingRight: '3px' }} color='warning'/>  
                                <IonLabel className='font-bold text-ellipses action-item' color="primary">{`${holiday.HolidayName}`}</IonLabel>
                                <IonLabel className="small-font" style={{color:'grey'}} slot='end'>{`${holiday.HolidayDate}`}</IonLabel>
                        </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonMenu>                            
        </IonPage>
        
      
    );
};

export default LeavePage;
