import { useIonRouter } from '@ionic/react';
import axiosInstance from '../apiHelper/axiosInstance';
import { getBlankUserObject, UserModel, UserSessionDetails } from '../types/types';
import { useSessionManager } from '../sessionManager/SessionManager';


export const useManageUser = () => {
  const navigation = useIonRouter();
  const { setUserSession } = useSessionManager();
  const _STORAGE_IMAGE_PATH: string = "https://legalxgen.blob.core.windows.net/userimages/";

  // Function to generate generic image URL with initials
  const getGenericImageUrl = (name: string) => {
    const initial = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initial}&background=F5F5F5&color=000`;
  };

  // LOGIN USERname and Password API And Creating Session as well!
  const handleLogin = async (
    username: string,
    password: string,
    setIsLoading: (loading: boolean) => void,
    setShowAlert: (show: boolean) => void,
    setAlertMessage: (message: string) => void
  ) => {
    setIsLoading(true);
    try {
     
      const response = await axiosInstance.post('/ValidateUserPost', { username, password });
      const data = response.data;
      console.log(data);

      const { userId, customerId, firstName, lastName, email, cellPhone, designation, customer, disableMobileAppAccess, profilePicId, profilePic } = data;
      const profilePicUrl: string = profilePicId != null && profilePicId > 0 && profilePic?.guid
        ? _STORAGE_IMAGE_PATH + profilePic.guid
        : getGenericImageUrl(firstName);

      if (userId && customerId && firstName && email) {
        const userObj: UserSessionDetails = {
          UserId: Number(userId),
          CustomerId: customerId,
          FirstName: firstName,
          LastName: lastName,
          ProfilePicture: profilePicUrl,
          Email: email,
          Cell: cellPhone,
          Designation: designation?.designationName || '',
          CaptureFromAndToTime: customer?.captureFromAndToTimeInTimeTracking || false,
          CaptureActivity: customer?.captureActivityInTimeTracking || false,
          AllowFutureDateForExpenseSubmission: customer?.allowFutureDateForExpenseSubmission || false,
          AllowFutureDateForTimeEntry: customer?.allowFutureDateForTimeEntry || false,
          TimeSheetLockSelectedDay: customer?.timeSheetLockSelectedDay ,
          BackDatedExpenseEntryAllowedDays: customer?.backDatedExpenseEntryAllowedDays || 0,
          CustomerLogoFileName: customer?.document ? customer.document.guid : '',
          BackDateTimesheetUpdateAllowedDays: customer?.backDateTimesheetUpdateAllowedDays || 0,
          DisableMobileAppAccess: disableMobileAppAccess || false,
          DisplayExpenseApprover:customer?.displayExpenseApprover||false,
          TimerTimeInterval:customer?.timerTimeInterval||null,
          AllowTaggingTimesheet:customer?.allowTaggingTimesheet,
          DefaultTimeEntryAsBillable:customer?.defaultTimeEntryAsBillable,
          DisplayLeaveApprover:customer?.displayLeaveApprover||false
          
        };

        // Set the session values
        setUserSession(userObj);
        // Store in local storage as well so data is available after refreshing the page
        localStorage.setItem('userSession', JSON.stringify(userObj));
        navigation.push('/layout', 'root', 'replace');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlertMessage('Login failed. Please try again.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };


  //AutoLogin
  const checkAutoLogin = async (
    username: string,
    password: string,
    setShowAlert: (show: boolean) => void,
    setAlertMessage: (message: string) => void,
    setAutoLoginSuccess: (success: boolean) => void 
  ) => {
    try {
      const response = await axiosInstance.post('/ValidateUserPost', {username, password});
      const data = response.data;
  
      const {
        userId,
        customerId,
        firstName,
        lastName,
        email,
        cellPhone,
        designation,
        customer,
        disableMobileAppAccess,
        profilePicId,
        profilePic
      } = data;
  
      const profilePicUrl: string =
        profilePicId != null && profilePicId > 0 && profilePic?.guid
          ? _STORAGE_IMAGE_PATH + profilePic.guid
          : getGenericImageUrl(firstName);
  
      if (userId && customerId && firstName && email) {
        const userObj:UserSessionDetails = {
          UserId: Number(userId),
          CustomerId: customerId,
          FirstName: firstName,
          LastName: lastName,
          ProfilePicture: profilePicUrl,
          Email: email,
          Cell: cellPhone,
          Designation: designation?.designationName || '',
          CaptureFromAndToTime: customer?.captureFromAndToTimeInTimeTracking || false,
          CaptureActivity: customer?.captureActivityInTimeTracking || false,
          AllowFutureDateForExpenseSubmission:
            customer?.allowFutureDateForExpenseSubmission || false,
          AllowFutureDateForTimeEntry: customer?.allowFutureDateForTimeEntry || false,
          TimeSheetLockSelectedDay: customer?.timeSheetLockSelectedDay,
          BackDatedExpenseEntryAllowedDays: customer?.backDatedExpenseEntryAllowedDays || 0,
          CustomerLogoFileName: customer?.document ? customer.document.guid : '',
          BackDateTimesheetUpdateAllowedDays: customer?.backDateTimesheetUpdateAllowedDays || 0,
          DisableMobileAppAccess: disableMobileAppAccess || false,
          DisplayExpenseApprover: customer?.displayExpenseApprover || false,
          TimerTimeInterval: customer?.timerTimeInterval || null,
          AllowTaggingTimesheet: customer?.allowTaggingTimesheet,
          DefaultTimeEntryAsBillable:customer?.defaultTimeEntryAsBillable,
          DisplayLeaveApprover:customer?.displayLeaveApprover||false
        };
  
        setUserSession(userObj);
        localStorage.setItem('userSession', JSON.stringify(userObj));
        // localStorage.removeItem('sessionExpired');
        setAutoLoginSuccess(true); // Set auto-login success state
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      setAlertMessage('Session expired. Please log in again.');
      setShowAlert(true); 
      setAutoLoginSuccess(false); 
    }
  };
  
 
  
  // Email Valid Or Not Checking In forgot Password Window API CALL
  const isValidUser = async (username: string): Promise<UserModel> => {
    try {
      const response = await axiosInstance.post("/IsValidUser", { Email: username });
      console.log('valid user:', response);
      if (response.data && response.data.userId && response.data.userId > 0) {
        return {
          Email: response.data.email,
          UserId: response.data.userId,
          Password: "",
          LastName: "",
          FullName: "",
          FirstName: "",
          EmailOTP: ""
        };
      } else {
        return getBlankUserObject();
      }
    } catch (error) {
      console.error('Error while checking user validity:', error);
      throw error;
    }
  };

  // Reset Password API CALL
  const resetPassword = async (userId: number, emailOTP: string, password: string): Promise<any> => {
    const user: UserModel = { FirstName: "", FullName: "", LastName: "", Password: password, UserId: userId, EmailOTP: emailOTP, Email: "" };
    const response = await axiosInstance.post("/ResetPassword", user);
    return response.data;
  };
 


  return { handleLogin, isValidUser, resetPassword,checkAutoLogin };
};
