import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonLoading,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonTextarea,
  IonButton,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  IonSelectOption,
  IonSelect,
  IonDatetime,
  IonModal,
  useIonRouter,
  IonIcon,
  useIonViewWillLeave,
  IonCard,
  IonCardContent
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useMatterManagement } from "../../hooks/useMatterManagement";
import { DropDownItem, MatterModel, TimesheetModel, UserSessionDetails } from "../../types/types";
import MatterList from "../../components/SearchMatterProps";
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { useTimesheetManagement } from '../../hooks/useTimesheetManagement';
import { messageManager } from '../../components/MassageManager';
// import './timeEntry.css';
import TimePickerModal from '../../components/timesheet/TimePickerModal';
import { alertCircle } from 'ionicons/icons';
import ValidationMessage from '../../components/ValidationMessageProps';

interface TimesheetParams extends RouteComponentProps<{ trackingId: string; date: string }> {}
const TimeEntryForm: React.FC<TimesheetParams> = ({ match }) => {
  const {
    convertParameterDateToYYYYMMDD,
    convertDateToYYYYMMDD,
    getCurrentDateAsYYYYMMDD,
    convertToDDMMYYYYWithoutSeparator,
    convertToYYYYMMDD,
    getTimeAsHHMM,getDateToDisplay,convertTimeTo24HoursFormat,
    convertToMinutes,getTimeDifferenceBetweenFromAndToTime
  } = useUIUtilities();
  const{showAlertMessage,showToastMessage}=messageManager();
  const session = useSessionManager();
  const navigation=useIonRouter();
  const { searchMatters } = useMatterManagement();
  const { getTimesheetByTrackingId, getAssignedTasks,getTimesheetActivities,saveTimesheet } = useTimesheetManagement();
  const [matterCode, setMatterCode] = useState("");
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [tasksOnMatter, setTasksOnMatter] = useState<DropDownItem[]>([]);
  const [task, setTask] = useState<string>("");
  const [isBillable, setBillable] = useState<boolean>(false);
  const [fromTime, setFromTime] = useState<string>('00:00');
  const [toTime, setToTime] = useState<string>('00:00');
  const [totalHours, setTotalHours] = useState<string>('00:00');
  const [billableHours, setBillableHours] = useState<string>('00:00');
  const [nonBillableHours, setNonBillableHours] = useState<string>("00:00");
  const [busy, setBusy] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [caption, setCaption] = useState<string>("Time-Entry");
  const [trackingDate, setTrackingDate] = useState<string>(getCurrentDateAsYYYYMMDD);
  const [matterTaskId, setMatterTaskId] = useState<number>(0);
  const [suppressSearch, setSuppressSearch] = useState<boolean>(false);
  const [trackingId, setTrackingId] = useState<number>(0);
  const [matterId, setMatterId] = useState<number>(0);
  const [backToDate, setBackTodate] = useState<string>();
  const [timeTrackingActivityId, setTimeTrackingActivityId] = useState<number>(0);
  const [taskVisible, setTaskVisible] = useState<boolean>(false);
  const [showTotalHoursPicker, setShowTotalHoursPicker] = useState<boolean>(false);
  const [showBillableHoursPicker, setShowBillableHoursPicker] = useState<boolean>(false);
  const[timesheetActivities, setTimesheetActivities] = useState<DropDownItem[]>([])
  const[timeExceeds24Hours,setTimeExceeds24Hours]=useState<boolean>(false);
  const[saveButton,setDisableSaveButton]=useState<boolean>(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState<boolean>(false);
  const [showToTimePicker,setShowToTimePicker]= useState<boolean>(false)
  const[disabledTotalTime,setDisableTotalTime]=useState<boolean>(false);
  const [validationMessage,setValidationMessage]=useState<string>("");
  const [minDate,setMinDate]=useState<string>("");
  const [maxDate,setMaxDate]=useState<string>("");
  const isCaptureTask = session.user?.CaptureActivity;
  const isCaptureFromTimeToTime =  session.user?.CaptureFromAndToTime;
  const isBillableByDefault=session.user?.DefaultTimeEntryAsBillable;
  const getTimeInterval =session.user?.TimerTimeInterval;
  const minuteInterval = getTimeInterval ? getTimeInterval : '00,15,30,45';
  const isAnyPickerOpen = showFromTimePicker || showToTimePicker || showTotalHoursPicker || showBillableHoursPicker;
  
  useEffect(() => {
    if (isCaptureFromTimeToTime) {
      calculateAndSetTotalHours(fromTime, toTime);
    }
    
  }, [fromTime, toTime, isCaptureFromTimeToTime]);
  

  useEffect(()=>{
    validateForm();
  },[description, taskVisible, matterTaskId, isCaptureTask, timeTrackingActivityId, isBillable, billableHours, totalHours, matterId,trackingDate])

  console.log("renderTime",);
  //resting state's after saving the time
  const resetForm = () => {
    setMatterCode("");
    setMatters([]);
    setTasksOnMatter([]);
    setTask("");
    setBillable(false);
    setFromTime('00:00');
    setToTime('00:00');
    setTotalHours('00:00');
    setBillableHours('00:00');
    setNonBillableHours('00:00');
    setDescription("");
    setTrackingDate(getCurrentDateAsYYYYMMDD);
    setMatterTaskId(0);
    setTrackingId(0);
    setMatterId(0);
    setTimeTrackingActivityId(0);

  };

  

 const activeTimePicker=(timePicker:string)=>{
   if(!isAnyPickerOpen){

   switch(timePicker){
    case'fromTime':
    setFromTime('00:00')
   
    setShowFromTimePicker(true);
    break;

   case'toTime':
   setToTime('00:00');
   setShowToTimePicker(true);
   break;

   case 'totalHours':
    setTotalHours('00:00');
    setShowTotalHoursPicker(true);
    break;

    case 'billableHours':
      setBillableHours('00:00');
      setShowBillableHoursPicker(true);
      break;
    default:
      break;

   }

   }

 }

 //When we are entering this View
  useIonViewDidEnter(() => {
    const paramTrackingId = Number(match.params.trackingId);
    
 
    (async () => {
      console.log('id',paramTrackingId)
    
      if (paramTrackingId > 0) {
        setBusy(true)
        setCaption("Update TimeSheet");
        setTimesheetData(paramTrackingId);
       
      }
      try {
        await inView();
        setBusy(false)
      } catch (error) {
        console.error(error)
      }
     
      
      
    })()
      .then(() => { })
      .catch((error) => console.error(error));
    
  });

  //when will Leave Reset the States
  useIonViewWillLeave(() => {
   resetForm();
  });


  const inView=async()=>{
     
    if(isCaptureTask){
      const timeSheetActivities = await getTimesheetActivities()
     
      setTimesheetActivities(timeSheetActivities)
    }

    if (match.params.date) {
      
      setTrackingDate(convertParameterDateToYYYYMMDD(match.params.date));
     
    } 

    if(isCaptureFromTimeToTime){
       
      setDisableTotalTime(true);
    }
    if(isBillableByDefault){
      setBillable(true)
    }
     setMinAndMaxDate();
  }

  const calculateAndSetTotalHours = useCallback((fromTime: string, toTime: string) => {
    const timeDiff = getTimeDifferenceBetweenFromAndToTime(fromTime, toTime);
    setTotalHours(timeDiff);
    if(isBillable){
      setBillableHours(timeDiff)
    }else{
      setBillableHours('00:00')
    }
   
 
  }, [getTimeDifferenceBetweenFromAndToTime]);


//After Matter Selection
  const handleSelectMatter = async (selectedMatter: MatterModel) => {
    setMatterCode(selectedMatter.MatterCode);
    setMatters([]);
    setSuppressSearch(true);
    setMatterId(selectedMatter.MatterId);
    const tasks = await getAssignedTasks(selectedMatter.MatterId);
    setTasksOnMatter(tasks);
    setTaskVisible(tasks != null && tasks.length > 0);
  };
   
  // for search Matter for Time Entry
  const searchMatter = async (searchValue: string) => {
    setMatterCode(searchValue);
    if (searchValue.length > 2) {
     // setIsLoading(true)
      const matterList = await searchMatters(searchValue);
     // setIsLoading(false)
      setMatters(matterList);
    } else {
      setMatters([]);
      setMatterId(0)
    }
  };


//Saving the Time
  const saveTimeSheet = async () => {

    if(!validateForm){
      return
    }

    setTimeExceeds24Hours(false)
    setBusy(true)

    const dateToDisplay = getDateToDisplay(trackingDate)
    const fTime = session.user?.CaptureFromAndToTime ? convertTimeTo24HoursFormat(fromTime) : "00:00:00"
    const tTime = session.user?.CaptureFromAndToTime ? convertTimeTo24HoursFormat(toTime) : "00:00:00"

    const timesheetObj: TimesheetModel =
    {   UserId: Number( session.user?.UserId) , 
        BillableHour:billableHours, 
        CustomerId: Number( session.user?.CustomerId), 
        ContactName:"", Description: description , 
        IsBillable:isBillable, MatterCode:matterCode, 
        MatterId:matterId, MatterTitle:"",  
        NonBillableHour:nonBillableHours, TrackedTime:totalHours, 
        TrackingDate:dateToDisplay, 
        TrackingId:trackingId, 
        ContactId:0, 
        TimeTrackingActivityId: timeTrackingActivityId, 
        MatterActivityId: matterTaskId, 
        FromTime:fTime, 
        ToTime:tTime, 
        BillableTime:0, 
        NonBillableTime:0,
        InvoiceId:0,
        MatterActivityName: "",
        TimeTrackingActivityName:"",
        ParentId:0
    }

    const isSuccess = await saveTimesheet(timesheetObj)
    setBusy(false)


    if(!isSuccess){
        setTimeExceeds24Hours(true)
        showAlertMessage("It looks like you're trying to enter a time that exceeds 24 hours for this date or a time entry already exists during this period. Please check your entry and try again.");


    }else{
      navigation.push(`/layout/timesheet/${convertToDDMMYYYYWithoutSeparator(dateToDisplay)}`);;
    }

  }

  
//set Timesheet Data for the Update page 
  const setTimesheetData = async (trackingId: number) => {
   
    const timesheet = await getTimesheetByTrackingId(trackingId);
   
     console.log('single Timesheet',timesheet)
    if (timesheet.MatterActivityId > 0) {
      const tasks = await getAssignedTasks(timesheet.MatterId);
      setTasksOnMatter(tasks);
      setTaskVisible(tasks != null && tasks.length > 0);
      setSuppressSearch(true);
    }

    if (isCaptureFromTimeToTime) {
      const fTime = getTimeAsHHMM(timesheet.FromTime);
      const tTime = getTimeAsHHMM(timesheet.ToTime);
      setFromTime(fTime);
      setToTime(tTime);
    }

    setTotalHours(timesheet.TrackedTime);
    setBillableHours(timesheet.BillableHour);
    setTrackingId(timesheet.TrackingId);
    setSuppressSearch(true);
    setMatterCode(timesheet.MatterCode);
    setMatterId(timesheet.MatterId);
    setBillable(timesheet.IsBillable);
    setTrackingDate(convertDateToYYYYMMDD(timesheet.TrackingDate));
    setDescription(timesheet.Description);
    setNonBillableHours(timesheet.NonBillableHour);
    setBackTodate(convertToDDMMYYYYWithoutSeparator(timesheet.TrackingDate));
    setTimeTrackingActivityId(isCaptureTask ? timesheet.TimeTrackingActivityId : 0);
    setMatterTaskId(timesheet.MatterActivityId);
  
  };

  const validateForm = () =>{
    setValidationMessage("");
    let isValid=true

    if(description.length < 5 ){
      setValidationMessage("Description should be minimum 5-6 characters!")
        isValid= false
    }
    if(taskVisible && matterTaskId==0){
      setValidationMessage("Task is required!")
      isValid=false
    }
 
    if(isBillable && billableHours === '00:00'){
     
      setValidationMessage("For a billable time entry billable time should be > 0")
      isValid= false
  }
  
    if(totalHours ==='00:00'){
     
      setValidationMessage("Total hours should be > 0")
      isValid= false
  }
  if(isCaptureTask && timeTrackingActivityId ===0){
    setValidationMessage("Activity is required!")
    isValid= false
  }
  if(!trackingDate){
    setValidationMessage("Select a Date!")
    isValid =false
  }
    if(matterId  === 0){
       setValidationMessage("Select a Matter")
       isValid= false
   }
  

    const totalTimeInMinutes = convertToMinutes(totalHours) 
    const billableTimeInMinutes = convertToMinutes(billableHours)
    
    if(billableTimeInMinutes > totalTimeInMinutes){
      setValidationMessage("Billable time can't be greater than total time!")
   
        isValid= false
    }

    setDisableSaveButton(!isValid)
    return isValid;

  }
 
  //isBillable is off then TotalTime==NonBillable
  const handelBillableChange=(checked: boolean) => {
   
    if(!checked){
      setBillableHours("00:00");
      setNonBillableHours(totalHours);
      setBillable(false)
    }else{
     setNonBillableHours('00:00');
     setBillableHours(totalHours);
     setBillable(true)
    }
  }


const handelTotalTimeChange=(totalHours:string)=>{

  setTotalHours(totalHours);
  if(isBillable)
  setBillableHours(totalHours)

}

const setMinAndMaxDate =  () =>{
  if(session.user?.TimeSheetLockSelectedDay&&session.user?.TimeSheetLockSelectedDay>0){
      let startDate : Date = new Date()
      startDate.setDate(startDate.getDate() - Number(session.user?.TimeSheetLockSelectedDay))
      const dateToSet = convertToYYYYMMDD(startDate)
      setMinDate(dateToSet)
  }else{
      setMinDate((new Date().getFullYear() - 1).toString())
  }

  let endDate : Date = new Date()
  if(!session.user?.AllowFutureDateForTimeEntry){
      const endDateToSet = convertToYYYYMMDD(endDate)
      setMaxDate(endDateToSet)
  }else{
      endDate.setDate(endDate.getDate() + 90)
      setMaxDate(endDate.getFullYear().toString())
  }
}
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/layout/timesheet" />
        </IonButtons>
        <IonButtons slot="end">
          <IonButton onClick={saveTimeSheet} disabled={saveButton} shape="round">
            Save
          </IonButton>
        </IonButtons>
        <IonTitle>{caption}</IonTitle>
      </IonToolbar>
    </IonHeader>
   
    <IonContent>
   
      <div className="form-container">
        <IonItem>
          <IonLabel position="stacked">Matter</IonLabel>
         
       
          <IonInput
            value={matterCode}
            placeholder="Search your matter here..."
            onIonInput={(e: any) => searchMatter(e.target.value)}
          ></IonInput>

        </IonItem>

        <MatterList matters={matters} matterClick={handleSelectMatter} />

        <IonItem>
          <IonLabel position="stacked">Date</IonLabel>
          <IonInput
            value={trackingDate}
            placeholder="Select Date"
            type="date"
            max={maxDate}
            min={minDate}
            onIonChange={(e) => setTrackingDate(e.target.value as string)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Billable?</IonLabel>
          <IonToggle
            checked={isBillable}
            onIonChange={(e) => handelBillableChange(e.detail.checked)}
            color="primary"
          />
        </IonItem>

        {taskVisible && (
          <IonItem>
            <IonLabel position="fixed">Matter's Task</IonLabel>
            <IonSelect
              value={matterTaskId}
              okText="OK"
              cancelText="Cancel"
              onIonChange={(e) => setMatterTaskId(e.detail.value)}
              className="small-font1"
            >
              {tasksOnMatter.map((task) => (
                <IonSelectOption key={task.Value} value={task.Value}>
                  {task.Text}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        {isCaptureTask && (
          <IonItem>
            <IonLabel position="fixed">Activity</IonLabel>
            <IonSelect
              value={timeTrackingActivityId}
              okText="OK"
              cancelText="Cancel"
              onIonChange={(e) => setTimeTrackingActivityId(e.detail.value)}
            >
              {timesheetActivities.map(task => (
                <IonSelectOption key={task.Value} value={task.Value}>
                  {task.Text}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}
        {isCaptureFromTimeToTime && (
          <>
            <IonItem>
              <IonLabel position="stacked">From Time</IonLabel>
              <IonInput
                value={fromTime}
                placeholder="Select Time"
                onIonFocus={() => activeTimePicker('fromTime')}
                readonly
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">To Time</IonLabel>
              <IonInput
                value={toTime}
                placeholder="Select Time"
                onIonFocus={() => activeTimePicker('toTime')}
                readonly
              />
            </IonItem>
          </>
        )}
  <IonItem>
          <IonLabel position="stacked">Total Hours</IonLabel>
          <IonInput
            value={totalHours}
            placeholder="Select Time"
            onIonFocus={() => activeTimePicker('totalHours')}
            disabled={disabledTotalTime}
            readonly
          />
        </IonItem>
     
          <IonItem>
            <IonLabel position="stacked">Billable Time</IonLabel>
            <IonInput
              value={billableHours}
              placeholder="Select Billable Time"
              onIonFocus={() => activeTimePicker('billableHours')}
              disabled={!isBillable}
              readonly
            />
          </IonItem>
     
        
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            value={description}
            onIonInput={(e) => setDescription(e.detail.value!)}
            maxlength={2000}
            placeholder="(minimum 5 characters)"
            rows={3}
          />
        </IonItem>
        
        <TimePickerModal
          isOpen={showFromTimePicker}
          value={fromTime}
          minuteValues={minuteInterval as string}
          onIonChange={(e) => setFromTime(e.detail.value! as string)}
          onClose={() => setShowFromTimePicker(false)}
          hoursFormate="h23"
          presentation="time"
        />

        <TimePickerModal
          isOpen={showToTimePicker}
          value={toTime}
          minuteValues={minuteInterval as string}
          onIonChange={(e) => setToTime(e.detail.value! as string)}
          onClose={() => setShowToTimePicker(false)}
          hoursFormate="h23"
          presentation="time"
        />

        <TimePickerModal
          isOpen={showTotalHoursPicker}
          value={totalHours}
          minuteValues={minuteInterval as string}
          onIonChange={(e) => handelTotalTimeChange(e.detail.value! as string) }
          onClose={() => setShowTotalHoursPicker(false)}
          hoursFormate="h23"
          presentation="time"
        />

        <TimePickerModal
          isOpen={showBillableHoursPicker}
          value={billableHours}
          minuteValues={minuteInterval as string}
          onIonChange={(e) => setBillableHours(e.detail.value! as string)}
          onClose={() => setShowBillableHoursPicker(false)}
          hoursFormate="h23"
          presentation="time"
        />
      </div>
    
    </IonContent>
    <IonLoading isOpen={ busy} message={"Please wait..."} />
       <ValidationMessage message={validationMessage}/>
  </IonPage>
  );
};

export default TimeEntryForm;
