import React, { useState, ReactNode } from 'react';
import { IonRefresher, IonRefresherContent, IonContent } from '@ionic/react';

interface CommonPullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

const CommonPullToRefresh: React.FC<CommonPullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const doRefresh = async (event: CustomEvent) => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
    event.detail.complete();
  };

  return (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent
          pullingIcon="arrow-down"
          refreshingSpinner="circles"
        
        />
      </IonRefresher>
      {children}
    </IonContent>
  );
};

export default CommonPullToRefresh;