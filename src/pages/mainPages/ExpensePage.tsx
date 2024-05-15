import React from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonText } from '@ionic/react';

const ExpensePage: React.FC = () => {
    // Demo expense data
    const expenses = [
        { id: 1, date: '2024-05-01', amount: 100, description: 'Expense 1' },
        { id: 2, date: '2024-05-02', amount: 150, description: 'Expense 2' },
        { id: 3, date: '2024-05-03', amount: 80, description: 'Expense 3' },
        { id: 4, date: '2024-05-03', amount: 120, description: 'Expense 4' },
        { id: 5, date: '2024-05-04', amount: 200, description: 'Expense 5' },
        { id: 6, date: '2024-05-05', amount: 90, description: 'Expense 6' },
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                   
                    <IonTitle>Expense</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Expense listings */}
                <IonList>
                    {expenses.map(expense => (
                        <IonItem key={expense.id}>
                            <IonLabel>
                                <h2>{expense.date}</h2>
                                <IonText color="medium">Amount: ${expense.amount}</IonText>
                                <p>{expense.description}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ExpensePage;
