import { ConnectionStatus, Network } from '@capacitor/network';
import React, { useEffect, useState } from 'react'

const useNetworkCheck = () => {
   
      const [isOffline, setIsOffline] = useState(false);
    
      useEffect(() => {
        const updateNetworkStatus = (status: ConnectionStatus) => {
          setIsOffline(!status.connected);
        };
    
        const checkInitialNetworkStatus = async () => {
          const status = await Network.getStatus();
          updateNetworkStatus(status);
        };
    
        checkInitialNetworkStatus();
    
        const setupNetworkListener = async () => {
          const handler = await Network.addListener('networkStatusChange', updateNetworkStatus);
          return handler;
        };
    
        const networkListener = setupNetworkListener();
    
        return () => {
          networkListener.then((handler) => handler.remove());
        };
      }, []);
    
      return isOffline;
    };


export default useNetworkCheck