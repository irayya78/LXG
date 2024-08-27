import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
// import './forgotPassword.css';
import { alertCircle, chevronBackOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useManageUser } from '../../hooks/useManageUser';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/layouts/Footer';
import { useSessionManager } from '../../sessionManager/SessionManager';

const ResetPassword: React.FC = () => {
  const { resetPassword } = useManageUser();
  const { user, clearUserSession, loginInfo, setLoginInfo } = useSessionManager();
  const navigation = useIonRouter();
  
  // Get the state passed from ForgotPassword component
  const location = useLocation<{ email: string; userId: number }>();
  
  const [email, setEmail] = useState<string>(location.state?.email || ''); 
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOTP] = useState<string>('');
  const [disableResetPasswordButton, setDisableResetPasswordButton] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [userId, setUserId] = useState<number>(location.state?.userId || 0); 
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showPasswordIcon] = useState<string>(eyeOffOutline);
  const [hidePasswordIcon] = useState<string>(eyeOutline);
  const [busy, setBusy] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  useEffect(() => {
    doDataValidation();
  }, [otp, password, confirmPassword]);

  const doDataValidation = () => {
    if (otp.length < 4 || password.length < 6 || confirmPassword.length < 6) {
      setDisableResetPasswordButton(true);
      return;
    }
    setDisableResetPasswordButton(false);
  };

  const doResetPassword = async () => {
    if (password !== confirmPassword) {
      setValidationMessage('Password and Confirm password are not same!');
      return;
    }

    setBusy(true);
    try {
      const res = await resetPassword(userId, otp, password);
      if (!res.resetPasswordSuccess) {
        switch (Number(res.errorTypeId)) {
          case 1:
            setErrorAlert({ show: true, message: 'Invalid OTP!' });
            break;
          case 2:
            setErrorAlert({ show: true, message: 'New Password cannot be the same as the earlier one!' });
            break;
          default:
            setErrorAlert({ show: true, message: 'An unexpected error occurred.' });
        }
      } else {
        // Show success alert
        setShowSuccessAlert(true);
      }
    } catch (error) {
      setErrorAlert({ show: true, message: 'An unexpected error occurred.' });
    } finally {

      setBusy(false);
    }
  };
  const handleOTPChange = (e: any) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length <= 4 && e.key !== 'Backspace') {
      setOTP(value);
    }
  };
  //For Restrict the Inputs To 4
  const handleOTPKeyPress = (e: React.KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length >= 4) {
      e.preventDefault();
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>

      <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>
      <IonContent class="ion-padding">
       
        <IonList className="inputsList">
          <IonItem className="texts reset-password-alert">
            <IonText className="reset-pwd-text">
              We've sent an OTP on your email <span>{email}</span>! Enter the same below.
            </IonText>
          </IonItem>

          <IonItem>
          
            <IonInput
              placeholder='OTP'
              type="number"
              minlength={4}
              maxlength={4}
              value={otp}
              onIonInput={handleOTPChange}
              onKeyPress={handleOTPKeyPress}
            ></IonInput>
          </IonItem>

          {!showPassword ? (
            <IonItem>
            
              <IonInput placeholder='Password' value={password} className="sample-pwd-field-class" type="password" onIonInput={(e: any) => setPassword(e.target.value)}></IonInput>
              <IonButton className="transparent-bg-btn" color="light" onClick={toggleShowPassword} slot="end">
                <IonIcon icon={showPasswordIcon}></IonIcon>
              </IonButton>
            </IonItem>
          ) : (
            <IonItem>
           
              <IonInput  style={{padding:"10px"}} value={password} className="sample-pwd-field-class" type="text" onIonInput={(e: any) => setPassword(e.target.value)}></IonInput>
              <IonButton className="transparent-bg-btn" color="light" onClick={toggleShowPassword} slot="end">
                <IonIcon slot="end" icon={hidePasswordIcon}></IonIcon>
              </IonButton>
            </IonItem>
          )}

          {!showConfirmPassword ? (
            <IonItem>
          
              <IonInput placeholder='Confirm Password' value={confirmPassword} className="sample-pwd-field-class" type="password" onIonInput={(e: any) => setConfirmPassword(e.target.value)}></IonInput>
              <IonButton className="transparent-bg-btn" color="light" onClick={toggleShowConfirmPassword} slot="end">
                <IonIcon icon={showPasswordIcon}></IonIcon>
              </IonButton>
            </IonItem>
          ) : (
            <IonItem>
       
              <IonInput placeholder='Confirm Password' value={confirmPassword} className="sample-pwd-field-class" type="text" onIonInput={(e: any) => setConfirmPassword(e.target.value)}></IonInput>
              <IonButton className="transparent-bg-btn" color="light" onClick={toggleShowConfirmPassword} slot="end">
                <IonIcon slot="end" icon={hidePasswordIcon}></IonIcon>
              </IonButton>
            </IonItem>
          )}
        </IonList>
        <IonButton disabled={disableResetPasswordButton} expand="full" onClick={doResetPassword} shape="round" className="loginbtn">
          Reset Password
        </IonButton>

        <div className="center-button">
          <IonButton size="small" fill="clear" color="medium" onClick={() => navigation.push('/login', 'root', 'replace')} shape="round">
            <IonIcon icon={chevronBackOutline} slot="start" />
            Back to login!
          </IonButton>
        </div>

        {validationMessage.length > 0 && (
          <IonCard>
            <IonCardContent>
              <IonIcon className="validationError" icon={alertCircle}></IonIcon>
              <span className="validationError" color="warning">
                {' '}
                {validationMessage}
              </span>
            </IonCardContent>
          </IonCard>
        )}
        
        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => setShowSuccessAlert(false)}
          header={'Password Reset Successfully'}
          message={'Your password has been reset successfully. Please use your new password to log in.'}
          buttons={[
            {
              text: 'OK',
              handler: () => {
                navigation.push('/login', 'root', 'replace');
                clearUserSession();
                window.location.reload();
              }
            }
          ]}
        />

        <IonAlert
          isOpen={errorAlert.show}
          onDidDismiss={() => setErrorAlert({ show: false, message: '' })}
          header={'OOPS'}
          message={errorAlert.message}
          buttons={['OK']}
        />
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default ResetPassword;
