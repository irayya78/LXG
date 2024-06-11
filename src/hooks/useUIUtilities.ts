import { useState } from 'react';
import { DropDownItem } from '../types/types';
import moment from 'moment';

export const useUIUtilities = () => {



  const convertToDropDownItems = (collection: any) : DropDownItem[] =>{

    let itemCollection : DropDownItem[] = []

    console.log("convertToDropDownItems")
    console.log("Value in COllection is below")
    console.log(collection)

    

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
  
  const getCurrentDateAsYYYYMMDD = () : string =>{
    const date = new Date();
    const month =  Number( date.getMonth())  + 1

    const monthAsString = month > 10 ? month : "0" + Number(month).toString();
    const dateAsString = date.getDate() >= 10 ? Number(date.getDate()).toString() : "0" + Number(date.getDate()).toString();


    const dtDDMMYYY =date.getFullYear() + "/" + monthAsString + "/" + dateAsString
    return dtDDMMYYY
  }

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
  
  
  return {
    convertDateAsYYYYMMDD,
    convertDateToYYYYMMDD,
    getCurrentDateAsYYYYMMDD,
    convertToDropDownItems,
    sortExpensesByDate
  };
};
