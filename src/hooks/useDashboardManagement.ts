import axiosInstance from "../apiHelper/axiosInstance";
import { useSessionManager } from "../sessionManager/SessionManager";
import { UserSessionDetails } from "../types/types";

export function useDashboardManagement() {


    const session =useSessionManager();


const getUserDashboardData = async  () : Promise<any> => {
    
        const resp = await axiosInstance.get("/GetUserDashboardData/" + session.user?.UserId)
        const dashboardData : any =  
        {
                BillableTime : resp.data.billableTime,
                NonBillableTime : resp.data.nonBillableTime,
                TotalTime : resp.data.totalTime,
                ExpenseAmount : resp.data.expenseAmount,
                ReimbursedAmount: resp.data.reimbursedAmount != null ? resp.data.reimbursedAmount : 0,
                DocumentUploaded : resp.data.documentUploaded,
                MatterCount : resp.data.matterCount,
                NotificationCount : resp.data.notificationCount !== null ? resp.data.notificationCount : 0
        }

        return dashboardData
   };

   const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
          return 'Good Morning';
        } else if (currentHour < 16) {
          return 'Good Afternoon';
        } else {
          return 'Good Evening';
        }
      };
    
      

    
return {
        getUserDashboardData ,getGreeting
  };

  
}
