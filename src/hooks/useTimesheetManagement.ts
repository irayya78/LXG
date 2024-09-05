import axiosInstance from "../apiHelper/axiosInstance";
import { messageManager } from "../components/MassageManager";
import { useSessionManager } from "../sessionManager/SessionManager";
import { DropDownItem, MatterModel, TimesheetModel, UserSessionDetails } from "../types/types";
import { useUIUtilities } from "./useUIUtilities";

export function useTimesheetManagement() {
    const session =useSessionManager();
    const {showAlertMessage}=messageManager();
    const {
      convertToDDMMYYYYWithoutSeparator,roundOff,convertDateAsYYYYMMDD
    }=useUIUtilities();

    
const saveTimesheet = async  (model:  any) : Promise<boolean> => {
    
    const response = await axiosInstance.post("SaveTimesheet", model, {})
    return response.data.isSuccess
};
    
const saveTagedTimesheet = async (data: { trackingId: number, userIds: number[] }): Promise<boolean> => {
    console.log(data.trackingId+"sending",data.userIds);
      const response = await axiosInstance.post("SaveTagTimeEntry",{
        trackingId:data.trackingId,
        userIds:data.userIds,
        CustomerId:session.user?.CustomerId,
        UserId:session.user?.UserId
      });
      console.log(response.data)
      return response.data.isSuccess; 
    
  };

const deleteTimesheet = async (trackingId: Number) : Promise<boolean> => {


await  axiosInstance.get("/DeleteTimeEntry/" + trackingId)
return true
}



const getAssignedTasks = async  (matterId: Number): Promise<DropDownItem[]>  => {

    const resp = await axiosInstance.get("/GetAssignedTasks/" + session.user?.UserId + "/" + matterId)
    
    if(resp.data != null && resp.data.length  > 0){   
        
        const tasks: DropDownItem[] = [];
        
        resp.data.forEach( (element: any) => {
          
            tasks.push( {
                Value: Number( element.value), 
                Text: element.text
            } )
        });

        return tasks;
    } 
    else{
        return []
    }
       
};

const getTimesheetActivities = async  (): Promise<DropDownItem[]>  => {


    const resp = await axiosInstance.get("/GetTimesheetActivities/" + session.user?.CustomerId)
    
    if(resp.data != null && resp.data.length  > 0){   
        
        const tasks: DropDownItem[] = [];
        
        resp.data.forEach( (element: any) => {
          
            tasks.push( {
                Value: Number( element.value), 
                Text: element.text
            } )
        });

        return tasks;
    } 
    else{
        return []
    }
       

};


const getTimesheetByDate = async  (selectedDate: string): Promise< any[]>  => {


    const tsModel = { UserId: session.user?.UserId, TrackingDate: selectedDate}
    const resp = await axiosInstance.post( "/GetTimesheetByDate", tsModel, {})

    if(resp.data != null && resp.data.length  > 0){   
        
        const tsReturn:  any[] = [];
        
        resp.data.forEach( (element: any) => {

            const tempTS :  any = {
                MatterId:  Number( element.matterId), 
                MatterCode: element.matterCode,
                MatterTitle: element.matterTitle,
                ContactName : element.contactName,
                BillableHour: element.billableHour,
                ContactId: element.contactId,
                CustomerId: element.customerId,
                Description: element.description,
                IsBillable : element.isBillable,
                NonBillableHour : element.nonBillableHour,
                TrackedTime: element.trackedTime,
                TrackingDate:element.trackingDate,
                TrackingId: element.trackingId,
                UserId : element.userId,
                TimeTrackingActivityId: element.timeTrackingActivityId,
                MatterActivityId: element.matterActivityId,
                FromTime:element.fromTime,
                ToTime:element.toTime,
                BillableTime:element.billableTime,
                NonBillableTime:element.nonBillableTime,
                InvoiceId:element.invoiceId,
                MatterActivityName: "",
                TimeTrackingActivityName: "",
                ParentId:element.parentId
            }

            tsReturn.push( tempTS )
        })

        return tsReturn;

    } 
    else{
        return []
    }
       
};

const getTimesheetByTrackingId = async  (trackingId: Number): Promise<any>  => {

  
    const resp = await axiosInstance.get("/GetTimesheetByTrackingId/" +trackingId)
    console.log("resp raw one",resp)
    const tsReturn = getTimesheetObject(resp.data)
    console.log("resp raw on2e",tsReturn)
    return tsReturn;
};

const getCalendar = async  (): Promise<any>  => {

  
    const resp = await axiosInstance.post("/GetCalendar/" + session.user?.CustomerId + "/" + session.user?.UserId)

    if(resp.data != null){   
        const cal : any = getCalendarObject(resp.data);
        return cal
    } 
    else{
        return {Days:[], Timesheet:[],SelectedDate:"Blank Obj", TotalHrsOfWeek: ""}
    }
       
};


const getCalendarObject = (response: any) : any =>{

    const calDays: Array<any> = []
    
    response.days.forEach( (dayItem: any) => {              
        calDays.push( {
            Date : dayItem.date,
            DayName : dayItem.dayName,
            DayNameShort : dayItem.dayName.toString().substring(0,3),
            JustDatePart: dayItem.shortDate.toString().split("-")[0],
            IsSelected : dayItem.isSelected,
            ShortDate: dayItem.shortDate,
            TimeEntered : dayItem.timeEntered
        } )
    });

    const timeCollection: Array<any> = []
    response.timesheet.forEach( (timeEntryItem: any) => {
        timeCollection.push(getTimesheetObject(timeEntryItem))
    });

        const calRet: any = {
            Days: calDays,
            SelectedDate: response.selectedDate,
            TotalHrsOfWeek: response.totalHrsOfWeek,
            Timesheet : timeCollection
        }

        return calRet
} 

const getTimesheetObject =   (timeEntry: any): any  => {

   const timeObj : any =  {
        MatterId: Number( timeEntry.matterId), 
        MatterCode: timeEntry.matter.matterCode,
        MatterTitle: timeEntry.matter.matterTitle,
        ContactName : timeEntry.matter.contact.name,
        BillableHour: (timeEntry.billableHour),
        ContactId: timeEntry.contactId,
        CustomerId: timeEntry.customerId,
        Description: timeEntry.description,
        IsBillable : timeEntry.isBillable,
        NonBillableHour : (timeEntry.nonBillableHour),
        TrackedTime: (timeEntry.trackedTime),
        TrackingDate:timeEntry.trackingDate,
        TrackingId: timeEntry.trackingId,
        UserId : timeEntry.userId,
        TimeTrackingActivityId: timeEntry.timeTrackingActivityId,
        MatterActivityId:timeEntry.matterActivityId,
        FromTime:timeEntry.fromTime,
        ToTime:timeEntry.toTime,
        BillableTime:timeEntry.billableTime,
        NonBillableTime: timeEntry.nonBillableTime,
        InvoiceId:timeEntry.invoiceId,
        MatterActivityName: timeEntry.matterActivity != null ? timeEntry.matterActivity.activityName : "",
        TimeTrackingActivityName: timeEntry.timeTrackingActivities != null ? timeEntry.timeTrackingActivities.timeTrackingActivityName : "",
        ParentId:timeEntry.parentId,
        TaggedUsersArray:timeEntry.timesheetDescription!=null ?timeEntry.timesheetDescription:[]
    } 

    return timeObj
};

const getBlankTimesheetObject =   (): TimesheetModel  => {

    const timeObj : any =  {
         MatterId: 0, 
         MatterCode: "",
         MatterTitle: "",
         ContactName : "",
         BillableHour: "00:00",
         ContactId: 0,
         CustomerId: 0,
         Description: "",
         IsBillable : false,
         NonBillableHour : "00:00",
         TrackedTime: "00:00",
         TrackingDate:"",
         TrackingId: 0,
         UserId : 0,
         TimeTrackingActivityId: 0,
         MatterActivityId: 0,
         FromTime: "",
         ToTime: "",
         BillableTime: 0,
         NonBillableTime: 0,
         InvoiceId:0,
         MatterActivityName: "",
         TimeTrackingActivityName: "",
         ParentId:0,
         TaggedUsersArray:[]
     } 

     return timeObj
 };



const navigateCalendar = async(selectedDate: string, navDirection: number) : Promise<any> =>{

    const dateAsDDMMYYYY = convertToDDMMYYYYWithoutSeparator(selectedDate)

 
    const resp = await axiosInstance.get("/NavigateTimesheet/" + session.user?.CustomerId + "/" + session.user?.UserId + "/" + dateAsDDMMYYYY + "/" + navDirection)
     console.log('timesheet Data:-',resp.data)
    if(resp.data != null){   
        const cal : any = getCalendarObject(resp.data);
        return cal
    } 
    else{
        return {Days:[], Timesheet:[],SelectedDate:"Blank Obj", TotalHrsOfWeek: ""}
    }
}


const getTimesheetReport = async(groupById : number, dateFilterId: number) : Promise<any[]> =>{

    const resp = await axiosInstance.post("/GetTimesheetReport/" + session.user?.CustomerId + "/" + session.user?.UserId + "/" + groupById + "/" + dateFilterId)
    console.log("timesheet Respone from srver:-",resp.data);
    if(resp.data != null){   
        
        let tsArray : any[] = [];

        resp.data.forEach((element: any) => {
            const tsRecord : any = {
                MatterCode: element.matterCode,
                ContactName:  element.contactName,
                MatterTitle: element.matterTitle,
                TrackedTime: element.trackedTimeAsDecimal,
                BillableHour: element.billableHour,
                BillableTime: groupById > 0 ? element.nonBillableTime : roundOff(element.billableTimeInMin/60, 2) ,
                NonBillableHour: element.nonBillableHour,
                NonBillableTime: groupById > 0 ? element.nonBillableTime : roundOff(element.nonBillableTimeInMin/60, 2) ,
                ContactId:0,
                MatterId: element.matterId,
                CustomerId: 0,
                Description: element.description !== null ? element.description : "",
                FromTime: "",
                IsBillable: false,
                MatterActivityId: 0,
                TimeTrackingActivityId: 0,
                ToTime: "",
                TrackingDate: element.trackingDate !== null ? element.trackingDate : "",
                TrackingId: 0,
                UserId: 0,
                InvoiceId:0,
                MatterActivityName: "",
                TimeTrackingActivityName: ""
            }

            tsArray.push(tsRecord)
        });
        
        return tsArray
    } 
    else{
        return []
    }

}

const getAllowedBackDateForEdit =  (user : any) : Date =>{

    const currentDate : Date = new Date()
     console.log(session);
    let backDateAllowedToEditDelete : Date = new Date()

    if(user.BackDateTimesheetUpdateAllowedDays > 0)
        backDateAllowedToEditDelete.setDate(currentDate.getDate() - Number(user.BackDateTimesheetUpdateAllowedDays ))
    else
        backDateAllowedToEditDelete.setDate(currentDate.getDate() - 365)


    return backDateAllowedToEditDelete
}


const getAllowedBackDateForCreate =  (session : any) : Date =>{

    const currentDate : Date = new Date()

    let maxBackDateAllowedToCreate : Date = new Date()

    if(session.TimeSheetLockSelectedDay > 0)
        maxBackDateAllowedToCreate.setDate(currentDate.getDate() - Number(session.TimeSheetLockSelectedDay ) - 1)
    else
        maxBackDateAllowedToCreate.setDate(currentDate.getDate() - 365)


    return maxBackDateAllowedToCreate
}

 const canEditOrDeleteTimesheet = async (timesheet: TimesheetModel) : Promise<any> =>{
  
     if(timesheet.InvoiceId > 0)
        return {Message:"Cannot Edit/Delete TimeSheet as it has already been Billed",OperationAllowed: false}

     const trackingDateAsYYYYMMDD : Date = new Date(convertDateAsYYYYMMDD(timesheet.TrackingDate))
     const maxAllowedBackDate  =   getAllowedBackDateForEdit(session.user)

     if(trackingDateAsYYYYMMDD < maxAllowedBackDate)
      return {Message:"Can't Edit/Delete! Beyond Cut-Off date.",OperationAllowed: false}
 

     return  {Message: "", OperationAllowed: true}
  }

 const isDateAllowedForTimeEntry = async(selectedDate: string) : Promise<any> =>
 {
    const date =  convertDateAsYYYYMMDD(selectedDate)   

    const validDate = !(new Date(date) > new Date())  

    if(!session.user?.AllowFutureDateForTimeEntry && !validDate)
       return {Message: "Future dates are not allowed!", OperationAllowed: false}
    
    const allowedBackDate  =   getAllowedBackDateForCreate(session.user)
    
    if(new Date(date) <= allowedBackDate)
        return {Message: "Can't Enter. Beyond the cut-off date.", OperationAllowed: false}


    return  {Message: "", OperationAllowed: true}
   
}

return {
     saveTimesheet,saveTagedTimesheet, getTimesheetByDate, 
    getCalendar, navigateCalendar, getAssignedTasks, 
    getTimesheetActivities, getTimesheetByTrackingId,
    deleteTimesheet, getBlankTimesheetObject, getTimesheetReport,isDateAllowedForTimeEntry,canEditOrDeleteTimesheet
    
};
}