import {
    IonAlert,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    useIonRouter,
    useIonViewDidEnter,
  } from '@ionic/react';
  import { trashOutline, pencilOutline, personAddOutline, closeCircleOutline, pricetagSharp, pricetagsOutline, pricetagOutline, backspace, arrowBackSharp, arrowBack } from 'ionicons/icons';
  import React, { useState } from 'react';
  import { TimesheetModel, UserModel } from '../../types/types';
  import { useTimesheetManagement } from '../../hooks/useTimesheetManagement';
  import { messageManager } from '../../components/MassageManager';
  import { RouteComponentProps } from 'react-router';
  import { useUIUtilities } from '../../hooks/useUIUtilities';
  import UserList from '../../components/UserList';
  import useExpenseManagement from '../../hooks/useExpenseManagement';
  import { useSessionManager } from '../../sessionManager/SessionManager';
  // import './ViewTimesEntry.css'
  interface ViewTimesheetParams extends RouteComponentProps<{ trackingId: string }> {}
  
  const ViewTimesheet: React.FC<ViewTimesheetParams> = ({ match }) => {
    const session=useSessionManager();
    const navigation = useIonRouter();
    const { showToastMessage, showAlertMessage } = messageManager();
    const { getTimesheetByTrackingId, getBlankTimesheetObject, deleteTimesheet, canEditOrDeleteTimesheet ,saveTagedTimesheet} = useTimesheetManagement();
    const { convertToDDMMYYYYWithoutSeparator } = useUIUtilities();
    const [timesheet, setTimesheet] = useState<TimesheetModel>(getBlankTimesheetObject());
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [busy, setBusy] = useState<boolean>(false);
    const [userSearch, setUserSearch] = useState<string>("");
    const [users, setUsers] = useState<UserModel[]>([]);
    const [tagedUsers, setTagedUsers] = useState<UserModel[]>([]);
    const [showUserSearch, setShowUserSearch] = useState<boolean>(false);
    const { searchUsers } = useExpenseManagement();
    const isTimeSheetTaggingAllowed=session.user?.AllowTaggingTimesheet
    const trackingId=match.params.trackingId;
    useIonViewDidEnter(() => {
      const fetchTimeEntries = async () => {
        setBusy(true);
        const timeEntry: TimesheetModel = await getTimesheetByTrackingId(Number(match.params.trackingId));
        setTimesheet(timeEntry);
        setBusy(false);
      };
  
      fetchTimeEntries();
    });
  
    // Edit the Time Entry
    const editRecord = async () => {
      const canEditOrDelete = await canEditOrDeleteTimesheet(timesheet);
  
      if (!canEditOrDelete.OperationAllowed) {
        showToastMessage(canEditOrDelete.Message);
        return false;
      }
      navigation.push(`/layout/timesheet/update/${timesheet.TrackingId}`);
    };
  
    // Delete the Time Entry ask First
    const showDeleteConfirmation = async () => {
      const validation = await canEditOrDeleteTimesheet(timesheet);
  
      if (!validation.OperationAllowed) {
        showAlertMessage(validation.Message);
        return false;
      }
  
      setShowAlert(true);
    };
  
    // Delete
    const deleteRecord = async () => {
      setBusy(true);
      await deleteTimesheet(timesheet.TrackingId);
      setBusy(false);
      showToastMessage("Timesheet deleted successfully!");
      navigation.push(`/layout/timesheet`);
    };
  
    // Search Users
    const searchUsersToTag = async (searchValue: string): Promise<UserModel[]> => {
      setUserSearch(searchValue);
      if (searchValue.length > 2) {
        const usersList = await searchUsers(searchValue);
        setUsers(usersList);
        return usersList;
      } else {
        setUsers([]);
        return [];
      }
    };
  
    // Tag Others
    const onTagOthers = async () => {
      setShowUserSearch(!showUserSearch);
    };
  
    // Handle Select Users
    const handleSelectUsers = async (selectedUsers: UserModel[]) => {
      setTagedUsers((prevTagedUsers) => [...prevTagedUsers, ...selectedUsers]);
      setUserSearch("");
      const userIds = selectedUsers.map(user => user.UserId); 
      const data  = {
      trackingId: Number(trackingId), 
      userIds: userIds
    };
     setBusy(true)
      await saveTagedTimesheet(data);
      showToastMessage("Users have been successfully tagged!"); 
      navigation.goBack();
  
      setUsers([]);
      setBusy(false)
    };
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="secondary">
            <IonButtons slot="start">
            <IonButton fill='clear'
      onClick={(e)=>{
        navigation.push(`/layout/timesheet/${convertToDDMMYYYYWithoutSeparator(timesheet.TrackingDate)}`,"none","pop")
      }}
      style={{ 
        color: 'white',
      }}
    >
      <IonIcon icon={arrowBack} slot="start" style={{ color: 'white' }} />
      Back
    </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              {isTimeSheetTaggingAllowed && (
                <IonButton size='small' slot='end' onClick={() => onTagOthers()}>
                  <IonIcon icon={pricetagOutline} />
                </IonButton>
              )}
              <IonButton size='small' slot="end" onClick={() => showDeleteConfirmation()}>
                <IonIcon slot="end" icon={trashOutline} />
              </IonButton>
              <IonButton size='small' onClick={() => editRecord()} slot="end">
                <IonIcon slot="start" icon={pencilOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>View Time</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>
  
        <IonContent class="ion-padding">
          <IonList id="listTimeEntry">
            <IonItem>
              <IonLabel position="fixed">Matter</IonLabel>
              <IonLabel className='boldAmount' position="fixed">{timesheet.MatterCode}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Date</IonLabel>
              <IonLabel>{timesheet.TrackingDate}</IonLabel>
            </IonItem>
            {timesheet.MatterActivityId > 0 ? (
              <IonItem>
                <IonLabel position="fixed">Task</IonLabel>
                <IonLabel>{timesheet.MatterActivityName}</IonLabel>
              </IonItem>
            ) : null}
  
            {timesheet.TimeTrackingActivityId > 0 ? (
              <IonItem>
                <IonLabel position="fixed">Activity</IonLabel>
                <IonLabel>{timesheet.TimeTrackingActivityName}</IonLabel>
              </IonItem>
            ) : null}
            <IonItem>
              <IonLabel position="fixed">Billable?</IonLabel>
              {timesheet.IsBillable ? (
                <IonLabel className='boldAmount' color={"success"}>Yes</IonLabel>
              ) : (
                <IonLabel className='boldAmount' color={"danger"}>No</IonLabel>
              )}
            </IonItem>
  
            <IonItem>
              <IonLabel position="fixed">Total Time</IonLabel>
              <IonLabel>{timesheet.TrackedTime}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Billable Time</IonLabel>
              <IonLabel>{timesheet.BillableHour}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Non Billable</IonLabel>
              <IonLabel>{timesheet.NonBillableHour}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel position="fixed">Description</IonLabel>
              <IonText className="small-font">{timesheet.Description}</IonText>
            </IonItem>
          </IonList>
  
         
  
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Delete time entry'}
            message={'Are you sure you want to delete this time entry?'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  setShowAlert(false);
                },
              },
              {
                text: 'Okay',
                handler: deleteRecord,
              },
            ]}
          />
        </IonContent>
        <div>
        <IonModal slot='bottom' isOpen={showUserSearch} onDidDismiss={() => setShowUserSearch(false)} className='modal-style'>
            <IonHeader >
              <IonToolbar color="primary" >
                <IonButtons slot="start">
                  <IonButton onClick={() => setShowUserSearch(false)}>Close</IonButton>
                </IonButtons>
                <IonTitle>Tag Users</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonItem>
                <IonLabel position="stacked">Tag Users</IonLabel>
                <IonInput
                  value={userSearch}
                  placeholder="Search for users to Tag..."
                  onIonInput={(e) => searchUsersToTag(e.detail.value as string)}
                ></IonInput>
              </IonItem>
      
              <UserList users={users} onUsersSelect={handleSelectUsers} />
            </IonContent>
          </IonModal>
          </div>
      </IonPage>
      
    );
  };
  
  export default ViewTimesheet;
  