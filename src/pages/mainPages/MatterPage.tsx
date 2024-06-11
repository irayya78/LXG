import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonButton, IonButtons, IonLoading } from '@ionic/react';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { MatterModel } from '../../types/types';
import { useMatterManagement } from '../../hooks/useMatterManagement';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import FabMenu from '../../components/layouts/FabIcon';

const MatterPage: React.FC = () => {
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getRecentMatters } = useMatterManagement();
  const session = useSessionManager();

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
          <IonTitle class="ion-text-center">Matters</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/my-profile">
              <IonAvatar>
                {session.user && session.user.ProfilePicture && (
                  <img src={session.user.ProfilePicture} alt="Profile" />
                )}
              </IonAvatar>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <CommonPullToRefresh onRefresh={getMatters}>
        <IonList>
          {matters.map((matter: MatterModel) => (
            <IonItem key={matter.MatterId}>
              <IonLabel className="ion-text-wrap">
                <h2 className="ion-margin-bottom">
                  {matter.OpenDate} | {matter.PracticeArea}
                </h2>
                <h3 className="ion-margin-bottom">
                  <span className="ion-text-capitalize matter-code-font">
                    {matter.MatterCode} | {matter.MatterTitle}
                  </span>
                </h3>
                <p className="ion-margin-bottom work-done-desc">
                  {matter.Status} | {matter.ClientName}
                </p>
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
