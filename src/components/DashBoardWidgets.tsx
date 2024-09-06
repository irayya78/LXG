import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { briefcase, cash, expand, expandOutline, notifications, notificationsOutline, time, timer, timerOutline, wallet, walletOutline } from 'ionicons/icons';
import { DashboardModel, FormattedSummery, ReportSummaryItem } from '../types/types';
import DynamicChart from '../pages/charts/DynamicChartInCard';


interface DashboardCardProps {
  title: string;
  chartData:any;
  content: FormattedSummery[];
  isClickAble: boolean;
  bgicon: string;
  onClick: (event: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => void;
  htmlData:any
}

const DashboardWidgets: React.FC<DashboardCardProps> = ({ title,chartData, content, isClickAble, bgicon, onClick,htmlData}) =>{
  const extractCounts = (html: string) => {
    const leaveMatch = html.match(/Leaves : <span style="color:blue">(\d+)<\/span>/);
    const leaveCount = leaveMatch ? parseInt(leaveMatch[1], 10) : 0;
    const expenseMatch = html.match(/Expenses : <span style="color:blue">(\d+)<\/span>/);
    const expenseCount = expenseMatch ? parseInt(expenseMatch[1], 10) : 0; 
    const totalCount = leaveCount + expenseCount;
   
    return { leaveCount, expenseCount, totalCount };

  };
  

  let counts;
  if (title === 'My Approvals' && htmlData) {
    counts = extractCounts(htmlData);
    console.log("counts",counts)
  }

  const getIconForCard=(title:string)=>{
 
    switch (title){
    case 'My Approvals':return<IonIcon className='card-icon' icon={notificationsOutline}/>;
    case 'My Timesheet':return<IonIcon className='card-icon' icon={timerOutline}/>; 
    case 'My Expenses':return<IonIcon className='card-icon'  icon={walletOutline}/>; 
    case 'My Matters':return<IonIcon className='card-icon'  icon={briefcase}/>; 

    }


  }
  if (title === 'My Approvals' &&!htmlData) {
    return false;
  }
 return(
  
  <IonCard 
    button={isClickAble} 
    onClick={isClickAble ? onClick : onClick} 
    className="dashboard-card"
  >
    <IonCardHeader className="card-header">
      <IonCardTitle className="dashboard-card-title">
     {getIconForCard(title)} {title} 
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent className="card-content">
        
      {content.map((content, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: content }} />
      ))}
        
        {title === 'My Approvals' && counts && counts.totalCount > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="card-labels">Total Approvals:</span>
                <span className="total">{counts.totalCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="card-labels">Leaves Approvals:</span>
                <span className="billable-time">{counts.leaveCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="card-labels">Expense Approvals:</span>
                <span className="non-billable-time">{counts.expenseCount}</span>
              </div>
            </div>
            <div className='bgIcon'>
              <img src={bgicon} alt='' />
            </div>
          </>
        )}
     
    
       

     <DynamicChart data={chartData}/> 
    </IonCardContent>
  

  
 
 
 
   
  </IonCard>
);
}
export default DashboardWidgets;
