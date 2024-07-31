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
        
        const approvalList= await axiosInstance.get(`/GetLeaves/${session.user?.CustomerId}/${session.user?.UserId}`)
        const approvalArray: NotificationModel[] = [];
        if(approvalList.data != null && approvalList.data.length > 0){
            approvalList.data.forEach((element : any) => {
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
            CustomerId : Number(element.CustomerId),
            Date : element.Date,
            Description : element.Description,
            IsActionable : element.IsActionable,
            IsActive : element.IsActive,
            Module : (element.Module),
            ModuleId : element.ModuleId,
            NotificationId : element.NotificationId,
            PrimaryId : element.PrimaryId,
            Subscriber : element.Subscriber,
            SubscriberUserId : element.SubscriberUserId,
            User : element.User,
            UserId : element.UserId,
            Expense : element.Expense,
            Leave : element.Leave
        }
            
        return Obj;
    };

    const getBlankApprovalObject = (): NotificationModel  => {

        const obj : NotificationModel =  {
            CustomerId: 0,
            Date: '',
            Description: '',
            IsActionable: false,
            IsActive: false,
            Module: {ModuleId:0, ModuleName:""},
            ModuleId: 0,
            NotificationId: 0,
            PrimaryId: 0,
            Subscriber: getBlankUserObject(),
            SubscriberUserId: 0,
            User: getBlankUserObject(),
            UserId: 0,
            Expense: getBlankExpenseObject(),
            Leave: getBlankLeaveObject()
        }
      
        return obj;
    };
    

    return {
        getApprovals
        
    };
};



export default useApprovalManagement;