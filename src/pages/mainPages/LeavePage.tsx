import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonButton, IonLoading, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonAlert, 
    useIonRouter,
    useIonViewDidEnter,
    IonButtons,
    IonMenuButton,
    IonMenu
  } from '@ionic/react';
import MyProfileHeader from '../../components/MyProfileHeader';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { HolidayListModel, LeaveModel } from '../../types/types';
import { calendarOutline, checkmarkCircle, informationCircleOutline, pencil, starSharp, trash } from 'ionicons/icons';
import FabMenu from '../../components/layouts/FabIcon';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { isPlatform } from '@ionic/react';
import { messageManager } from '../../components/MassageManager';

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
                    <IonTitle>Leave</IonTitle>
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

                    <IonButtons slot='end' className='btns'>
                        <IonMenuButton className='customIonMenuButton'/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            
            <IonContent id="content-1">
                <CommonPullToRefresh onRefresh={getLeavesList}>
                    <IonLoading isOpen={isLoading}  message={'Please wait...'}duration={0}/>
                    
                    <IonList id="leave-list">
                        {leaves && leaves.map((leave: LeaveModel)=>(
                        <IonItemSliding key={leave.LeaveId.toString()}>
                            
                           <IonItem className='ion-text-wrap' key={leave.LeaveId.toString()}> 
                                
                                <IonButton className="time-text" fill="clear" slot="end">
                                    <IonText className="total-time" slot="end">{`${leave.LeaveCount.toFixed(1)}`}</IonText> 
                                   
                                </IonButton>  
                               <IonIcon className="action-item" icon={pencil} slot="end" onClick={() => editLeaveByLeaveId(leave)}/>

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
            
            <FabMenu />
            <IonMenu maxEdgeStart={20} side="end" menuId="holidayMenu" contentId="content-1" type="overlay">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Holiday List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {holidays.map((holiday, index) => (
              <IonItem key={index}>
                <IonLabel><IonIcon color='warning' size="small" icon={starSharp}/>&nbsp;<span className='small-font' slot=''>{`${holiday.HolidayName}`}</span></IonLabel>
                <IonLabel><span slot=''>{`${holiday.HolidayDate}`}</span></IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
        </IonPage>
        
      
    );
};

export default LeavePage;
