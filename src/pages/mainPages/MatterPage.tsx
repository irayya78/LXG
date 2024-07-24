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
        <IonItem color="light" className="nobottomborder filterBar">
                
                <IonList slot="start" class="nopadding">
                 <IonLabel className="font-grey-color greyback"><span className="font-bold">#Rec: {matters.length}</span></IonLabel>
               </IonList>
            </IonItem>
      </IonHeader>
      <IonContent style={{marginTop:"60px"}}>
      <CommonPullToRefresh onRefresh={getMatters}>
        <IonList>
          {matters.map((matter: MatterModel) => (
            <IonItem key={matter.MatterId}>
                 <IonText className="time-text" slot="end">
                                        <p className="total-time">{(matter.Status)}</p>
                                    </IonText> 
              <IonLabel className="ion-text-wrap">
               <span  className="matter-Code-font">
               <IonIcon icon={briefcaseOutline}/>
               &nbsp;  {matter.MatterCode} | {matter.MatterTitle}
                  </span>
                <h5 className="work-done-desc">
                 <IonIcon icon={calendarOutline}/> {matter.OpenDate} | {matter.PracticeArea}
                </h5>
               
                <h2 className="small-font"><IonIcon icon={personCircleOutline}/>&nbsp;{matter.ClientName}</h2>
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
     
                 <FabMenu />
      
    </IonPage>
  );
};

export default withSessionCheck(MatterPage);
