import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { UserModel } from '../types/types';

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
              <IonLabel>{approver.FullName}</IonLabel>
            </IonItem>
          ))}
        </div>
      )}
    </>
  );
};

export default ApproverList;
