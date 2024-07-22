import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import React, { useState } from 'react';
import CommonPullToRefresh from "../../components/CommonPullToRefreshProps";
import useLeaveManagement from "../../hooks/useLeaveManagement";
import { HolidayListModel } from "../../types/types";
import { useUIUtilities } from "../../hooks/useUIUtilities";


const HolidayList: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [holidays, setHolidays] = useState<HolidayListModel[]>([]);
    const {getHolidayList} = useLeaveManagement();
    const {connvertDateToMMMDDYYYY,sortDataByDate} = useUIUtilities();
    
    useIonViewDidEnter(() => {
        (async () => {
            await getHolidays ();
        })();
    });

    const getHolidays = async()=>{
        setIsLoading(true); // Start loading
        try{
            const holidaylist = await getHolidayList();
            const sortedHolidays: any = sortDataByDate(holidaylist, 'HolidayDate', 'asc');
            setHolidays(sortedHolidays)
        }catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/layout/leave"/>
                    </IonButtons>
                    <IonTitle>Holidays</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonLoading message="Please wait..." duration={0} isOpen={isLoading}/>
            
            <CommonPullToRefresh onRefresh={getHolidays}>
                <IonContent>
                    <IonItem color="light" className="nobottomborder"> 
                       <IonList className='nopadding'>
                            <IonLabel className="greyback">Rec(s): {holidays.length}</IonLabel>
                        </IonList>
                    </IonItem>

                    <IonList id="leave-holiday-list">
                        {holidays && holidays.map((holiday: HolidayListModel, index: number) => (
                            <IonItem key={index}>
                                <IonLabel className="ion-text-wrap"> 
                                    <span className="font-bold">{holiday.HolidayName}</span><br/>
                                    <span className="small-font">{holiday.Description}</span>
                                </IonLabel> 
                                <IonLabel className="work-done-desc" slot="end"> 
                                    <span className="time-text">{connvertDateToMMMDDYYYY(holiday.HolidayDate)}</span>
                                </IonLabel>                               
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </CommonPullToRefresh>
        </IonPage>
    );
    
};

export default HolidayList;