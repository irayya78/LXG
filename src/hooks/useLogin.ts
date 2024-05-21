'react';
import { useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { UserSessionDetails } from '../apiHelper/userApi';
import { useSessionManager } from '../sessionManager/SessionManager';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useIonRouter();
   const {setUserSession}=useSessionManager();
   const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://lx2.legalxgen.com/api/lxservices/ValidateUserPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data);
  
      // Extract nested objects from data
      const { userId, customerId, firstName, lastName, email, cellPhone, designation, customer, disableMobileAppAccess } = data;
  
      if (userId && customerId && firstName && lastName && email) {
        const userObj: UserSessionDetails = {
          UserId: Number(userId),
          CustomerId: customerId,
          FirstName: firstName,
          LastName: lastName,
          ProfilePicture: data.ProfilePicture,
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
  
        setUserSession(userObj);
        navigation.push('/layout', 'root', 'replace');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  return { isLoading, showAlert, setShowAlert, handleLogin };
};