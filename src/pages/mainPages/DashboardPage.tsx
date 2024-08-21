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
  IonIcon,
  IonButton
} from "@ionic/react";
import {
  notifications,
  card,
  briefcase,
  timer,
  menuOutline,
  notificationsCircle
} from "ionicons/icons";
import { useEffect, useState } from "react";
import MyProfileHeader from "../../components/MyProfileHeader";
import { useUIUtilities } from "../../hooks/useUIUtilities";
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useDashboardManagement } from "../../hooks/useDashboardManagement";
import CommonPullToRefresh from "../../components/CommonPullToRefreshProps";
import FabMenu from "../../components/layouts/FabIcon";
import withSessionCheck from "../../components/WithSessionCheck";
import DashboardWidgets from "../../components/DashBoardWidgets";
import { DashboardModel } from "../../types/types";
import DynamicChartModal from "../charts/DynamicChart";

const DashboardPage: React.FC = () => {
  const session = useSessionManager();
  const navigation = useIonRouter();

console.log("render")
  const {
    convertDecimalToHHMMFormat,
    convertHHMMFormatToDecimal,
    formatNumber,
    getCurrentDateAsString,
    connvertDateToMMMDDYYYY
  } = useUIUtilities();
  const { getUserDashboardData1,getGreeting } = useDashboardManagement();
  const [billableHours, setBillableHours] = useState<string>("0:00");
  const [nonBillableHours, setNonBillableHours] = useState<string>("0:00");
  const [percentBillable, setPercentBillable] = useState<string>("");
  const [percentNonBillable, setPercentNonBillable] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<any>("");
  const [percentReimbursed, setPercentReimbursed] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);
  const [isChartOpen, setChartOpen] = useState(false);
  const [tittle,setTittle]=useState<string>("")
  const [dashboardData, setDashboardData] = useState<DashboardModel[]>([]);
  const [chartData,setChartData] =useState<DashboardModel>();
 
  const greeting = getGreeting();
  
  useIonViewDidEnter(() => {
    (async () => {
    
      setCurrentDate(connvertDateToMMMDDYYYY(getCurrentDateAsString()))
      setBusy(true)
     await  renderDashboardData();
    setBusy(false)
    })();
  });
 
 
 const renderDashboardData = async () => {
    const dashboardData1:DashboardModel[] = await getUserDashboardData1()
    setDashboardData(dashboardData1);
 
  }

  const handelCardClick=(data:DashboardModel)=>(event: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => 
  {
    setChartData(data)
    setChartOpen(true)
  }
  return (
    <IonPage style={{background:"#fff"}}>
     <IonLoading isOpen={ busy} message={"Please wait..."} />
      <IonHeader color="primary">
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
          <MyProfileHeader />
        </IonToolbar>
      </IonHeader>
      <CommonPullToRefresh onRefresh={renderDashboardData}>
      <IonContent className="page-content">
      {/* <IonButton  fill="clear" color={"primary"} size="small" shape="round" slot="" onClick={(e)=>{navigation.push('/layout/dashboard/view-approvals','forward','push')}}><IonIcon icon={notificationsCircle}></IonIcon></IonButton> */}
      <div className="ion-padding" style={{ textAlign: 'center' }}>
      <h2 className="greeting-text">{greeting}, {session.user?.FirstName}</h2>
      <small style={{ display: 'block', fontSize: '0.6em', marginTop: '0',color:'gray' }}>{currentDate}</small>
      </div>
      
        <IonGrid>
          <IonRow>
          {dashboardData.map((data, index) => (
            <IonCol size="6" key={index}>
            <DashboardWidgets
                key={index}
                title={data.name}
                isClickAble={data.isClickAble}
                bgicon={data.cardIconURL}   
                content={data.content} 
                htmlData={data.htmlData}
                onClick={handelCardClick(data)} 
                />
           
            </IonCol>
             ))}
           </IonRow>
        </IonGrid>
       
      </IonContent>
      </CommonPullToRefresh>

      <DynamicChartModal
        isOpen={isChartOpen}
        onClose={() => setChartOpen(false)}
        data={chartData}
      />

      <FabMenu/>
    </IonPage>
  );
};

export default withSessionCheck(DashboardPage);
