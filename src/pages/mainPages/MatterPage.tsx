import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonAvatar, IonButton, IonButtons, IonLoading } from '@ionic/react';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { MatterModel } from '../../types/types';
import { useMatterManagement } from '../../hooks/useMatterManagement';
import CommonPullToRefresh from '../../components/PullToRefresh';

const MatterPage: React.FC = () => {
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getRecentMatters } = useMatterManagement();
  const session = useSessionManager();

  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const matter = await getRecentMatters();
      setMatters(matter);
    } catch (error) {
      console.error('Error fetching recent matters:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
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
      <CommonPullToRefresh onRefresh={fetchData}>
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
    </IonPage>
  );
};

export default MatterPage;
