import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonButton, IonButtons, IonLoading, IonText } from '@ionic/react';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { MatterModel } from '../../types/types';
import { useMatterManagement } from '../../hooks/useMatterManagement';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import FabMenu from '../../components/layouts/FabIcon';
import MyProfileHeader from '../../components/MyProfileHeader';

const MatterPage: React.FC = () => {
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getRecentMatters } = useMatterManagement();

  const getMatters = async () => {
    setIsLoading(true); // Start loading
    try {
      //The api call for matters
      const matter = await getRecentMatters();

     // const sortedMatters = matter.sort((a, b) => new Date(b.OpenDate).getTime() - new Date(a.OpenDate).getTime());
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
    <IonPage style={{ backgroundColor: '#fff' }}>
      <IonHeader  color="primary">
        <IonToolbar color="primary">
          <IonTitle >Matters</IonTitle>
          <MyProfileHeader/>
        </IonToolbar>
      </IonHeader>
      <CommonPullToRefresh onRefresh={getMatters}>
        <IonList>
          {matters.map((matter: MatterModel) => (
            <IonItem key={matter.MatterId}>
                 <IonText className="time-text" slot="end">
                                        <p className="total-time">{(matter.Status)}</p>
                                    </IonText> 
              <IonLabel className="ion-text-wrap">
               <span  className="matter-Code-font">
                    {matter.MatterCode} | {matter.MatterTitle}
                  </span>
                <h5 className="work-done-desc">
                  {matter.OpenDate} | {matter.PracticeArea}
                </h5>
               
                <h2 className="small-font">{matter.ClientName}</h2>
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
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>
                 <FabMenu />
       </div>
    </IonPage>
  );
};

export default MatterPage;
