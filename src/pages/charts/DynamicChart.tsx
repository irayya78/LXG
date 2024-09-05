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
  IonItem,
} from "@ionic/react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { closeOutline } from "ionicons/icons";
import { DashboardModel } from "../../types/types";
import { useSessionManager } from "../../sessionManager/SessionManager";
import FabMenu from "../../components/layouts/FabIcon";

Chart.register(...registerables, ChartDataLabels);

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardModel | undefined;
}

const DynamicChartModal: React.FC<ChartModalProps> = ({
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

const session =useSessionManager();
    const themeColors=  session.user?.ChartThemColors

  const extractChartData = (data: DashboardModel|undefined) => {
    if (!data || !data.rows.length) {
        return {
            labels: [],
            datasets: [{ data: [], backgroundColor: [] }]
        };
    }

    // Find the first row to identify dynamic field names
    const firstRow = data.rows[0];
    const typeField = firstRow.cells.find(cell => !cell.isNumericValue)?.name;
    const valueField = firstRow.cells.find(cell => cell.isNumericValue)?.name;

    if (!typeField || !valueField) {
        return {
            labels: [],
            datasets: [{ data: [], backgroundColor: [] }]
        };
    }

    return {
        labels: data.rows.map(row => 
            row.cells.find(cell => cell.name === typeField)?.displayValue || ""
        ),
        datasets: [
            {
                data: data.rows.map(row => 
                    (row.cells.find(cell => cell.name === valueField)?.value || "0")
                ),
                backgroundColor: [ "#36A2EB","#FF6384"],

                // themeColors?.split(',')
            },
        ],
    };
};


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value: number) => {
          return value;
        },
      },
    },
  };

  const chartData =extractChartData(data)

  const renderChart = () => {
    if (!data) return null;
    if (data.chartTypeId === 6) {
      return <Doughnut data={chartData} options={options} />;
    } else if(data.chartTypeId===3){
      return <Pie  data={chartData} options={options} />;
    }else{
     return <Bar data={chartData} options={options}></Bar>
     
    }
   
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color={"secondary"}>
          <IonTitle>{data?.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message="Please wait..." />
        {!loading && (
          <div style={{ height: "400px", padding: "30px" }}>
            {renderChart()}
            
          </div>
        
        )}
        <IonItem className="chart-content remove-border" color={'comment'}> 
        <div className="chart-data">
            {data?.content && (
              <div className="chart-data-labels" dangerouslySetInnerHTML={{ __html: data.content }} />
            )}
          
          </div>
         
        </IonItem>
        <FabMenu/>  
      </IonContent>
    
    </IonModal>
  );
};

export default DynamicChartModal;
