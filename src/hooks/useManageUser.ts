import { useIonRouter } from '@ionic/react';
import axiosInstance from '../apiHelper/axiosInstance';
import { getBlankUserObject, UserModel, UserSessionDetails } from '../types/types';
import { useSessionManager } from '../sessionManager/SessionManager';
import axios from 'axios';

export const useManageUser = () => {
  const navigation = useIonRouter();
  const { setUserSession } = useSessionManager();
  const _STORAGE_IMAGE_PATH: string = "https://legalxgen.blob.core.windows.net/userimages/";
  const _GENERIC_IMAGE_PATH: string = "";

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

      const { userId, customerId, firstName, lastName, email, cellPhone, designation, customer, disableMobileAppAccess, profilePicture } = data;
      const profilePicUrl: string = response.data.profilePicId != null && response.data.profilePicId > 0 ?
        _STORAGE_IMAGE_PATH + response.data.profilePic.guid : _GENERIC_IMAGE_PATH;

      if (userId && customerId && firstName && lastName && email) {
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
          TimeSheetLockSelectedDay: customer?.timeSheetLockSelectedDay || 0,
          BackDatedExpenseEntryAllowedDays: customer?.backDatedExpenseEntryAllowedDays || 0,
          CustomerLogoFileName: customer?.document ? customer.document.guid : '',
          BackDateTimesheetUpdateAllowedDays: customer?.backDateTimesheetUpdateAllowedDays || 0,
          DisableMobileAppAccess: disableMobileAppAccess || false,
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

  return { handleLogin, isValidUser, resetPassword };
};
