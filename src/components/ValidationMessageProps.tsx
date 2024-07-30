import React from 'react';
import { IonLabel, IonIcon } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';

interface ValidationMessageProps {
  message: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ message }) => {
  return (
    <IonLabel class={message.length > 0 ? "validationLabel" : ""}>
      {message.length > 0 && (
        <>
          <IonIcon className="validationIcon" icon={informationCircleOutline} />
          <small>
            {message}
          </small>
        </>
      )}
    </IonLabel>
  );
};

export default ValidationMessage;
