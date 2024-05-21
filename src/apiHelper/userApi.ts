
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
   // LeaveCycleId : Number
  }

  

