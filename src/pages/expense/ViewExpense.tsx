import { IonAlert, IonBackButton, IonButton, IonButtons, 
  IonContent, IonHeader, IonIcon, IonItem,  IonLabel, IonList,  IonLoading,  IonPage, 
  IonText, 
  IonTitle, 
  IonToolbar, 
  useIonRouter, 
  useIonViewDidEnter  } from '@ionic/react';
import React, {  useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {attachOutline,  download,  pencilOutline, saveSharp, trashOutline } from 'ionicons/icons';
import { messageManager } from '../../components/MassageManager';
import { ExpenseDocumentModel, ExpenseModel } from '../../types/types';
import useExpenseManagement from '../../hooks/useExpenseManagement';
// import './viewExpense.css';
import { useSessionManager } from '../../sessionManager/SessionManager';

interface ViewExpenseParams extends RouteComponentProps<{expenseId: string; }> {}

const ViewExpense: React.FC<ViewExpenseParams> = ({match}) => {
  
  const navigation =useIonRouter();
  const session=useSessionManager();
  const{deleteExpense, getExpense, getBlankExpenseObject,canEditOrDeleteExpense,getExpenseDocument} = useExpenseManagement()

  const[showAlert, setShowAlert] = useState<boolean>(false)

  const[busy, setBusy] = useState<boolean>(false)

  const[expense, setExpense] = useState<ExpenseModel>(getBlankExpenseObject())
  const { showToastMessage, showAlertMessage, showConfirmMessage } = messageManager();

  //When this page  will enter or load
  useIonViewDidEnter(() => {
    const fetchExpense = async () => {
      setBusy(true);
      const exp: ExpenseModel = await getExpense(Number(match.params.expenseId));
    
      setExpense(exp);
      setBusy(false);
    };

    fetchExpense();
  });
  //Alter Box
  const showDeleteConfirm = () => {
    const validation = canEditOrDeleteExpense(expense);
     console.log(validation);
    if (!validation.OperationAllowed) {
      // Show validation message
      showAlertMessage(validation.Message);
      return;
    }

    // If operation is allowed, show alert
   setShowAlert(true)
  };
  const deleteRecord = async () =>{
      setBusy(true)
      await deleteExpense(expense.ExpenseId)
      setBusy(false)
      navigation.push('/layout/expense','back','push');
  }

  const editExpense = () =>{
     //Sending the data of expense to the Update page With expense Id
    const validation = canEditOrDeleteExpense(expense)
    console.log(validation);
    if (!validation.OperationAllowed) {
     
      showAlertMessage(validation.Message);
      return;
    }

    navigation.push(`/layout/expense/update/${expense.ExpenseId}`, 'forward', 'push');
  }

  const handelDownloadDocument = async(docId:number)=>{

    await getExpenseDocument(docId)
    
  }

  return (
      <IonPage>
          <IonHeader>
          <IonToolbar color="secondary">
          <IonButtons slot="start">

         <IonButtons>
          <IonBackButton defaultHref='/layout/expense'></IonBackButton>
         </IonButtons>

          </IonButtons>
         
          <IonButtons slot="end">

              <IonButtons slot="secondary" >
                  <IonButton size='small'  slot="end" onClick={() => showDeleteConfirm()} > <IonIcon  slot="start" icon={trashOutline}  /></IonButton>
                  <IonButton size='small' onClick={() => editExpense()}  slot="end" > <IonIcon  slot="start" icon={pencilOutline}  /></IonButton>
              </IonButtons>

          </IonButtons>
          
          <IonTitle>View Expense</IonTitle>
      </IonToolbar>
      
          </IonHeader>
          <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>

          <IonContent  class="ion-padding">
          <IonList   id="view-exp">
              <IonItem>
                  <IonLabel className='small-font'  position="fixed">Matter</IonLabel>
                  <IonLabel  className='boldAmount view-lable'  position="fixed">{expense.MatterCode}</IonLabel>
              </IonItem>
              <IonItem>
                  <IonLabel className='small-font' position="fixed">Date</IonLabel>
                  <IonLabel className='view-lable'>{expense.Date}</IonLabel>
              </IonItem>
              
              <IonItem>
                  <IonLabel className='small-font' position="fixed">Category</IonLabel>
                  <IonLabel className='view-lable' >{expense.ExpenseCategory}</IonLabel>                
              </IonItem>
              <IonItem>
            <IonLabel className='small-font' position="fixed">Amount</IonLabel>
            <IonText className='boldAmount view-lable'  color={"primary"}>{expense.AmountToDisplay}</IonText>
          </IonItem>

             
              <IonItem>
                  <IonLabel className='small-font' position="fixed">Description</IonLabel>
                  <IonLabel className="small-font view-lable">{expense.Description}</IonLabel>
              </IonItem>

              <IonItem>
                  <IonLabel className='small-font' position="fixed">Status</IonLabel>
                  {/* <IonIcon icon={expense.ExpenseStatus.icon} color={expense.ExpenseStatus.color} className="icn-pad-right"></IonIcon> */}
                  <IonLabel className='view-lable'>{expense.ApprovalStatus.StatusName}</IonLabel>
              </IonItem>
              {
                  expense.ApprovalStatusId === 4 ? 
                  <IonItem>
                      <IonLabel position="fixed">Comments</IonLabel>
                      <IonLabel className='view-lable'>{expense.Comments}</IonLabel>
                  </IonItem> : null
              }
              {
                  expense.ActionBy.UserId > 0 ?
                  <IonItem>
                      <IonLabel className='small-font' position="fixed">Action By</IonLabel>
                      <IonLabel className='view-lable'>{expense.ActionBy.FullName}</IonLabel>
                  </IonItem> : null
              }
                   <IonItem>
                          <IonLabel className='small-font' position="fixed">Billable To Client</IonLabel>            
                          <IonLabel className='view-lable' style={{ color: expense.BillableToClient}}>
                            {expense.BillableToClient ? "Yes" : "No"}
                         </IonLabel>
                         </IonItem>

             <IonItem>
                      <IonLabel className='small-font' position="fixed">Payment Status</IonLabel>
                      <IonLabel className='view-lable'>{expense.PaymentId > 0 ? "Reimbursed" : "Not Reimbursed"}</IonLabel>
              </IonItem>
  
             {session.user?.DisplayExpenseApprover ?
                <IonItem>
                    <IonLabel className='small-font' position="fixed">Approver</IonLabel>
                    <IonLabel className='view-lable'>{expense.ApproverName ? expense.ApproverName : "No Approver"}</IonLabel>
                </IonItem>:null
             }
             
             
             
             
              {expense.ExpenseDocuments && expense.ExpenseDocuments.map( (expDoc: ExpenseDocumentModel, index: Number)  => (
                  <IonItem key={index.toString()}>
                      
                       <IonLabel position="stacked"></IonLabel>
                       
                       <IonText onClick={(e)=>{handelDownloadDocument(expDoc.DocumentId as number)}} className="small-font"><IonIcon icon={download} className="icn-pad-right" color="warning"></IonIcon>{expDoc.DocumentName}</IonText>
                   </IonItem>
              ))}                
          </IonList>

      
          <IonAlert isOpen={showAlert}
          onDidDismiss={() => {}}
          message={'Are you sure you want to delete this expense?'}
          buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: blah => {
              setShowAlert(false)
            }
          },
          {
            text: 'Delete',
            handler: async () => {
              await deleteRecord()
            }
          }
        ]}
      />

          </IonContent>

      </IonPage>
    );
};

export default ViewExpense;



