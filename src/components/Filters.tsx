import React from 'react';
import {
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption
} from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { DropDownItem } from '../types/types';
import { useUIUtilities } from '../hooks/useUIUtilities';


interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    dateFilterId: number;
    setDateFilterId: (id: number) => void;
    applyFilter: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, dateFilterId, setDateFilterId, applyFilter }) => {
    const { getDateFilterItems } = useUIUtilities();
    const dateFilterItems: DropDownItem[] = getDateFilterItems();

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonContent>
                <IonHeader>
                    <IonToolbar color="secondary">
                        <IonButtons slot="end">
                            <IonButton onClick={onClose} className="norightpadding">
                                <IonIcon slot="start" icon={closeCircleOutline} size="large" />
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Filters</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonItem>
                    <IonSelect 
                    value={dateFilterId} 
                    okText="OK" cancelText="Cancel" 
                    onIonChange={e => setDateFilterId(e.detail.value)} 
                    className="small-font"
                    interface="action-sheet"
                    onSelect={applyFilter}
                        
                        
                        >
                        {dateFilterItems.map(filterItem => (
                            <IonSelectOption key={filterItem.Value} value={filterItem.Value}>
                                {filterItem.Text}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonButton expand="full" onClick={applyFilter} color="primary" className="toppadding"> Apply </IonButton>
            </IonContent>
        </IonModal>
    );
};

export default FilterModal;
