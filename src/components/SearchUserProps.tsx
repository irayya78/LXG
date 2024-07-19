import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';
import { personCircle } from 'ionicons/icons';



interface ApproverListProps {
  approvers: UserModel[];
  onApproverSelect: (approver: UserModel) => void;
}


const ApproverList: React.FC<ApproverListProps> = ({ approvers, onApproverSelect }) => {
  return (
    <>
      {approvers.length > 0 && (
        <div className="approver-list">
          {approvers.map((approver) => (
            <IonItem key={approver.UserId} button onClick={() => onApproverSelect(approver)}>
             <IonIcon icon={personCircle} /> <IonLabel>{approver.FullName}</IonLabel>
            </IonItem>
          ))}
        </div>
      )}
    </>
  );
};


export default ApproverList
