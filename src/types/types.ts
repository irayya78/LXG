
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
 
export interface DropDownItem{
  Value: number,
  Text: string,
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
