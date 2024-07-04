import { IonIcon, IonSegment, IonSegmentButton } from '@ionic/react';
import React from 'react';
import './calendarNavigation.css';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { chevronBackCircleOutline, chevronBackCircleSharp, chevronForward, chevronForwardCircleOutline, chevronForwardCircleSharp } from 'ionicons/icons';

const CalendarNavigation: React.FC<{
  calendarItems: any[]; 
  selectedDay: string; 
  onDateClick: (dateValue: string, firstDayOfWeek: string) => void;
}> = props => {

  const onDateClick = (e: any) => {
    if (props.selectedDay !== e.detail.value) {
      props.onDateClick(e.detail.value, props.selectedDay);
    }
  };

  return (
    <IonSegment  value={props.selectedDay} onIonChange={(e) => onDateClick(e)}>
    <IonSegmentButton value="Prev"><IonIcon icon={chevronBackCircleOutline} /></IonSegmentButton>
    {props.calendarItems && props.calendarItems.map((cal: any) => (
      <IonSegmentButton value={cal.Date} key={cal.Date}>
           <span className='dayName' >{cal.DayNameShort}</span> 
       
        <span className="dayName">{cal.JustDatePart}</span>
      </IonSegmentButton>
    ))}
    <IonSegmentButton value="Next"><IonIcon icon={chevronForwardCircleOutline} /></IonSegmentButton>
  </IonSegment>
  );
};

export default CalendarNavigation;
