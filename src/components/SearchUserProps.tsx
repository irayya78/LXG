import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';
import { personCircle } from 'ionicons/icons';
import { useSessionManager } from '../sessionManager/SessionManager';



interface ApproverListProps {
  approvers: UserModel[];
  onApproverSelect: (approver: UserModel) => void;
}


const ApproverList: React.FC<ApproverListProps> = ({ approvers, onApproverSelect }) => {
  const session = useSessionManager();
  return (
    <>
      {approvers.length > 0 && (
        <div className="approver-list">
          {approvers.map((approver) => (
            <IonItem key={approver.UserId} button onClick={() => onApproverSelect(approver)} disabled={session.user?.UserId === approver.UserId}>
             <IonIcon icon={personCircle} /> <IonLabel>{approver.FullName}</IonLabel>
            </IonItem>
          ))}
        </div>
      )}
    </>
  );
};


export default ApproverList
