import React, { useEffect, useState } from 'react';
import { 
  IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonAvatar, IonButton, IonLoading, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonAlert, 
  useIonRouter,
  useIonViewDidEnter
} from '@ionic/react';
import useExpenseManagement from '../../hooks/useExpenseManagement';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { ExpenseModel } from '../../types/types';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import { briefcaseOutline, calendarOutline, chevronForwardOutline, pencil, personCircleOutline, trash, trashOutline } from 'ionicons/icons';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import FabMenu from '../../components/layouts/FabIcon';
import { useLocation } from 'react-router';
import { messageManager } from '../../components/MassageManager';
import MyProfileHeader from '../../components/MyProfileHeader';
import '../../theme/variables.css'
const ExpensePage: React.FC = () => {
    const navigation = useIonRouter();
    const location = useLocation();
    const { getExpenses, deleteExpense,canEditOrDeleteExpense } = useExpenseManagement();
    const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<ExpenseModel | null>(null);
    const { showToastMessage, showAlertMessage, showConfirmMessage } = messageManager();
    const { sortExpensesByDate } = useUIUtilities();


    //Here The List of Expenses
    const getExpense = async () => {
        setIsLoading(true); // Start loading
        try {
          const expenseData = await getExpenses();
          // Sort expenses by date in descending order
         const sortedExpenses:any=sortExpensesByDate(expenseData)
      
          setExpenses(sortedExpenses);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
   
      
      useIonViewDidEnter(() => {
        (async () => {
        await getExpense();
        })();
      });

    //   useEffect(() => {
    //     getExpense();
    // }, []);

    //Navigation to VIEW-Expense Page 
    const viewExpense = (ExpenseId: number): void => {
        navigation.push(`/layout/expense/view/${ExpenseId}`, 'forward', 'push');
    };
    
    // Navigation For Edit Expense Window 
    const editExpenseByExpenseId = (expense: ExpenseModel): void => {
     const validation = canEditOrDeleteExpense(expense);
     console.log(validation);
    if (!validation.OperationAllowed) {
      // Show validation message
      showAlertMessage(validation.Message);
      return;
    }
        navigation.push(`/layout/expense/update/${expense.ExpenseId}`, 'forward', 'push');
    };

    const confirmDeleteExpense = async () => {
        if (expenseToDelete) {
            try {
                await deleteExpense(expenseToDelete.ExpenseId);
                showToastMessage("Expense deleted successfully!");
                setExpenses(expenses.filter(e => e.ExpenseId !== expenseToDelete.ExpenseId));
                navigation.push('/layout/expense','back','push');
            } catch (error) {
                console.error('Error deleting expense:', error);
            } finally {
                setShowAlert(false);
                setExpenseToDelete(null);
            }
        }
    };

    const showDeleteConfirm = (expense: ExpenseModel): void => {

      const validation = canEditOrDeleteExpense(expense);
    
    if (!validation.OperationAllowed) {
      // Show validation message
      showAlertMessage(validation.Message);
      return;
    }
        setExpenseToDelete(expense);
        setShowAlert(true);
    };

    return (
        <IonPage>
          
            <IonHeader>
           
                <IonToolbar color="primary">
              
                    <IonTitle>Expenses</IonTitle>
                    <MyProfileHeader/>
               
                </IonToolbar>
               
            </IonHeader>
            <CommonPullToRefresh onRefresh={getExpense}>
            <IonContent>
            
            
                    <IonList >
                        {expenses && expenses.map((expense: ExpenseModel) => (
                            <IonItemSliding key={expense.ExpenseId.toString()}>
                                   <IonItem key={expense.ExpenseId?.toString()} button  onClick={() => viewExpense(expense.ExpenseId)}>
                                    <IonLabel className="ion-text-wrap">
                                    <span className="matter-Code-font">
                                    <IonIcon icon={briefcaseOutline}/>&nbsp;
                                    {expense.MatterCode} | {expense.MatterTitle}
                                        </span>
                                        
                                        <span className="work-done-desc">
                                        <IonIcon icon={calendarOutline}/> {expense.Date} - {expense.ExpenseCategory}
                                        </span>
                                       
                                        <h2 className="small-font"> <IonIcon icon={personCircleOutline}/>&nbsp;{expense.Client} </h2>
                                    </IonLabel>
                                    <IonText className="time-text" slot="end">
                                        <p className="total-time">{(expense.AmountToDisplay)}</p>
                                    </IonText>
                                   
                                </IonItem>
                                <IonItemOptions side="end">
                                    <IonItemOption onClick={() => showDeleteConfirm(expense)} color="danger">
                                        <IonIcon icon={trash}></IonIcon>
                                    </IonItemOption>
                                </IonItemOptions>
                                <IonItemOptions onClick={() => editExpenseByExpenseId(expense)} side="start">
                                    <IonItemOption color="success">
                                        <IonIcon icon={pencil}></IonIcon>
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        ))}
                    </IonList>
                    <IonLoading isOpen={isLoading} message={'Please wait...'} duration={0} />
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header={'Delete Expense'}
                        message={'Are you sure you want to delete this expense?'}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    setShowAlert(false);
                                }
                            },
                            {
                                text: 'Okay',
                                handler: confirmDeleteExpense
                            }
                        ]}
                    />
               
               
            </IonContent>
            </CommonPullToRefresh>
            <FabMenu/>
        </IonPage>
    );
};

export default ExpensePage;
