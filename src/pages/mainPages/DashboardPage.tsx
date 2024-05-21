import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonIcon, IonButton, IonButtons, IonAvatar, IonRefresherContent } from '@ionic/react';
import { Line, Pie } from 'react-chartjs-2';
import { chevronForwardOutline, personCircle } from 'ionicons/icons';
import Layout from '../../components/layouts/Layout';

const DashboardPage: React.FC = () => {
  // Sample data for the Line chart
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Sample data for the Pie chart
  const pieChartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Dataset',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)'
        ],
        hoverOffset: 4
      }
    ]
  };

  // Define state variables to track which chart is currently displayed
  const [showLineChart, setShowLineChart] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle> 
          <IonButtons slot="end">
       <IonButton routerLink="/my-profile">
    <IonAvatar>
      <img src="https://hotpot.ai/images/site/ai/photoshoot/corporate_headshot/style_gallery/39.jpg" alt="Profile" />
    </IonAvatar>
     </IonButton>
</IonButtons>

        </IonToolbar>
      </IonHeader>
      <IonContent>
       
        <div className="ion-padding">
          <h2 style={{textAlign:'center'}}>Welcome to Legalxgen</h2>
          <p></p>
        </div>
        
        {/* Four Cards with Different Charts */}
        <IonCard onClick={() => setShowLineChart(!showLineChart)}>
          <IonCardContent>
            <h2>Expense Per Month</h2>
            {showLineChart && <Line data={lineChartData} />}
          </IonCardContent>
        </IonCard>

        <IonCard onClick={() => setShowPieChart(!showPieChart)}>
          <IonCardContent>
            <h2>Timesheet Report</h2>
            {showPieChart && <Pie data={pieChartData} />}
          </IonCardContent>
        </IonCard>

        {/* Similar Cards for Bar and Doughnut charts */}

      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
