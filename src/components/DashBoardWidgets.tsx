import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { expandOutline } from 'ionicons/icons';
import { FormattedSummery, ReportSummaryItem } from '../types/types';

interface DashboardCardProps {
  title: string;
  content: FormattedSummery[];
  isClickAble: boolean;
  bgicon: string;
  onClick: (event: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => void;
  htmlData:any
}

const DashboardWidgets: React.FC<DashboardCardProps> = ({ title, content, isClickAble, bgicon, onClick,htmlData }) =>{

 return(
  
  <IonCard 
    button={isClickAble} 
    onClick={isClickAble ? onClick : onClick} 
    className="dashboard-card"
  >
    <IonCardHeader className="Ionic-header">
      <IonCardTitle className="dashboard-card-title">
   
        {title} 
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent className="Card-content">
      {content.map((content, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: content }} />
      ))}
    </IonCardContent>
    <div>
    
    </div>
    <div className='bgIcon'>
      
      <img src={bgicon} alt="Background Icon" />
    </div>
  </IonCard>
);
}
export default DashboardWidgets;
