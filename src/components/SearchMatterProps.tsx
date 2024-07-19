import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import React from 'react';
import { briefcaseOutline, personOutline } from 'ionicons/icons';
import { MatterModel } from '../types/types';

interface MatterListProps {
  matters: MatterModel[];
  matterClick: (matter: MatterModel) => void;
}

const MatterList: React.FC<MatterListProps> = ({ matters, matterClick }) => {
  const selectMatter = (e: React.MouseEvent, matter: MatterModel) => {
    matterClick(matter);
  };

  return (
    <IonList id="matterList">
    {matters &&
      matters.map((matter: MatterModel) => (
        <IonItem onClick={(e) => selectMatter(e, matter)} key={matter.MatterId} lines="none">
          <IonLabel className="ion-text-wrap">
            <h3 className="matterCodeAndTitle">
              <span  className="">#{matter.MatterCode}</span> <br />
              <IonIcon icon={briefcaseOutline} /> <span className="matterTitle">{matter.MatterTitle}</span> <br />
              <small className="matter-Code-font">
              <IonIcon icon={personOutline} /> {matter.ClientName} 
              </small> 
            </h3>
          </IonLabel>
        </IonItem>
      ))}
  </IonList>
  
  );
};

export default MatterList;
