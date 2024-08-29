import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonTabButton, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { ExpenseModel, LeaveModel } from '../../types/types';
import useExpenseManagement from '../../hooks/useExpenseManagement';
import useLeaveManagement from '../../hooks/useLeaveManagement';
import { checkmark, checkmarkCircle, checkmarkCircleOutline, closeCircle, closeOutline, colorFill } from 'ionicons/icons';
import useApprovalManagement from '../../hooks/useApprovalManagement';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { messageManager } from '../../components/MassageManager';


interface ViewApprovalParams extends RouteComponentProps<{type: string; id: string; }> {}

const  ViewApprove: React.FC<ViewApprovalParams> = ({match}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {getExpense,getBlankExpenseObject} = useExpenseManagement();
    const [expense, setExpense] = useState<ExpenseModel>(getBlankExpenseObject())
    const { getBlankLeaveObject,getLeave} = useLeaveManagement();
    const [leave, setLeave] = useState<LeaveModel>(getBlankLeaveObject());
    const [isExpense ,setType] = useState<boolean>(false);
    const navigation = useIonRouter();
    const [comment, setComment] = useState<string>('');
    const {expenseApprovalAction,leaveApprovalAction} = useApprovalManagement();
    const{showToastMessage}=messageManager()

    useIonViewDidEnter(() => {
        (async () => {
            setIsLoading(true)
            if(match.params.type === 'Exp'){
                const exp: ExpenseModel = await getExpense(Number(match.params.id));
                setExpense(exp);
            }else{
                const lev: LeaveModel = await getLeave(Number(match.params.id));  
                setLeave(lev);
            }
            const isExpense = match.params.type === 'Exp';
            setType(isExpense);
            setIsLoading(false)
        })();
    });
    
    const doApprovalAction = async (id : string,statusId : number) : Promise<void> =>{
        const commentToUse = comment.trim() === '' ? '-' : comment;
        let isSuccess = false; 
        if(isExpense){
            const expenseAprroval = await expenseApprovalAction(id,statusId,commentToUse);
            isSuccess = expenseAprroval; 
                 
        }
        else{
            const leaveAprroval = await leaveApprovalAction(id,statusId,commentToUse);
            isSuccess = leaveAprroval;
        }
        if (isSuccess) {
            navigation.push("/layout/dashboard/view-approvals",'forward','push');
            showToastMessage('Action Successfully Done')
            
          } else {
            navigation.push("/layout/dashboard/view-approvals",'back');
          }  
      }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/layout/dashboard/view-approvals" />
                    </IonButtons>
                    <IonTitle>Approver Details</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonLoading isOpen={isLoading} message={'Please wait...'}duration={0}/>
                
                <IonList className='detail-none'>
                    <IonItem>
                        <IonLabel>Submitted By</IonLabel>
                        <IonLabel>{isExpense ? expense.CreatedByName : leave.UserName }</IonLabel>
                    </IonItem>
                    {isExpense && (
                    <>
                        <IonItem>
                            <IonLabel>Matter</IonLabel>
                            <IonLabel>{expense.MatterCode}<br/><span className='card-title'>{expense.MatterTitle}</span></IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Client</IonLabel>
                            <IonLabel>{expense.Client}</IonLabel>
                        </IonItem>
                    </>
                    )}
                    <IonItem>
                        <IonLabel>Type</IonLabel>
                        <IonLabel>{isExpense ? 'Reim' : leave.LeaveTypeName }</IonLabel>
                        
                            {/* {expense.PaymentId > 0 ? "Reimbursed" : "Not Reimbursed"}  */}                           
                    </IonItem>
                    <IonItem>
                        <IonLabel>Date</IonLabel>
                        <IonLabel>{isExpense ? expense.Date : leave.LeaveFromDateToToDate }</IonLabel>
                    </IonItem>
                    {isExpense ? (
                        <>
                            <IonItem>
                                <IonLabel>Category</IonLabel>
                                <IonLabel>{expense.ExpenseCategory} </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Amount</IonLabel>
                                <IonLabel>{expense.AmountToDisplay}</IonLabel>
                            </IonItem>
                        </>
                    ):(
                    <IonItem>
                        <IonLabel>Leaves</IonLabel>
                        <IonLabel>{leave.LeaveCount}</IonLabel>
                    </IonItem>
                    )}                    
                    <IonItem>
                        <IonLabel>Description</IonLabel>
                        <IonLabel>{isExpense ? expense.Description : leave.Description }</IonLabel>
                    </IonItem>
                    
                    <IonItem className='remove-border comments' color={'comments'}>
                        <IonLabel position="stacked" className='large-text'>Comment</IonLabel>
                        <IonTextarea
                            value={comment}
                            placeholder="Enter min 5 characters"
                            onIonInput={(e) => setComment(e.detail.value as string)}
                            rows={3}
                        />                          
                    </IonItem>

                    <IonItem className="button-group remove-border">
                        <IonButton className='actionBtn' expand="block" onClick={() => doApprovalAction(match.params.id,4)} color="danger"> <IonIcon slot="start" icon={closeCircle}  />Reject</IonButton>
                        <IonButton  className='actionBtn'  expand="block" onClick={() => doApprovalAction(match.params.id,3)} color="success"><IonIcon color='light' slot="start" icon={checkmarkCircle}  />Approve</IonButton>
                    </IonItem>
                </IonList>
            </IonContent>
            
        </IonPage>
    );
};

export default ViewApprove;