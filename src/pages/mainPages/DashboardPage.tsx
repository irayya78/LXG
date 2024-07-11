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
  timeOutline,
  briefcaseOutline,
  cardOutline,
  notificationsOutline,
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
      
    await  renderDashboardData();
    })();
  });
 

  const renderDashboardData = async () => {
    setBusy(true)
    const dashboardData = await getUserDashboardData()
    setBusy(false)
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
    <IonPage>
     
      <IonHeader color="primary">
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <MyProfileHeader />
        </IonToolbar>
      </IonHeader>
      <CommonPullToRefresh onRefresh={renderDashboardData}>
      <IonContent>
      <div className="ion-padding" style={{ textAlign: 'center' }}>
      <h2 className="greeting-text">{greeting}, {session.user?.FirstName}</h2>
      <small style={{ display: 'block', fontSize: '0.5em', marginTop: '0',color:'gray' }}>{currentDate}</small>
      </div>

       
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard  button onClick={() => setTimesheetChartOpen(true)}className="dashboard-card">
                <IonCardHeader className="Ionic-header">
                  <IonCardTitle className="dashboard-card-title"><IonIcon icon={timer} className="icon" /> Timesheet</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="Card-content">
                  <p style={{ color: "#3880ff" }}>{dashboardData.TotalTime} hr(s)</p>
                  <p className="billable-hours">B:{billableHours} ({percentBillable}%)</p>
                  <p className="nonbillable-hours">NB: {nonBillableHours} ({percentNonBillable}%)</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard button onClick={() => navigation.push('/layout/matter')} className="dashboard-card">
                <IonCardHeader className="Ionic-header">
                  <IonCardTitle className="dashboard-card-title"><IonIcon icon={briefcase} className="icon" /> Matters </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="Card-content">
                  <p>Assigned on {dashboardData.MatterCount} new matter(s)</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard button onClick={() => navigation.push('/layout/expense')} className="dashboard-card">
                <IonCardHeader className="Ionic-header">
                  <IonCardTitle className="dashboard-card-title"><IonIcon icon={card} className="icon" /> Expenses</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="Card-content">
                  <p><span style={{ color: "#3880ff" }}>₹{formatNumber(dashboardData.ExpenseAmount)}</span></p>
                  <p className="exp-reimbursed">Rei:{formatNumber(dashboardData.ReimbursedAmount)} ({formatNumber(percentReimbursed)}%)</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard button onClick={getExpanseToApproveOrReject} className="dashboard-card">
                <IonCardHeader className="Ionic-header">
                  <IonCardTitle className="dashboard-card-title"><IonIcon icon={notifications} className="icon" /> Approvals </IonCardTitle>
                </IonCardHeader>
                <IonCardContent  className="Card-content">
                  <p>{dashboardData.NotificationCount} Approval(s)</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>
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

export default DashboardPage;
