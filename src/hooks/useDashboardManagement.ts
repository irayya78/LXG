import axiosInstance from "../apiHelper/axiosInstance";
import { useSessionManager } from "../sessionManager/SessionManager";
import { DashboardModel, ReportModel, UserSessionDetails } from "../types/types";

export function useDashboardManagement() {


    const session =useSessionManager();


const getUserDashboardData = async  () : Promise<any> => {
    
        const resp = await axiosInstance.get("/GetUserDashboardData1/" + session.user?.UserId)
        console.log("Report response:-",resp.data)
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

   const getUserDashboardData1 = async (): Promise<DashboardModel[]> => {
  
      const { data } = await axiosInstance.get(`GetUserDashboardData1/${session.user?.UserId}/${session.user?.CustomerId}`);
      console.log("Report response:-", data);
  
      const dashboards: DashboardModel[] = data.map((report: ReportModel) => mapReportToDashboard(report));
      return dashboards;
  }
  
  const mapReportToDashboard = (report: ReportModel): DashboardModel => {
    if (!report.reportData) {
      throw new Error("Report data is missing");
    }
  
    const reportSummaryItems = report.reportData.reportSummary?.reportSummaryItems || [];
    const rows = report.reportData.rows || [];

  
    return {
      name: report.name ?? "Unknown",
      recordCount:report.reportData?.reportSummary?.recordCount||0,
      content: reportSummaryItems, 
      cardIconURL: report.mobileAppCardIconURL ?? "",
      chartTypeId: report.chartTypeId ?? null,
      charTypeColor: report.chartTypeColor ?? null,
       isClickAble: report.enableOnClickFunctionInMobile,
       rows: rows
       
       
    };
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
        getUserDashboardData ,getGreeting,getUserDashboardData1
  };

  
}
