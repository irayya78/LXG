import React, { useEffect, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { LeaveModel,UserModel, MatterModel,DropDownItem, } from '../../types/types';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { RouteComponentProps } from 'react-router';
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { messageManager } from "../../components/MassageManager";

interface LeaveParams extends RouteComponentProps<{ leaveId: string }> { }

const  ApplyLeave: React.FC<LeaveParams> = ({match}) => {
  const {getCurrentDateAsYYYYMMDD,convertDateToYYYYMMDD}=useUIUtilities();
  const [leaveId, setLeaveId] = useState<Number>(0);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(0);
  const { getBlankLeaveObject,getLeave,saveLeave,getLeaveCount} = useLeaveManagement();
  const [leaveTypes, setLeaveTypes] = useState<DropDownItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [caption, setCaption] = useState("Apply Leave");
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [description, setDescription] = useState<string>("");
  const [fromSessionId, setFromSessionId] = useState<number>(0);
  const [toSessionId, setToSessionId] = useState<number>(0);
  const [leaveSessionCollection, setLeaveSessionCollection] = useState<DropDownItem[]>([]);
  const navigation = useIonRouter();
  const session = useSessionManager();
  const [leaveCount, setLeaveCount] = useState<Number>(0);
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true);
  const { showToastMessage } = messageManager();
 
  useEffect(() => {
    validateForm();
  }, [leaveTypeId,fromDate,toDate,description]);

  useIonViewDidEnter(() => {
    (async () => {
      let paramLeaveId = Number(match.params.leaveId);
      let leave: LeaveModel = getBlankLeaveObject();
  
      if(paramLeaveId>0){
        setIsLoading(true);
        setCaption("Update Leave");    
      } else {
        paramLeaveId = 0;
      }
     
      leave = await getLeave(paramLeaveId);
      await setLeaveData(leave);
      setIsLoading(false);
      
    })();
  });

   const setLeaveData= async(lev: LeaveModel) => {

    const fromDate = lev.FromDate
    ? convertDateToYYYYMMDD(lev.FromDate)
    : getCurrentDateAsYYYYMMDD();
    const toDate = lev.ToDate
    ? convertDateToYYYYMMDD(lev.ToDate)
    : getCurrentDateAsYYYYMMDD();
    setLeaveId(lev.LeaveId)
    setLeaveTypes(lev.LeaveTypeCollection)
    setLeaveTypeId(Number(lev.LeaveTypeId))
    setFromDate(fromDate) 
    setToDate(toDate)
    setDescription(lev.Description)
    const fromSessionId = lev.LeaveId > 0 ? lev.FromSessionId : 1;
    const toSessionId = lev.LeaveId > 0 ? lev.ToSessionId : 1;
    setFromSessionId(fromSessionId)
    setToSessionId(toSessionId)
    setLeaveSessionCollection(lev.LeaveSessionCollection)
    setLeaveCount(lev.LeaveCount)
   }
  

   const saveNewLeave= async () => {

    if (!validateForm()) {
      return;
    }

    const leave :LeaveModel = getBlankLeaveObject()     
    {
      leave.UserId = Number(session.user?.UserId)
      leave.CustomerId = Number(session.user?.CustomerId)
      leave.LeaveId = Number(leaveId)
      leave.LeaveTypeId = Number(leaveTypeId)
      leave.FromDate = (fromDate)
      leave.FromSessionId = (fromSessionId)
      leave.ToDate = (toDate)
      leave.ToSessionId = (toSessionId)
      leave.LeaveCount = Number(leaveCount)
      leave.Description = (description)
    }

    try {
      setIsLoading(true);
      const saved = await saveLeave(leave);
      if (saved) {
        navigation.goBack();
      } else {
        console.error("Failed to save leave");
      }
    } catch (error) {
      console.error("Error saving leave:", error);
    } finally {
      setIsLoading(false);
    }
   }
   
   const validateForm = () => {
    let isValid = true;
    
    if (leaveTypeId === 0) {
      showToastMessage("Leave Type is required!");
      isValid = false;
    }
    if(!fromDate){
      isValid = false;
    }
    if(!toDate){
      isValid = false;
    }
    if(!description){
       isValid=false;
    }
    if(!leaveCount && leaveCount > 0){
      isValid=false;
    }
    console.log(description,"dec")
    console.log(fromDate,"FD")
    console.log(toDate,"TD")
    console.log(leaveTypeId,"LTI")
    console.log('hafday/fullday',fromSessionId)
    console.log(leaveCount,'leavecount')

    setDisableSaveButton(!isValid);
    return isValid;

  }

  const handleFromDate = async (date : string) => {
    setFromDate(date)
    await fetchLeaveCount(date,toDate,fromSessionId,toSessionId)
  }
  const handleFromSessionId = async (fromsessionId : number) => {
    setFromSessionId(fromsessionId)
    await fetchLeaveCount(fromDate,toDate,fromsessionId,toSessionId)   
  }
  const handleToDate = async (date : string) => {
    setToDate(date)
    await fetchLeaveCount(fromDate,date,fromSessionId,toSessionId) 
  }
  const handleToSessionId = async (tosessionId : number) => {
    setToSessionId(tosessionId)
    await fetchLeaveCount(fromDate,toDate,fromSessionId,tosessionId) 
  }
  
  const fetchLeaveCount = async (fromDate: string, toDate: string, fromSessionId: Number, toSessionId: Number) => {
   
    const model :LeaveModel = getBlankLeaveObject() ;
    {
        model.UserId = Number(session.user?.UserId)
        model.CustomerId = Number(session.user?.CustomerId)
        model.FromDate = fromDate
        model.FromSessionId = Number(fromSessionId)
        model.ToDate = toDate
        model.ToSessionId = Number(toSessionId)   
    }

    try {
      //api Call
      setIsLoading(true)

      if(fromDate.length == 0 || toDate.length ==0)
      return;

      const count = await getLeaveCount(model);
      setLeaveCount (count);
    } catch (error) {
      console.error("Error fetching leave count:", error);
    }
    setIsLoading(false)
  };

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/layout/leave" />
          </IonButtons>
            
          <IonButtons slot="end">
          <IonButton 
          slot="end"
          onClick={saveNewLeave} 
          disabled={disableSaveButton}
          shape="round">Save 
          </IonButton>
          </IonButtons>
          
          <IonTitle>{caption}</IonTitle>

        </IonToolbar>
      </IonHeader>
      
      <IonLoading message="Please wait..." isOpen={isLoading} duration={0}/>
      
      <IonContent fullscreen>
        {/* Leave Type Input(ddl) */}
        <IonItem>
          <IonLabel position="stacked">Leave Type </IonLabel>
          <IonSelect 
            value={leaveTypeId}
            placeholder="Choose Leave Type"
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { setLeaveTypeId(e.detail.value); }}
           // onIonFocus={fetchLeaveCount} 
          >
            {leaveTypes.map((leave) => (
              <IonSelectOption
                key={leave.Value}
                value={leave.Value}
              > 
              {leave.Text}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        
        {/* From Date Input */}
        <IonItem>
          <IonLabel position="stacked">From Date</IonLabel>
          <IonInput
            type="date"
            value={fromDate}
            defaultValue={fromDate}
            onIonChange={(e) => handleFromDate(e.detail.value as string)}
          >
          </IonInput>
          
          {/* From Session Input */}
          <IonSelect 
            value={fromSessionId}
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { handleFromSessionId(e.detail.value)}}
          >
            {leaveSessionCollection.map((levSession) => (
              <IonSelectOption
                key={levSession.Value}
                value={levSession.Value}
              >
              {levSession.Text}
              </IonSelectOption>
            ))}
          </IonSelect>
          
        </IonItem>
        
        {/* To Date Input */}
        <IonItem>
          <IonLabel position="stacked">To Date</IonLabel>
          <IonInput
            type="date"
            value={toDate}
            defaultValue={toDate}
            onIonChange={(e) => handleToDate(e.detail.value as string)}
          />

          {/* To Date Input */}
          <IonSelect 
            value={toSessionId}
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { handleToSessionId(e.detail.value);}}           
          >
          {leaveSessionCollection.map((levSession) => (
            <IonSelectOption
              key={levSession.Value}
              value={levSession.Value}
            >
            {levSession.Text}
            </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Leave Count Input*/}
        <IonItem>
          <IonLabel position="stacked">#Leave(s)</IonLabel>
          <IonInput value={leaveCount as number} readonly></IonInput>
        </IonItem>

        {/* Description Input*/}
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonInput
          value={description}
          onIonInput={(e)=>setDescription(e.target.value as string)}
          />

        </IonItem>

      </IonContent>
    </IonPage>
  );
};

export default ApplyLeave;

