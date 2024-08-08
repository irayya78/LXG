import axiosInstance from '../apiHelper/axiosInstance';
import { useSessionManager } from '../sessionManager/SessionManager';
import { getBlankUserObject, NotificationModel} from '../types/types';
import useExpenseManagement from '../hooks/useExpenseManagement';
import useLeaveManagement from '../hooks/useLeaveManagement';

const useApprovalManagement = () => {
    const session = useSessionManager();
    const { getBlankExpenseObject } = useExpenseManagement();
    const { getBlankLeaveObject } = useLeaveManagement();


    const getApprovals = async (): Promise<NotificationModel[]> => {
        
        const approvalList= await axiosInstance.get(`/GetNotifications/${session.user?.CustomerId}/${session.user?.UserId}`)
        console.log("approvalList",approvalList);
        const approvalArray: NotificationModel[] = [];
        if(approvalList.data != null && approvalList.data.length > 0){
            approvalList.data.forEach((element : any) => {
                console.log("element",element);
                const tempapproval : NotificationModel = getApprovalObject(element)
                approvalArray.push(tempapproval)
            })
            return approvalArray;
        }else 
        return approvalArray;
    };

    const getApprovalObject = (element: any): NotificationModel => {
        let Obj : NotificationModel = getBlankApprovalObject()

        Obj = {
            Id: element.id !== null ? element.id : 0,
            Name: element.associateName,
            Type: element.type,
            Description: element.description,
            Date: element.date,
            DateToDisplay:element.dateToDisplay
            // CustomerId : Number(element.customerId),
            // Date : element.date,
            // Description : element.description,
            // IsActionable : element.isActionable,
            // IsActive : element.isActive,
            // Module : (element.module),
            // ModuleId : element.moduleId,
            // NotificationId : element.notificationId,
            // PrimaryId : element.primaryId,
            // Subscriber : element.subscriber,
            // SubscriberUserId : element.subscriberUserId,
            // User : element.user ,
            // // !== null ? {UserId:element.leave.approver., FirstName:expense.approvedByUser.firstName, FullName:expense.approvedByUser.associateName, LastName:expense.approvedByUser.lastName, Password: "", EmailOTP:"", Email:"" } : getBlankUserObject(),
            // UserId : element.userId,
            // Expense : element.expense,
            // Leave : element.leave
        }
            
        return Obj;
    };

    const getBlankApprovalObject = (): NotificationModel  => {

        const obj : NotificationModel =  {
            Id: 0,
            Name: '',
            Type: '',
            Description: '',
            Date: '',
            DateToDisplay:''
        }
      
        return obj;
    };

    const expenseApprovalAction = async (id: string, statusId: number, comment: string) => {
        console.log("C",comment)
        try {
            await axiosInstance.get(`/ExpenseApprovalAction/${id}/${statusId}/${session?.user?.UserId}/${comment}`);
            return true;
        } catch (error) {
            console.error('Error approvaling expense:', error);
            return false;
        }
    };

    const leaveApprovalAction = async (id: string, statusId: number, comment: string) => {
        comment.length <=0 ?comment="Hi":comment=comment
        console.log("c",comment)
    
        try {
            await axiosInstance.get(`/LeaveApprovalAction/${id}/${statusId}/${session?.user?.UserId}/${comment}`);
            return true;
        } catch (error) {
            console.error('Error approvaling leave:', error);
            return false;
        }
    };
    

    

    return {
        getApprovals,expenseApprovalAction,leaveApprovalAction
        
    };
};



export default useApprovalManagement;