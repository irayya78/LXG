import { IonAlert, IonBackButton, IonButton, IonButtons, 
  IonContent, IonHeader, IonIcon, IonItem,  IonLabel, IonList,  IonLoading,  IonPage, 
  IonText, 
  IonTitle, 
  IonToolbar, 
  useIonRouter, 
  useIonViewDidEnter  } from '@ionic/react';
import React, {  useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {attachOutline,  pencilOutline, trashOutline } from 'ionicons/icons';
import { messageManager } from '../../components/MassageManager';
import { ExpenseDocumentModel, ExpenseModel } from '../../types/types';
import useExpenseManagement from '../../hooks/useExpenseManagement';
import './viewExpense.css';

interface ViewExpenseParams extends RouteComponentProps<{expenseId: string; }> {}

const ViewExpense: React.FC<ViewExpenseParams> = ({match}) => {
  
  const navigation =useIonRouter()

  const{deleteExpense, getExpense, getBlankExpenseObject,canEditOrDeleteExpense} = useExpenseManagement()

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
          <IonList  id="listTimeEntry">
              <IonItem>
                  <IonLabel  position="fixed">Matter</IonLabel>
                  <IonLabel className='boldAmount'  position="fixed">{expense.MatterCode}</IonLabel>
              </IonItem>
              <IonItem>
                  <IonLabel position="fixed">Date</IonLabel>
                  <IonLabel>{expense.Date}</IonLabel>
              </IonItem>
              
              <IonItem>
                  <IonLabel position="fixed">Category</IonLabel>
                  <IonLabel>{expense.ExpenseCategory}</IonLabel>                
              </IonItem>
              <IonItem>
            <IonLabel position="fixed">Amount</IonLabel>
            <IonText className='boldAmount'  color={"primary"}>{expense.AmountToDisplay}</IonText>
          </IonItem>

             
              <IonItem>
                  <IonLabel position="fixed">Description</IonLabel>
                  <IonLabel className="small-font">{expense.Description}</IonLabel>
              </IonItem>

              <IonItem>
                  <IonLabel position="fixed">Status</IonLabel>
                  {/* <IonIcon icon={expense.ExpenseStatus.icon} color={expense.ExpenseStatus.color} className="icn-pad-right"></IonIcon> */}
                  <IonLabel>{expense.ApprovalStatus.StatusName}</IonLabel>
              </IonItem>
              {
                  expense.ApprovalStatusId === 4 ? 
                  <IonItem>
                      <IonLabel position="fixed">Comments</IonLabel>
                      <IonLabel>{expense.Comments}</IonLabel>
                  </IonItem> : null
              }
              {
                  expense.ActionBy.UserId > 0 ?
                  <IonItem>
                      <IonLabel position="fixed">Action By</IonLabel>
                      <IonLabel>{expense.ActionBy.FullName}</IonLabel>
                  </IonItem> : null
              }
                   <IonItem>
                          <IonLabel position="fixed">Billable To Client</IonLabel>            
                          <IonText style={{ color: expense.BillableToClient}}>
                            {expense.BillableToClient ? "Yes" : "No"}
                         </IonText>
                         </IonItem>

             <IonItem>
                      <IonLabel position="fixed">Payment Status</IonLabel>
                      <IonLabel>{expense.PaymentId > 0 ? "Reimbursed" : "Not Reimbursed"}</IonLabel>
              </IonItem>
             
             
              {expense.ExpenseDocuments && expense.ExpenseDocuments.map( (expDoc: ExpenseDocumentModel, index: Number)  => (
                  <IonItem key={index.toString()}>
                      
                       <IonLabel position="stacked"></IonLabel>
                       
                       <IonText className="small-font"><IonIcon icon={attachOutline} className="icn-pad-right" color="warning"></IonIcon>{expDoc.DocumentName}</IonText>
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



