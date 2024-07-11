import { IonIcon, IonSegment, IonSegmentButton } from '@ionic/react';
import React from 'react';
import './calendarNavigation.css';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { chevronBackCircle, chevronBackCircleOutline, chevronBackCircleSharp, chevronForward, chevronForwardCircle, chevronForwardCircleOutline, chevronForwardCircleSharp } from 'ionicons/icons';

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
    <IonSegment className='calender'  value={props.selectedDay} onIonChange={(e) => onDateClick(e)}>
    <IonSegmentButton className='buttonAero' value="Prev"><IonIcon icon={chevronBackCircle} /></IonSegmentButton>
    {props.calendarItems && props.calendarItems.map((cal: any) => (
      <IonSegmentButton value={cal.Date} key={cal.Date}>
           <span className='' >{cal.DayNameShort}</span> 
       
        <span className="">{cal.JustDatePart}</span>
      </IonSegmentButton>
    ))}
    <IonSegmentButton  className='buttonAero' value="Next"><IonIcon icon={chevronForwardCircle} /></IonSegmentButton>
  </IonSegment>
  );
};

export default CalendarNavigation;
