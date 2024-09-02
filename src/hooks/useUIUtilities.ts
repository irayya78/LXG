import { useState } from 'react';
import { DropDownItem } from '../types/types';
import moment from 'moment';

export const useUIUtilities = () => {



  const convertToDropDownItems = (collection: any) : DropDownItem[] =>{

    let itemCollection : DropDownItem[] = []
    

    if(collection !== null && collection !== undefined && collection.length > 0){
      collection.forEach((element : any) => {
        itemCollection.push({Value: element.value, Text: element.text})
      });
    }
    
    return itemCollection
  }

  const convertDateAsYYYYMMDD = (dateAsMMDDYYYY:string) : string =>{
    const dateArray = dateAsMMDDYYYY.split("/")    
    const dtDDMMYYY = dateArray[2]  + "/" + dateArray[1] + "/" + dateArray[0]
    return dtDDMMYYY
  }


  const convertDateToYYYYMMDD = (dateString: string): string => {
    const parts = dateString.split('/');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };
  const convertToYYYYMMDD = (dateValue: Date) : string =>{
     
    const month =  Number( dateValue.getMonth())  + 1
    const date =  dateValue.getDate()

    const monthAsString = month > 10 ? month : "0" + Number(month).toString();
    const dateAsString = date >= 10 ? Number(date).toString() : "0" + Number(date).toString();

    const dtDDMMYYY =dateValue.getFullYear() + "-" + monthAsString + "-" + dateAsString
    return dtDDMMYYY
  }
  const getCurrentDateAsYYYYMMDD = (): string => {
    const date = new Date();
    const month = date.getMonth() + 1; // Month is zero-based, so add 1
  
    // Ensure month and date are two digits
    const monthAsString = month >= 10 ? month.toString() : '0' + month.toString();
    const dateAsString = date.getDate() >= 10 ? date.getDate().toString() : '0' + date.getDate().toString();
  
    // Format as YYYY-MM-DD
    const dtYYYYMMDD = date.getFullYear() + '-' + monthAsString + '-' + dateAsString;
    
    return dtYYYYMMDD;
  };
  
  const sortDataByDate = (expenses: any[], dateProperty: string, order: 'asc' | 'desc' = 'desc') => {
    return expenses.sort((a, b) => {
      // Convert date strings to Date objects using the dynamic date property
      const dateA = new Date(convertDateToYYYYMMDD(a[dateProperty]));
      const dateB = new Date(convertDateToYYYYMMDD(b[dateProperty]));
  
      // Compare dates
      if (dateA < dateB) {
        return order === 'asc' ? -1 : 1; // Sorting in ascending or descending order
      }
      if (dateA > dateB) {
        return order === 'asc' ? 1 : -1; // Sorting in ascending or descending order
      }
      return 0;
    });
};
  

  const sortExpensesByDate = (expenses: any[]) => {
    return expenses.sort((a, b) => {
      // Convert date strings to Date objects
      const dateA = new Date(convertDateToYYYYMMDD(a.Date));
      const dateB = new Date(convertDateToYYYYMMDD(b.Date));
  
      // Compare dates
      if (dateA < dateB) {
        return 1; // Sorting in descending order
      }
      if (dateA > dateB) {
        return -1; // Sorting in descending order
      }
      return 0;
    });
  };

  
  const addSeperatorToMMDDYYYDateString = (dateAsDDMMYYYY: string) =>{
    const day = dateAsDDMMYYYY.substring(0, 2)
    const month = dateAsDDMMYYYY.substring(2, 4)
    const year = dateAsDDMMYYYY.substring(4, 8)  
    const dateString = day + "/" + month + "/" + year
    return dateString
  } 

  const connvertDateToMMMDDYYYY = (ddMMYYYY: string) : string =>{
    if(ddMMYYYY === null) return ""
    if(ddMMYYYY === undefined) return ""
    if(ddMMYYYY.indexOf("/") === -1) return ""

    const dateArray = ddMMYYYY.split("/")    
    const dtDDMMYYY = dateArray[2]  + "-" + dateArray[1] + "-" + dateArray[0]

    const tempDate = (moment(new Date(dtDDMMYYY))).format('MMM, DD YYYY')

    return tempDate
  }
  const getCurrentDateAsString = () : string =>{
    const date = new Date();
    const month =  Number( date.getMonth())  + 1
    
    const day = date.getDate()
   
    const dd : string = day < 10  ? "0" + day.toString() : day.toString()
    const mm : string = month >= 10  ? month.toString() : "0" + month.toString()

    const dtDDMMYYY = dd + "/" + mm + "/" + date.getFullYear()

    return dtDDMMYYY
  }
  const convertMinutesToHHMMFormat = (timeInMinutes: number) : string =>{
    var retValue : string = ""

    const hoursPart = Math.floor( timeInMinutes / 60)
    const minutePart = timeInMinutes % 60

    const hoursPartFormatted = hoursPart < 10 ? "0" + hoursPart : hoursPart
    const minutesPartFormatted = minutePart < 10 ? "0" + Math.floor(minutePart) :  Math.floor(minutePart)

    retValue =  hoursPartFormatted + ":" + minutesPartFormatted
    return retValue
}

const convertDecimalToHHMMFormat = (timeValue: number) : string =>{
  var retValue : string = ""

  const timeInMinutes : number = timeValue * 60

  retValue = convertMinutesToHHMMFormat(timeInMinutes)
  return retValue
}

const convertHHMMFormatToDecimal = (hhMM: string) : number =>{
var retValue : number = 0

const timeInMinutes : number = convertToMinutes(hhMM)

retValue =  timeInMinutes/ 60

return Math.round(retValue)
}

const convertToMinutes = (hhMMTime:string) : number =>{


    const timeArray = hhMMTime.split(":")
    
    const hoursPart = parseInt(timeArray[0])
    const minutesPart = parseInt(timeArray[1])

    return hoursPart * 60 + minutesPart
}

const convertTimeTo24HoursFormat = (hhMM:string) : string =>{
 
  const timeValue = new Date("2021-01-01 " + hhMM).toTimeString()

  const timeArray = timeValue.split(":")
    
  const hoursPart = parseInt(timeArray[0])
  const minutePart = parseInt(timeArray[1])

  const hoursPartFormatted = hoursPart < 10 ? "0" + hoursPart : hoursPart
  const minutesPartFormatted = minutePart < 10 ? "0" + minutePart : minutePart

  return hoursPartFormatted + ":" + minutesPartFormatted + ":00"
}

const convertSecondsToHHMMSS = (seconds:number) : string =>{
let retValue : string = ""
retValue = new Date(seconds * 1000).toISOString().substr(11, 8)
return retValue
}

const formatNumber = (value: number, digits: number = 0) : string  => {
  const numWithDigits = roundOff(value, digits)
  return (numWithDigits).toLocaleString('en-us', {minimumFractionDigits: digits})
}

const roundOff = (value: number, digits: number = 0) : number  => {
  
  const multiplier = digits > 0 ? Math.pow(10, digits) : 1 

  return Math.round(value * multiplier) / multiplier
}

const convertToDDMMYYYYWithoutSeparator = (dateValue: string) =>{
  const tmpArray = dateValue.split("/")
  const dd : string = Number( tmpArray[0]) < 10 ? "0" + Number( tmpArray[0]).toString() : tmpArray[0]
  const mm : string = Number( tmpArray[1]) < 10 ? "0" + Number( tmpArray[1]).toString() : tmpArray[1]
  const dateAsDDMMYYYY = dd + mm + tmpArray[2]
  return dateAsDDMMYYYY
} 
// const convertToDDMMYYYYWithoutSeparator = (parameterDate: string): string => {
//   // Ensure parameterDate is in 'DDMMYYYY' format
//   if (parameterDate.length !== 8) {
//     throw new Error('Parameter date must be in DDMMYYYY format.');
//   }

//   const day = parameterDate.substring(0, 2);
//   const month = parameterDate.substring(2, 4);
//   const year = parameterDate.substring(4, 8);

//   // Format as 'DDMMYYYY' without any separators
//   const dtDDMMYYYYWithoutSeparator = `${day}${month}${year}`;

//   return dtDDMMYYYYWithoutSeparator;
// };


//For Timesheet Date in per
const convertParameterDateToYYYYMMDD = (parameterDate: string): string => {
  // Ensure parameterDate is in 'DDMMYYYY' format
  if (parameterDate.length !== 8) {
    throw new Error('Parameter date must be in DDMMYYYY format.');
  }

  const day = parameterDate.substring(0, 2);
  const month = parameterDate.substring(2, 4);
  const year = parameterDate.substring(4, 8);

  // Format as 'YYYY-MM-DD'
  const dtYYYYMMDD = `${year}-${month}-${day}`;

  return dtYYYYMMDD;
};

const convertParameterDateToDDMMYYYY = (parameterDate: string): string => {
  // Ensure parameterDate is in 'DDMMYYYY' format
  if (parameterDate.length !== 8) {
    throw new Error('Parameter date must be in DDMMYYYY format.');
  }

  const day = parameterDate.substring(0, 2);
  const month = parameterDate.substring(2, 4);
  const year = parameterDate.substring(4, 8);

  // Format as 'DD/MM/YYYY'
  const dtDDMMYYYY = `${day}/${month}/${year}`;

  return dtDDMMYYYY;
};


const getCurrentDateDDMMYYYY = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0'); // Get the day with leading zero if needed
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Get the month with leading zero if needed
  const yyyy = today.getFullYear(); // Get the full year
  return `${dd}-${mm}-${yyyy}`;
};

const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getTimeAsHHMM = (time : string ) : string =>{

  if(time == null) return ""

  if(time.indexOf(":") === -1) return ""

  const currentTime = time
  const hhMMArray : string [] = currentTime.split(":")

  const hh = hhMMArray[0]
  const mm = Number( hhMMArray[1]) % 5 === 0 ? hhMMArray[1] :  Math.floor(Number(hhMMArray[1]) / 5) * 5

  const minutesAsNumber = Number(mm) > 10 ? mm : "0" + Number(mm).toString()

  const fTime : string =  hh + ":" + minutesAsNumber 

  return fTime
}

const getDateToDisplay = (dateValue: string) : string =>{
  console.log("what is reving",dateValue)
  const date = new Date(dateValue);
  const month =  Number( date.getMonth())  + 1

  const dtDDMMYYY = date.getDate() + "/" + month + "/" + date.getFullYear()
  return dtDDMMYYY
}

//To Add Total Time   based on the To time and  From TIme 
const getTimeDifferenceBetweenFromAndToTime =(fromTime:string, toTime : string) : string =>{
  const fromTimeInMinutes = convertToMinutes(fromTime)
  const toTimeInMinutes = convertToMinutes(toTime)
  const timeDiff = toTimeInMinutes - fromTimeInMinutes

  return convertMinutesToHHMMFormat(timeDiff)
}

const getPeriodName =  (dateFilterId: number) : string =>{
  let period : string = ""

  const filterItems : DropDownItem[] = getDateFilterItems()

  filterItems.forEach((item: DropDownItem) =>{
      if(item.Value === dateFilterId){
        period = item.Text
        return
      }

  })

  return period
}

const getDateFilterItems = () : DropDownItem[] =>{
  const filterItems : DropDownItem[] = [
    {Value:0, Text: "Any Period"},
    {Value:1, Text: "Today"},
    {Value:2, Text: "Yesterday"},
    {Value:3, Text: "This Week"},
    {Value:4, Text: "This Month"},
    {Value:5, Text: "This Month And Last Month"},
    {Value:6, Text: "This Calendar Year (Jan - Dec)"},
    {Value:7, Text: "This Financial Year (Apr - Mar)"},
    {Value:8, Text: "  --Q1 (Apr - June)"},
    {Value:9, Text: "  --Q2 (July - Sept)"},
    {Value:10, Text: "  --Q3 (Oct - Dec)"},
    {Value:11, Text: "  --Q4 (Jan - Mar)"},
    {Value:12, Text: "Last Week"},
    {Value:13, Text: "Last Month"},
    {Value:14, Text: "Last To Last Month"},
    {Value:15, Text: "Last Three Months"},
    {Value:16, Text: "Last Six Months"},
    {Value:17, Text: "Last One Year"},
    {Value:18, Text: "Last Financial Year"},
   
  ]

  return filterItems
}
enum DateFilters {
  AnyPeriod = 0,
  Today = 1,
  Yesterday = 2,
  ThisWeek = 3,
  ThisMonth = 4,
  ThisMonthAndLastMonth = 5,
  ThisCalendarYear = 6,
  ThisFinancialYear = 7,
  Q1 = 8,
  Q2 = 9,
  Q3 = 10,
  Q4 = 11,
  LastWeek = 12,
  LastMonth = 13,
  LastToLastMonth = 14,
  LastThreeMonths = 15,
  LastSixMonths = 16,
  LastOneYear = 17,
  LastFinancialYear = 18,
  
}
const getCurrentDate = (): string => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);
};

function convertToDateFormat(input: string): string {
  // Parse the input string as a Date object
  const date = new Date(input);

  // Check if the input string was a valid date
  if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
  }

  // Extract day, month, and year from the Date object
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  // Format and return the date as DD/mm/yyyy
  return `${day}/${month}/${year}`;
}


  return {
    convertDateAsYYYYMMDD,
    convertToDateFormat,
    getCurrentDate,
    getDateToDisplay,
    convertDateToYYYYMMDD,
    getCurrentDateAsYYYYMMDD,
    convertToDropDownItems,
    addSeperatorToMMDDYYYDateString,
    connvertDateToMMMDDYYYY,
    convertTimeTo24HoursFormat,
    getCurrentDateAsString,
    convertSecondsToHHMMSS,
    convertHHMMFormatToDecimal,
    convertDecimalToHHMMFormat,
    formatNumber,
    convertToMinutes,
    convertMinutesToHHMMFormat,
    convertToDDMMYYYYWithoutSeparator,
    roundOff,
    convertParameterDateToYYYYMMDD,
    getCurrentDateDDMMYYYY,
    getTimeAsHHMM,
    getTimeDifferenceBetweenFromAndToTime,
    sortExpensesByDate,
    getPeriodName,
    getDateFilterItems,
    DateFilters,
    convertToYYYYMMDD,
    sortDataByDate,
    convertParameterDateToDDMMYYYY,
    formatDateToDDMMYYYY
  };
};
