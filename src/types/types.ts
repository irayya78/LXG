
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
    TimeSheetLockSelectedDay: Number,
    BackDatedExpenseEntryAllowedDays:Number,
    CustomerLogoFileName: string,
    BackDateTimesheetUpdateAllowedDays: Number,
    DisableMobileAppAccess: boolean,
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


 