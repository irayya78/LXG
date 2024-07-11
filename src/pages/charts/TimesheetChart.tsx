import React, { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonLoading,
} from "@ionic/react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { closeOutline } from "ionicons/icons";
import FabMenu from "../../components/layouts/FabIcon";

Chart.register(...registerables, ChartDataLabels);

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    billableHours: string;
    nonBillableHours: string;
    totalTime: string;
  };
}

const TimesheetChartModal: React.FC<TimesheetModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000); 
    }
  }, [isOpen]);

  

  const chartData = {
    labels: ["Billable Hours", "Non-Billable Hours"],
    datasets: [
      {
        data: [
          parseFloat(data.billableHours.replace(" hr(s)", "")),
          parseFloat(data.nonBillableHours.replace(" hr(s)", "")),
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ], 
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.raw;
          },
        },
      }, 
      datalabels: {
        color: '#fff',
        formatter: (value: number) => {
          return value;
        },
      },
    },
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color={"secondary"}>
          <IonTitle>Timesheet Analysis</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading}  message="Please wait..." />
        {!loading && (
          
            <div style={{ height: "300px", padding: "20px" }}>
              <Pie data={chartData} options={options} />
            </div>
        )}
         <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
              <div>
                <p style={{ margin: 0, color: "#000" }}>Total Time</p>
                <p style={{ margin: 0, color: "#3880ff" }}>{data.totalTime} hr(s)</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#000" }}>Billable</p>
                <p style={{ margin: 0, color: "green" }}>{data.billableHours}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#000" }}>Non-Billable</p>
                <p style={{ margin: 0, color: "red" }}>{data.nonBillableHours}</p>
              </div>
            
            </div>
          
            
      </IonContent>
     
    </IonModal>
  );
};

export default TimesheetChartModal;
