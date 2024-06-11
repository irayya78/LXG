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
      {matters && matters.map((matter: MatterModel) => (
        <IonItem onClick={(e) => selectMatter(e, matter)} key={matter.MatterId} text-wrap>
          <IonLabel>
            <h3 className="matterCodeAndTitle"><span>#</span> {matter.MatterCode } | {matter.MatterTitle} - <IonIcon icon={briefcaseOutline} /> {matter.MatterTitle}</h3>
            <h4><IonIcon icon={personOutline} /> {matter.ClientName}</h4>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default MatterList;
