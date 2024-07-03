import React from 'react';
import { IonModal, IonDatetime, IonButton } from '@ionic/react';

interface TimePickerModalProps {
  isOpen: boolean;
  value: string;
  onIonChange: (e: any) => void;
  onClose: () => void;
  presentation: 'time' | 'date';
  hoursFormate: 'h12' | 'h23' | 'h24';
  minuteValues: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  value,
  onIonChange,
  onClose,
  presentation='time',
  hoursFormate,
  minuteValues,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className='modal-content'>
      <IonDatetime
        value={value}
        onIonChange={onIonChange}
        presentation={presentation}
        hourCycle={hoursFormate}
        minuteValues={minuteValues}
        defaultValue="00:00"
      />
      <IonButton className='modal-close-button' onClick={onClose}>Done</IonButton>
    </IonModal>
  );
};

export default TimePickerModal;
