import React, { useState } from 'react';
import { IonContent, IonHeader, IonLoading, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import MyProfileHeader from '../../components/MyProfileHeader';
import CommonPullToRefresh from '../../components/CommonPullToRefreshProps';
import useApprovalManagement from '../../hooks/useApprovalManagement';

const  ApprovalList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {getApprovals} = useApprovalManagement();






    useIonViewDidEnter(() => {
        (async () => {
            setIsLoading(true)
            await getApprovals ();
            setIsLoading(false)
        })();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Approvals</IonTitle>
                    <MyProfileHeader/>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {/* <CommonPullToRefresh onRefresh={}> */}
                    <IonLoading isOpen={isLoading}  message={'Please wait...'}duration={0}/>
                {/* </CommonPullToRefresh> */}
            </IonContent>
        </IonPage>
    );
};

export default ApprovalList;