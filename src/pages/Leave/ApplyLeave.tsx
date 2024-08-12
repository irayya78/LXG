import React, { useEffect, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenu, IonMenuButton, IonPage, IonPopover, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { LeaveModel,UserModel,DropDownItem, } from '../../types/types';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { RouteComponentProps } from 'react-router';
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useUIUtilities } from '../../hooks/useUIUtilities';
import ApproverList from '../../components/SearchUserProps';
import useExpenseManagement from "../../hooks/useExpenseManagement";
import ValidationMessage from '../../components/ValidationMessageProps';

interface LeaveParams extends RouteComponentProps<{ leaveId: string }> { }

const  ApplyLeave: React.FC<LeaveParams> = ({match}) => {
  const {getCurrentDateAsYYYYMMDD,convertDateToYYYYMMDD,sortDataByDate,convertToYYYYMMDD}=useUIUtilities();
  const [leaveId, setLeaveId] = useState<Number>(0);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(0);
  const { getBlankLeaveObject,getLeave,saveLeave,getLeaveCount,getHolidayList,getLeaves,getSummary} = useLeaveManagement();
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
  const {searchUsers } = useExpenseManagement();
  const [approvers, setApprovers] = useState<UserModel[]>([]);
  const [ApproverId, setSelectedApproverId] = useState<number | null>(null);
  const [approverName,setApproverName] = useState<string>('');
  const [leaveSummary, setLeaveSummary] = useState<any>({ credit: 0, deduct: 0, balance: 0 });
  const [validationMessage,setValidationMessage]=useState<string>("");
  const isLeaveApprover=session.user?.DisplayLeaveApprover;
  const [maxDayAllowed,setMaxDayAllowed]=useState<string>("")
  const [minDayAllowed,setMinDayAllowed]=useState<string>("")
 

  useEffect(() => {
    validateForm();
  }, [leaveTypeId,description,toDate,fromDate,ApproverId]);

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
      const Leavelist= await getLeaves();
      const summary = await getSummary(Leavelist);
      setLeaveSummary(summary);
      await setLeaveData(leave);
      setIsLoading(false);
     
      setMinAndMaxDate();
    })();
  });



  const setMinAndMaxDate =  () =>{
  
        let startDate : Date = new Date()
        startDate.setDate(startDate.getDate() - Number(session.user?.BackDateLeaveAllowedDays))
        const dateToSet = convertToYYYYMMDD(startDate)
        setMinDayAllowed(dateToSet)
 
         let endDate : Date = new Date()
         endDate.setDate(endDate.getDate() + Number(session.user?.FutureDateLeaveAllowedDays))
        const endDateToSet = convertToYYYYMMDD(endDate)
        setMaxDayAllowed(endDateToSet)
  
    
  }

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
    setDescription(lev.Description ?lev.Description:"")
    const fromSessionId = lev.LeaveId > 0 ? lev.FromSessionId : 1;
    const toSessionId = lev.LeaveId > 0 ? lev.ToSessionId : 1;
    setFromSessionId(fromSessionId)
    setToSessionId(toSessionId)
    setLeaveSessionCollection(lev.LeaveSessionCollection)
    setLeaveCount(lev.LeaveCount)
    setSelectedApproverId(Number(lev.ApproverId))
    setApproverName(lev.ApproverName)
    fetchLeaveCount(fromDate,toDate,fromSessionId,toSessionId)
   }
  

   const saveNewLeave= async () => {

    if (!validateForm) {
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
      leave.Description = description
      leave.ApproverId = Number(ApproverId)
    }
    setIsLoading(true);
    try {
   
      const saved = await saveLeave(leave);
      if (saved) {
        navigation.push("/layout/leave",'forward','push');
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
    setValidationMessage("");
    let isValid = true;
    
    if(!fromDate){
      setValidationMessage("From Date is required!");
      isValid = false;
    }
    if(!toDate){
      setValidationMessage("To Date is required!");
      isValid = false;
    }

    if(description.length < 5){
      setValidationMessage("Description should be minimum 5-6 characters!");
       isValid=false;
    }
    if(isLeaveApprover && ApproverId ===0){
      setValidationMessage("Select Approver!");
      isValid=false;
    }
    if(fromDate > toDate){
      setValidationMessage("Please choose a valid date range!");
      isValid=false;
    }
    if (leaveTypeId === 0) {
      setValidationMessage("Select Leave Type");
      isValid = false;
    }

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
      setAutoDescription(leaveTypeId, count);  // Automatically update the description when leave count changes
    } catch (error) {
      console.error("Error fetching leave count:", error);
    }
    setIsLoading(false)
  };

  //For searching Approver's
  const searchApprovers = async (searchValue: string) => {
    setApproverName(searchValue);
    if (searchValue.length > 2) {
      const approversList = await searchUsers(searchValue);
      setApprovers(approversList);
    } else {
      setApprovers([]);
     
    }
  };

  const handleSelectApprover = async (selectedApprover: UserModel) => {
    setSelectedApproverId(selectedApprover.UserId);
    setApproverName(selectedApprover.FullName);
    setApprovers([]);
   
    
  };

  const setAutoDescription = (leaveTypeId: number, leaveCount: Number) => {
    const selectedLeaveType = leaveTypes.find(leave => leave.Value === leaveTypeId);
    const leaveTypeName = selectedLeaveType?.Text || "Leave";
    const autoDescription = `Requesting to grant ${leaveCount} day(s) of ${leaveTypeName}.`;
    setDescription(autoDescription);
  }


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
              shape="round"
            >Save
            </IonButton>
          </IonButtons>

          <IonTitle>{caption}</IonTitle>

        </IonToolbar>

      </IonHeader>

      <IonLoading message="Please wait..." isOpen={isLoading} duration={0} />

      <IonContent id="main-content" className="page-content" fullscreen>
        <IonItem>
          <IonLabel position="stacked">Leave Type </IonLabel>
          <IonSelect
            value={leaveTypeId}
            placeholder="Choose Leave Type"
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { setLeaveTypeId(e.detail.value); 
              setAutoDescription(e.detail.value, leaveCount);  // Automatically update the description when leave type changes
            }}
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
           
            min={minDayAllowed}
            max={maxDayAllowed}
          >
          </IonInput>

          <IonSelect
            value={fromSessionId}
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { handleFromSessionId(e.detail.value) }}
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

        <IonItem>
          <IonLabel position="stacked">To Date</IonLabel>
          <IonInput
            type="date"
            value={toDate}
            defaultValue={toDate}
            onIonChange={(e) => handleToDate(e.detail.value as string)}
            max={maxDayAllowed}
            min={minDayAllowed}
          />

          <IonSelect
            value={toSessionId}
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => { handleToSessionId(e.detail.value); }}
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

        <IonItem>
          <IonLabel position="stacked">#Leave(s)</IonLabel>
          <IonInput value={leaveCount as number} readonly></IonInput>
        </IonItem>

        {isLeaveApprover ? 
        
        <IonItem>
          <IonLabel position="stacked">Approver</IonLabel>
          <IonInput
            value={approverName}
            placeholder="Search for an approver..."
            onIonInput={(e: any) => searchApprovers(e.target.value)}
          ></IonInput>
        </IonItem>
        
        :null}
        

        <ApproverList
          approvers={approvers}
          onApproverSelect={handleSelectApprover}
        />

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            value={description}
            placeholder="Enter min 5 characters"
            onIonInput={(e) => setDescription(e.detail.value!)}
            rows={3}
          />
        </IonItem>
     
      </IonContent> 
      <ValidationMessage message={validationMessage}/>
    </IonPage>
  );
};

export default ApplyLeave;

