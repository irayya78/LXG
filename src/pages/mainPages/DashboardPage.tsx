import {
  useIonViewDidEnter,
  IonPage,
  IonLoading,
  IonHeader,
  IonContent,
  IonLabel,
  useIonRouter,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from "@ionic/react";
import {
  notifications,
  card,
  briefcase,
  timer
} from "ionicons/icons";
import { useEffect, useState } from "react";
import MyProfileHeader from "../../components/MyProfileHeader";
import { useUIUtilities } from "../../hooks/useUIUtilities";
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useDashboardManagement } from "../../hooks/useDashboardManagement";
import CommonPullToRefresh from "../../components/CommonPullToRefreshProps";
import FabMenu from "../../components/layouts/FabIcon";
import TimesheetChartModal from "../charts/TimesheetChart";
import withSessionCheck from "../../components/WithSessionCheck";
import ContentLoader from "react-content-loader";
import DashboardWidgets from "../../components/DashBoardWidgets";


const DashboardPage: React.FC = () => {
  const session = useSessionManager();
  const navigation = useIonRouter();
  const [dashboardData, setDashboardData] = useState<any>({
    MatterCount: 0,
    DocumentUploaded: 0,
    ExpenseAmount: 0,
    ReimbursedAmount: 0,
    TotalTime: "0:00",
    NonBillableTime: 0,
    BillableTime: 0,
    NotificationCount: 0
  });
console.log("render")
  const {
    convertDecimalToHHMMFormat,
    convertHHMMFormatToDecimal,
    formatNumber,
    getCurrentDateAsString,
    connvertDateToMMMDDYYYY
  } = useUIUtilities();
  const { getUserDashboardData,getGreeting } = useDashboardManagement();
  const [billableHours, setBillableHours] = useState<string>("0:00");
  const [nonBillableHours, setNonBillableHours] = useState<string>("0:00");
  const [percentBillable, setPercentBillable] = useState<string>("");
  const [percentNonBillable, setPercentNonBillable] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<any>("");
  const [percentReimbursed, setPercentReimbursed] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);
  const [isTimesheetChartOpen, setTimesheetChartOpen] = useState(false);
  const greeting = getGreeting();
  const getExpanseToApproveOrReject = async () => {
   
  }
  useIonViewDidEnter(() => {
    (async () => {
    
      setCurrentDate(connvertDateToMMMDDYYYY(getCurrentDateAsString()))
      setBusy(true)
    await  renderDashboardData();
    setBusy(false)
    })();
  });
 

  const renderDashboardData = async () => {
   
    const dashboardData = await getUserDashboardData()
    
    const billableHoursAsNum = dashboardData.BillableTime
    const nonBillableHoursAsNum = dashboardData.NonBillableTime
    const totalTimeAsNum = convertHHMMFormatToDecimal(String(dashboardData.TotalTime))
    const percentBillable = totalTimeAsNum > 0 ? (Number(billableHoursAsNum) / totalTimeAsNum) * 100 : 0
    const percentNonBillable = totalTimeAsNum > 0 ? (Number(nonBillableHoursAsNum) / totalTimeAsNum) * 100 : 0
    const percentageReimbursed = dashboardData.ExpenseAmount > 0 ? (Number(dashboardData.ReimbursedAmount) / dashboardData.ExpenseAmount) * 100 : 0

    setBillableHours(convertDecimalToHHMMFormat(Number(billableHoursAsNum)))
    setNonBillableHours(convertDecimalToHHMMFormat(Number(nonBillableHoursAsNum)))
    setPercentReimbursed(percentageReimbursed)
    setPercentNonBillable(formatNumber(percentNonBillable))
    setPercentBillable(formatNumber(percentBillable))
    setDashboardData(dashboardData)
  }

  return (
    <IonPage style={{background:"#fff"}}>
     
      <IonHeader color="primary">
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <MyProfileHeader />
        </IonToolbar>
      </IonHeader>
      <CommonPullToRefresh onRefresh={renderDashboardData}>
      <IonContent className="page-content">
      <div className="ion-padding" style={{ textAlign: 'center' }}>
      <h2 className="greeting-text">{greeting}, {session.user?.FirstName}</h2>
      <small style={{ display: 'block', fontSize: '0.6em', marginTop: '0',color:'gray' }}>{currentDate}</small>
      </div>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
            <DashboardWidgets
           title="Timesheet"
           icon={timer}
           busy={busy}
           bgicon={"https://cdn0.iconfinder.com/data/icons/linely-time/64/fast_speed_time_duration_stopwatch-64.png"}
           onClick={() => setTimesheetChartOpen(true)}
           content={
            <>
              <p style={{ color: "#3880ff" }}>{dashboardData.TotalTime} hr(s)</p>
              <p className="billable-hours">B: {billableHours} ({percentBillable}%)</p>
              <p className="nonbillable-hours">NB: {nonBillableHours} ({percentNonBillable}%)</p>
            </>
          }
        />
            </IonCol>
            <IonCol size="6">
            <DashboardWidgets
             title="Matters"
             icon={briefcase}
             busy={busy}
             bgicon={"https://cdn4.iconfinder.com/data/icons/web-ui-9/512/608-_breifcase__suitcase__bag_-64.png"}
             onClick={() => navigation.push('/layout/matter')}
             content={<p>Assigned on {dashboardData.MatterCount} new matter(s)</p>}
            />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
            <DashboardWidgets
             title="Expenses"
             icon={briefcase}
             busy={busy}
             bgicon={"https://cdn4.iconfinder.com/data/icons/wallet-7/512/wallet-money-09-64.png"}
             onClick={() => navigation.push('/layout/expense')}
             content={
              <>
              <p><span style={{ color: "#3880ff" }}>₹ {formatNumber(dashboardData.ExpenseAmount)}</span></p>
              <p className="exp-reimbursed">Rei: {formatNumber(dashboardData.ReimbursedAmount)} ({formatNumber(percentReimbursed)}%)</p>
             </>}
            />
            </IonCol>
            <IonCol size="6">
            <DashboardWidgets
             title="Approvals"
             icon={notifications}
             busy={busy}
             bgicon={"https://cdn1.iconfinder.com/data/icons/miscellaneous-268-line/128/endorsement_approval_support_favor_testimonial_feedback-64.png"}
             onClick={getExpanseToApproveOrReject}
             content={<p>{dashboardData.NotificationCount} Approval(s)</p>}
            />
            </IonCol>
          </IonRow>
        </IonGrid>
       
      </IonContent>
      </CommonPullToRefresh>
      <TimesheetChartModal
        isOpen={isTimesheetChartOpen}
        onClose={() => setTimesheetChartOpen(false)}
        data={{
          billableHours: billableHours,
          nonBillableHours: nonBillableHours,
          totalTime: dashboardData.TotalTime,
        }}
      />
      <FabMenu/>
    </IonPage>
  );
};

export default withSessionCheck(DashboardPage);
