import React, { useEffect, useState } from 'react';
import { 
  IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText, IonAvatar, IonButton, IonLoading, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonAlert, 
  useIonRouter,
  useIonViewDidEnter,
  IonSelect,
  IonSelectOption,
  IonModal,
  isPlatform,
  IonFab,
  IonFabButton
} from '@ionic/react';
import useExpenseManagement from '../../hooks/useExpenseManagement';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { DropDownItem, ExpenseModel } from '../../types/types';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import { add, briefcaseOutline, calendarOutline, chevronForwardOutline, closeCircleOutline, filter, filterCircle, funnel, funnelOutline, funnelSharp, pencil, personCircleOutline, trash, trashOutline } from 'ionicons/icons';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import FabMenu from '../../components/layouts/FabIcon';
import { messageManager } from '../../components/MassageManager';
import MyProfileHeader from '../../components/MyProfileHeader';
import '../../theme/variables.css'
import withSessionCheck from '../../components/WithSessionCheck';
import FilterModal from '../../components/Filters';

const ExpensePage: React.FC = () => {
    const navigation = useIonRouter();
    const {formatNumber,getDateFilterItems,getPeriodName,DateFilters}=useUIUtilities();
    const { getExpenses, deleteExpense,canEditOrDeleteExpense } = useExpenseManagement();
    const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<ExpenseModel | null>(null);
    const { showToastMessage, showAlertMessage, showConfirmMessage } = messageManager();
    const { sortExpensesByDate } = useUIUtilities();
    const [showFilterAlert, setShowFilterAlert] = useState(false);
    const[dateFilterItems] = useState<DropDownItem[]>(getDateFilterItems())
    const[dateFilterId, setDateFilterId] = useState<number>(DateFilters.ThisMonth)
    const[totalAmount, setTotalAmount] = useState("")
    const[reimbursedAmount, setReimbursedAmount] = useState("")
    const[percentReimbursedAmount, setPercentReimbursedAmount] = useState("")
    const[selectedPeriod, setSelectedPeriod] = useState<string>(getPeriodName(dateFilterId))
    const isIos = isPlatform('ios');

    //Here The List of Expenses
    const getExpense = async () => {
        setIsLoading(true); // Start loading
        try {
          
          const expenseData = await getExpenses(dateFilterId);
          setExpenseSummary(expenseData)     
          setExpenses(expenseData);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
      const handleFilterChange =async (value: number) => {
        console.log(value,"data FilterId")
        setDateFilterId(value);
        setIsLoading(true);
       const period = getPeriodName(value)
       setSelectedPeriod(period)
       const expList= await getExpenses(value);
       
       setExpenseSummary(expList)     
       setExpenses(expList);
       setIsLoading(false);
    };
       
      useIonViewDidEnter(() => {
        (async () => {
         setDateFilterId(DateFilters.ThisMonth)
          const period= getPeriodName(dateFilterId)
         setSelectedPeriod(period)
        // getExpense();
        })();
      });

  
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

    
    const setExpenseSummary = (expCollection: ExpenseModel[]) =>{
        let totalExpAmount: number = 0
        let reimbursedAmount: number = 0 
        expCollection.forEach( (exp: ExpenseModel) => {
          
          totalExpAmount = Number(totalExpAmount) + Number(exp.Amount)
  
          if(exp.PaymentId > 0)
            reimbursedAmount = Number(reimbursedAmount) + Number(exp.Amount)
        })
        const percentReimbursed = totalExpAmount > 0 ?  (reimbursedAmount/ totalExpAmount) * 100 : 0;
        setPercentReimbursedAmount(formatNumber(percentReimbursed))
        setReimbursedAmount(formatNumber(reimbursedAmount))
        setTotalAmount(formatNumber(totalExpAmount))
        console.log("re",reimbursedAmount)
      }


  

    return (
        <IonPage>
          
            <IonHeader>
           
                <IonToolbar color="primary">
              
                    <IonTitle>Expenses</IonTitle>
                    <MyProfileHeader/>
                </IonToolbar>
                <IonToolbar color="none" className="nobottomborder filterBar">
                
                <IonLabel slot="start" class="">
                 <IonLabel><span className="font-bold">#Rec: {expenses.length}</span> | Total: <span className="font-bold total-exp">{totalAmount}</span> | Rei: <span className="billable-hours">{reimbursedAmount} ({percentReimbursedAmount}%)</span> </IonLabel>
               </IonLabel>
                  <IonButtons slot='end' className='btns'>
                        <IonButton style={{}} onClick={() => setShowFilterAlert(true)} className="filterButton" color=""  slot="end" >
                              <IonIcon className='filterIcon' icon={funnel}></IonIcon>
                              <IonLabel className='filterName'>{selectedPeriod}</IonLabel>
                        </IonButton>
                        </IonButtons>
                        
                       


            </IonToolbar>
            </IonHeader>
    
           
            <IonContent>
           <CommonPullToRefresh onRefresh={getExpense}>
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
                                    {isIos ? null :<IonIcon className="action-item" icon={chevronForwardOutline} slot="end"/>}
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
               
               </CommonPullToRefresh>
            </IonContent>
        
            {/* <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={(e)=>{navigation.push("/layout/expense/create" ,"forward")}}>
          <IonIcon icon={add} />
         </IonFabButton>
          </IonFab> */}
          <FabMenu/>
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
                    <IonAlert
                        isOpen={showFilterAlert}
                        onDidDismiss={() => setShowFilterAlert(false)}
                        header={'Select Filter'}
                        inputs={dateFilterItems.map(filterItem => ({
                            name: 'filter',
                            type: 'radio',
                            label: filterItem.Text,
                            value: filterItem.Value,
                            checked: filterItem.Value === dateFilterId,
                        }))}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    setShowFilterAlert(false);
                                }
                            },
                            {
                                text: 'Apply',
                                handler: (value: any) => {
                                    handleFilterChange(value)
                                }
                            }
                        ]}
                    />
        </IonPage>
    );
};

export default withSessionCheck(ExpensePage);
