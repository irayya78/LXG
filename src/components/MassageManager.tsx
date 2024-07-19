// messageManager.tsx

import { IonToast, IonAlert } from '@ionic/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

export function messageManager() {
  const showToastMessage = (message: string, duration: number = 2000) => {
    const toastElement = document.createElement('div');
    document.body.appendChild(toastElement);
    const root = createRoot(toastElement);

    const toast = (
      <IonToast
        isOpen={true}
        message={message}
        duration={duration}
        onDidDismiss={() => {
          root.unmount();
          document.body.removeChild(toastElement);
        }}
      />
    );

    root.render(toast);
  };

  const showAlertMessage = (message: string) => {
    const alertElement = document.createElement('div');
    document.body.appendChild(alertElement);
    const root = createRoot(alertElement);

    const alert = (
      <IonAlert
        isOpen={true}
        message={message}
        buttons={[{
          text: 'OK',
          handler: () => {
            root.unmount();
            document.body.removeChild(alertElement);
          }
        }]}
      />
    );

    root.render(alert);
  };

  const showConfirmMessage = (message: string, confirmButton: any, cancelButton: any = null) => {
    const alertElement = document.createElement('div');
    document.body.appendChild(alertElement);
    const root = createRoot(alertElement);

    const alert = (
      <IonAlert
        isOpen={true}
        message={message}
        buttons={[confirmButton, cancelButton || { text: 'Cancel', role: 'cancel' }]}
        onDidDismiss={() => {
          root.unmount();
          document.body.removeChild(alertElement);
        }}
      />
    );

    root.render(alert);
  };

  const showTopToastMessage = (message: string, duration: number = 2000) => {
    const toastElement = document.createElement('div');
    document.body.appendChild(toastElement);
    const root = createRoot(toastElement);

    const toast = (
      <IonToast
        isOpen={true}
        message={message}
        duration={duration}
        position="top"
        cssClass="top-toast" // Custom CSS class for top toast styling
        onDidDismiss={() => {
          root.unmount();
          document.body.removeChild(toastElement);
        }}
      />
    );

    root.render(toast);
  };
  const showValidationNotification = (message: string) => {
    showTopToastMessage(message, 1000);
  };

  return {
    showToastMessage,
    showAlertMessage,
    showConfirmMessage,
    showValidationNotification
  };
}
