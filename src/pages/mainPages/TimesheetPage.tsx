// TimesheetPage.tsx
import React, { useState } from 'react';
import { IonAlert, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { RouteComponentProps, useHistory } from 'react-router';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { useTimesheetManagement } from '../../hooks/useTimesheetManagement';
import CalendarNavigation from '../../components/timesheet/CalenderNavigation';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import TimesheetList from '../../components/timesheet/TimesheetList';
import MyProfileHeader from '../../components/MyProfileHeader';
import { DataAccessCheckModal, TimesheetModel } from '../../types/types';
import { add, enter, pulse, recording, recordingSharp, time, } from 'ionicons/icons';
import { messageManager } from '../../components/MassageManager';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

interface CalendarPageParams extends RouteComponentProps<{date: string }> {}

  const TimesheetPage: React.FC<CalendarPageParams> = ({match}) => {
  const {addSeperatorToMMDDYYYDateString,connvertDateToMMMDDYYYY,getCurrentDateAsString,convertToMinutes
    ,formatNumber,convertMinutesToHHMMFormat,roundOff,convertToDDMMYYYYWithoutSeparator
  }=useUIUtilities();
  const { showToastMessage,showAlertMessage,showConfirmMessage } = messageManager();
  const{getTimesheetByDate, navigateCalendar, 
    deleteTimesheet, isDateAllowedForTimeEntry,canEditOrDeleteTimesheet} = useTimesheetManagement() 
  const[selectedDate, setSelectedDate] = useState<string>("");
  const[selectedDateAsDisplay, setSelectedDateAsDisplay] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const[suppressTimesheetFetch , setSuppressTimesheetFetch] = useState<boolean>(false)
  const[totalHours, setTotalHours] = useState<String>("0:00")
  const[billableHours, setBillableHours] = useState<String>("0:00")
  const[nonBillable, setNonBillableHours] = useState<String>("0:00")
  const[calItems, setCalItems] = useState<any[]>([])
  const[percentBillable, setPercentBillable] = useState<string>("")
  const[percentNonBillable, setPercentNonBillable] = useState<string>("")
  const[timeEntriesList, setTimeEntriesList] = useState<any[]>([])
  const[showAlert, setShowAlert] = useState(false);
  const [timesheetToDelete,setTimesheetToDelete]=useState<number>(0);
  const navigation=useIonRouter();

  useIonViewDidEnter(() => {
    (async () => {
    console.log("enterPage:",match.params.date)
      const selDt = match.params.date && match.params.date.length > 0 
        ? addSeperatorToMMDDYYYDateString(match.params.date) 
        : "";
        console.log("sended",selDt)
      await loadWeeklyCalendar(selDt);
    })();
  });

  const loadWeeklyCalendar = async (date: string) =>{
    let dateToSet : string = date !== null && date !== undefined && date.length > 0 ? date : getCurrentDateAsString() 
    setSelectedDate(dateToSet)

    setSelectedDateAsDisplay(connvertDateToMMMDDYYYY(dateToSet))

    await getNavigationData(dateToSet, 0)
  }

  const getNavigationData = async(date:string, navDirection : number) =>{
    
    setIsLoading(true)
    const calData : any = await navigateCalendar(date, navDirection)
    setIsLoading(false)

    if(navDirection !== 0)
    {
      setSelectedDate(calData.SelectedDate)
      setSuppressTimesheetFetch(true)
    }  
    setTimeEntriesList(calData.Timesheet)
    setCalItems(calData.Days)
    setTotalTimeOnDay(calData.Timesheet)

    
  }

  const setTotalTimeOnDay = (timesheet1:any[])  =>{
    
    let total: number = 0
    let bt: number = 0
    let nbt: number = 0

    timesheet1.forEach( (element: any) => {
      total = total + convertToMinutes(element.TrackedTime)
      bt = bt + convertToMinutes(element.BillableHour)
      nbt = nbt + convertToMinutes(element.NonBillableHour)
    });

    const totalAsHHMM = convertMinutesToHHMMFormat(total)
    const billableAsHHMM = convertMinutesToHHMMFormat(bt)
    const nonBillableAsHHMM = convertMinutesToHHMMFormat(nbt)

    const percentBillable = total > 0 ? (bt/ total) * 100 : 0
    const percentNonBillable = total > 0 ? (nbt/ total) * 100 : 0
    
    setTotalHours(totalAsHHMM)
    setPercentBillable(formatNumber(percentBillable))
    setPercentNonBillable(formatNumber(percentNonBillable))

    setBillableHours(billableAsHHMM)
    setNonBillableHours(nonBillableAsHHMM)
}

//On when the date Changes fechting the data of TimeSheet
const onDateClick = async (selectedDate: string, firstDayOfWeek: string) => {
  setIsLoading(true)
  const selectedDateAsMMMDDYYYY =  connvertDateToMMMDDYYYY(selectedDate)
  setSelectedDateAsDisplay(selectedDateAsMMMDDYYYY)
  await navigateCalendarWeek(selectedDate, firstDayOfWeek)

  setIsLoading(false)
}


const navigateCalendarWeek = async (selectedDate: string, firstDayOfWeek: string) =>{

  if(firstDayOfWeek === null)return
  if(firstDayOfWeek === undefined)return

  if(firstDayOfWeek.length === 0)return

  setSelectedDate(selectedDate)

  switch(selectedDate){
    case "Prev":
      await getNavigationData(firstDayOfWeek, -1)
      break
    case "Next":
      await getNavigationData(firstDayOfWeek, 1)
      break
    default:{
      setSuppressTimesheetFetch(false)
      await getTimesheetBySelectedDate(selectedDate)
    }
     
  }
}

const getTimesheetBySelectedDate = async (selectedDate1: string) =>{

  setIsLoading(true)
    const timesheet : Array<TimesheetModel> = await getTimesheetByDate(selectedDate1)      

    setTimeEntriesList(timesheet)
   
   // setShowNewTimeEntryButton(!(timesheet != null && timesheet.length >0))
    setTotalTimeOnDay(timesheet)
    setIsLoading(false)
}


//Create New time entry
const newTimeEntry =async () =>{
  const validation :  DataAccessCheckModal = await isDateAllowedForTimeEntry(selectedDate)

  if(!validation.OperationAllowed){
    showAlertMessage(validation.Message);
    return false
  }

  navigation.push("/layout/timesheet/create/" + convertToDDMMYYYYWithoutSeparator(selectedDate),'forward','push')    
}

//For details View
const onViewTimesheet =(timesheet: TimesheetModel)=>{

  navigation.push(`/layout/timesheet/view-timesheet/${timesheet.TrackingId}`)
  
}

//on edit  TimeEntries
const onTimesheetEdit = async (time: TimesheetModel) =>{
    
  let validation  = await canEditOrDeleteTimesheet(time)
  console.log("inside");
  if(!validation.OperationAllowed)
  {
    showAlertMessage(validation.Message)
    return false
  }

  navigation.push(`/layout/timesheet/update/${time.TrackingId}`)   
}

const showDeleteConfirm = async (timesheet: TimesheetModel)=> {

  const validation =  await canEditOrDeleteTimesheet(timesheet);

if (!validation.OperationAllowed) {

  showAlertMessage(validation.Message);
  return;
}
    setShowAlert(true);
    setTimesheetToDelete(timesheet.TrackingId)
    
};

//For deleting timeEntry's 
const onDeleteTimesheet =async()=>{

  if (timesheetToDelete) {
    try {
        await deleteTimesheet(timesheetToDelete);
        showToastMessage("Time entry deleted successfully!");
        setTimeEntriesList(prevTimesheet =>
          prevTimesheet.filter(timesheet => timesheet.TrackingId !== timesheetToDelete)
        );
    } catch (error) {
        console.error('Error deleting expense:', error);
    } finally {
        setShowAlert(false);
        setTimesheetToDelete(0);
    }
}
}

  return (
    <IonPage >
      <IonHeader  >
        <IonToolbar color="primary">
         
        <IonTitle>Timesheet &nbsp;
         <IonLabel className='action-item'>{selectedDateAsDisplay}</IonLabel>
         </IonTitle>
          <MyProfileHeader/>
        </IonToolbar>
        <CalendarNavigation selectedDay={selectedDate} calendarItems={calItems} onDateClick={onDateClick}  />
         <IonToolbar  color="none" className="filterBar">
         
           <IonLabel slot='start' className="font-bold">#Rec:{timeEntriesList.length}</IonLabel>
       
            
             <IonLabel slot='end'  className=" ">Total: <span className="font-bold total-exp">{totalHours} Hrs</span> | B: <span className="billable-hours">{billableHours} ({percentBillable}%)</span> | NB: <span className="nonbillable-hours">{nonBillable} ({percentNonBillable}%)</span> </IonLabel>
      

     </IonToolbar>
      </IonHeader>
     
      <IonContent>
      <CommonPullToRefresh onRefresh={() => loadWeeklyCalendar(selectedDate)}>
     <IonLoading isOpen={isLoading} message={'Please wait...'} duration={0}  />
           <TimesheetList onDeleteTimesheet={showDeleteConfirm} onEditTimesheet={onTimesheetEdit} onViewTimesheet={onViewTimesheet} timeEntries={timeEntriesList} />
      
           </CommonPullToRefresh>
       </IonContent>
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
                                handler: onDeleteTimesheet
                            }
                        ]}
                        
                    />
      
       
         <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={newTimeEntry}>
          <IonIcon icon={add} />
         </IonFabButton>

          </IonFab>
            
    </IonPage>
  );
};

export default TimesheetPage;
