import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonLoading, IonText, IonIcon, IonContent } from '@ionic/react';
import { MatterModel } from '../../types/types';
import { useMatterManagement } from '../../hooks/useMatterManagement';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import FabMenu from '../../components/layouts/FabIcon';
import MyProfileHeader from '../../components/MyProfileHeader';
import { briefcaseOutline, calendarOutline, personCircleOutline } from 'ionicons/icons';
import withSessionCheck from '../../components/WithSessionCheck';

const MatterPage: React.FC = () => {
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getRecentMatters } = useMatterManagement();

  const getMatters = async () => {
    setIsLoading(true); // Start loading
    try {
      //The api call for matters
      const matter = await getRecentMatters();
      setMatters(matter);
    } catch (error) {
      console.error('Error fetching recent matters:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

 
  useEffect(() => {
    getMatters();
  }, []);

  return (
    <IonPage>
      <IonHeader  color="primary">
        <IonToolbar color="primary">
          <IonTitle >Matters</IonTitle>
          <MyProfileHeader/>
        </IonToolbar>
        <IonToolbar color="none" className='filterBar'>
        <IonLabel slot='start' className="font-bold">#Rec:{matters.length}</IonLabel>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <CommonPullToRefresh onRefresh={getMatters}>
        <IonList>
          {matters.map((matter: MatterModel,index) => (
            <IonItem key={index}>
                 <IonText className="time-text" slot="end">
                                        <p className="total-time">{(matter.Status)}</p>
                  </IonText> 
                  <IonLabel className="list-spans">
  <div className="row">
    <span className="matter-Code-font">
      <IonIcon className="icon-align" icon={briefcaseOutline} />
      &nbsp;{matter.MatterCode} | {matter.MatterTitle}
    </span>
    <span className="ellipsis">
      <IonIcon className="icon-align" icon={calendarOutline} />
      &nbsp;{matter.OpenDate} | {matter.PracticeArea}
    </span>
    <span className="ellipsis">
      <IonIcon className="icon-align" icon={personCircleOutline} />
      &nbsp;{matter.ClientName}
    </span>
  </div>
</IonLabel>

            </IonItem>


          ))}
        </IonList>
        <IonLoading
          isOpen={isLoading}
          message={'Please wait...'}
          duration={0}
        />
      </CommonPullToRefresh>
      </IonContent>
     
      
    </IonPage>
  );
};

export default withSessionCheck(MatterPage);
