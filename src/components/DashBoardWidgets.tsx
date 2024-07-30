import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';

interface DashboardCardProps {
  title: string;
  icon: any;
  content: React.ReactNode;
  busy: boolean;
  bgicon:any
  onClick: () => any;
}

const DashboardWidgets: React.FC<DashboardCardProps> = ({ title, icon, content, busy, bgicon, onClick }) => (
  <IonCard button onClick={onClick} className="dashboard-card">
    <IonCardHeader className="Ionic-header">
      <IonCardTitle className="dashboard-card-title">
        <IonIcon icon={icon} className="icon" />
        {title}
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent className="Card-content">
      {busy ? (
        <IonSpinner name="dots" />
      ) : (
        content
      )}
      
    </IonCardContent>
    <div className='bgIcon'>
   <img src={bgicon} alt="img" />
 </div>
  </IonCard>
 
);

export default DashboardWidgets;
