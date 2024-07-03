
export interface UserSessionDetails {
    UserId: Number;
    CustomerId: Number;
    FirstName:string;
    LastName:string;
    ProfilePicture: string,
    Email:string,
    Designation:string,
    Cell:string,
    CaptureFromAndToTime: boolean,
    CaptureActivity: boolean,
    AllowFutureDateForExpenseSubmission: boolean,
    AllowFutureDateForTimeEntry: boolean,
    TimeSheetLockSelectedDay: number,
    BackDatedExpenseEntryAllowedDays:Number,
    CustomerLogoFileName: string,
    BackDateTimesheetUpdateAllowedDays: number,
    DisableMobileAppAccess: boolean,
    DisplayExpenseApprover:boolean,
    TimerTimeInterval:Number
    
   
  }

  export interface LoginModel {
    username: string;
    password: string;
    rememberMe: boolean;
    darkMode: boolean;
  }
  
export interface UserModel{
  UserId: number,
  FirstName: string,
  LastName: string,
  FullName: string,
  Password: string,
  EmailOTP: string,
  Email: string
}

  export const  getBlankUserObject = (): UserModel =>{
  return {Email:"",EmailOTP:"",FirstName:"",FullName:"", LastName:"", Password:"", UserId: 0}
}
 

export interface MatterModel{
  MatterId: number,
  PracticeAreaId:number,
  MatterCode: string,
  OpenDate: string,
  PracticeArea:string,
  Status:string,
  MatterTitle: string,
  ClientName: string,
  MatterStatuses:DropDownItem[],
  PracticeAreas:DropDownItem[],
  SubPracticeAreas:DropDownItem[],
  BusinessUnits:DropDownItem[],
}

export interface DropDownItem{
  Value: number,
  Text: string,
}
export interface TimesheetModel{
  TrackingId : number,
  TrackingDate: string,
  MatterId : number,
  MatterCode:string,
  MatterTitle:string,
  ContactName:string,
  ContactId:number,
  TrackedTime: string,
  BillableHour: string,
  NonBillableHour: string,
  Description: string,
  IsBillable: boolean,
  UserId: number,
  CustomerId:number,
  TimeTrackingActivityId: number,
  MatterActivityId : number,
  FromTime: string,
  ToTime: string,
  BillableTime: number,
  NonBillableTime:number,
  InvoiceId: number,
  TimeTrackingActivityName: string,
  MatterActivityName: string
}
export interface ExpenseModel{
  ExpenseId : number,
  Date: string,
  ExpenseCategory: string,
  CategoryId : number,
  Description:string,
  Amount:number,
  AmountToDisplay:any,
  MatterId:number,
  MatterCode: string,
  MatterTitle: string,
  Client: string,
  ClientId: number,
  PaymentId:number,
  CustomerId:Number,
  CreatedBy: Number,
  CreatedByName: string,
  ExpenseCategories:DropDownItem[],
  ApprovalStatusId: Number,
  FileToUpload: any,
  FileAsBase64: string,
  FileName: string,
  InvoiceId: number,
  ExpenseDocuments: ExpenseDocumentModel[],
  ApprovalStatus: ExpenseApprovalStatus,
  ActionBy: UserModel,
  Comments: string
  BillableToClient :boolean
  ApproverId:number
  
  
}
export interface ExpenseStatusModel {
  iosIcon: string;
  mdIcon: string;
  color: string;
  icon:string;
}
export interface ExpenseDocumentModel{
  DocumentId: Number,
  DocumentName: string
}
export interface ExpenseApprovalStatus{
  StatusId: Number,
  StatusName: string
}

export interface DataAccessCheckModal {
  OperationAllowed: boolean,
  Message: string
}


 