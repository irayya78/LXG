import React, { useState } from 'react';
import {
    IonButton, IonIcon, IonAlert, IonItem, IonLabel, IonSelect, IonSelectOption, IonContent, IonPage
} from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { DropDownItem } from '../types/types';
import { useUIUtilities } from '../hooks/useUIUtilities';

interface FilterAlertProps {
    isOpen: boolean;
    onClose: () => void;
    dateFilterId: number;
    setDateFilterId: (id: number) => void;
    applyFilter: () => void;
}

const FilterAlert: React.FC<FilterAlertProps> = ({ isOpen, onClose, dateFilterId, setDateFilterId, applyFilter }) => {
    const { getDateFilterItems } = useUIUtilities();
    const dateFilterItems: DropDownItem[] = getDateFilterItems();

    const [showAlert, setShowAlert] = useState(isOpen);

    const handleSelectChange = (value: any) => {
        setDateFilterId(value);
        applyFilter();
        setShowAlert(false);
        onClose();
    };

    return (
        <IonPage>
            <IonContent>
                <IonItem>
                    <IonLabel>Filter</IonLabel>
                    <IonButton onClick={() => setShowAlert(true)}>
                        <IonIcon icon={closeCircleOutline} size="large" />
                    </IonButton>
                </IonItem>
                <IonAlert
                    isOpen={true}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Select Filter'}
                    inputs={dateFilterItems.map(filterItem => ({
                        name: 'filter',
                        type: 'radio',
                        label: filterItem.Text,
                        value: filterItem.Value,
                        checked: filterItem.Value === dateFilterId,
                    }))}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                setShowAlert(false);
                                onClose();
                            }
                        },
                        {
                            text: 'OK',
                            handler: handleSelectChange
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default FilterAlert;
