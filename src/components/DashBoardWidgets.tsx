import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { expandOutline } from 'ionicons/icons';
import { ReportSummaryItem } from '../types/types';

interface DashboardCardProps {
  title: string;
  content: ReportSummaryItem[];
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
     {content.length >0  ? (
        content.map((item, index) => (
          <p key={index}>
            <strong className=''>{item.label}:</strong> {item.value} 
          </p>
        ))
      ) : (
       <><div dangerouslySetInnerHTML={{ __html: htmlData }} /></>
      )}
      
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
