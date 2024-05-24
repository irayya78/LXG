import { useState } from 'react';

export const useUIUtilities = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const showAlertWithMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const hideAlert = () => setShowAlert(false);

  return {
    isLoading,
    showAlert,
    alertMessage,
    startLoading,
    stopLoading,
    showAlertWithMessage,
    hideAlert,
  };
};
