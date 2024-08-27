import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { briefcase, cash, expand, expandOutline, notifications, notificationsOutline, time, timer, wallet } from 'ionicons/icons';
import { FormattedSummery, ReportSummaryItem } from '../types/types';

interface DashboardCardProps {
  title: string;
  content: FormattedSummery[];
  isClickAble: boolean;
  bgicon: string;
  onClick: (event: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => void;
  htmlData:any
}

const DashboardWidgets: React.FC<DashboardCardProps> = ({ title, content, isClickAble, bgicon, onClick,htmlData}) =>{
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
  }

  const getIconForCard=(title:string)=>{
 
    switch (title){
    case 'My Approvals':return<IonIcon className='card-icon' icon={notifications}/>;
    case 'My Timesheet':return<IonIcon className='card-icon' icon={timer}/>; 
    case 'My Expenses':return<IonIcon className='card-icon'  icon={wallet}/>; 
    case 'My Matters':return<IonIcon className='card-icon'  icon={briefcase}/>; 

    }


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

   {title === 'My Approvals' && counts && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',}}>
            <span className="card-labels">Total Approvals:</span>
            <span className="total">{counts.totalCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', }}>
            <span className="card-labels">Leaves Approvals:</span>
            <span className="billable-time">{counts.leaveCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', }}>
            <span className="card-labels">Expense Approvals:</span>
            <span className="non-billable-time">{counts.expenseCount}</span>
          </div>
        </div>


        )}
    </IonCardContent>
  
    <div className='bgIcon'>
      <img src={bgicon} alt="?" />
    </div> 
   
  </IonCard>
);
}
export default DashboardWidgets;
