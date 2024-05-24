import { useState } from 'react';
import axiosInstance from "../apiHelper/axiosInstance";
import { useSessionManager } from "../sessionManager/SessionManager";
import { MatterModel, UserSessionDetails } from "../types/types";

export const useMatterManagement = () => {
const session =useSessionManager();


const getRecentMatters = async  () : Promise<MatterModel[]> => {
    const resp = await axiosInstance.get("/GetMyRecentMatters/" + session.user?.UserId+ "/" + session.user?.CustomerId)
    const recentMattersData: MatterModel[] = [];

    if(resp.data != null && resp.data.length  > 0){ 

        resp.data.forEach( (element: any) => {
            const tempMatter : MatterModel = getMatterObject(element)    
            recentMattersData.push( tempMatter )
        })

        return recentMattersData;
    } 
    else
    return recentMattersData; 

};





const saveMatter = async  (model: MatterModel) : Promise<boolean> => {
   
    await axiosInstance.post("SaveMatter", model)
    return true
}



const deleteMatter = async  (matterId: Number): Promise<boolean>  => {

  

    await axiosInstance.get( "/DeleteMatter/" + matterId)
    
    return true
}


 const getMatterObject =   (element: any): MatterModel  => {

    let obj : MatterModel = getBlankMatterObject()
  
   // if(element.matterId != null && Number(element.matterId) > 0){
        obj = {
            MatterId: element.matterId,
            PracticeAreaId:element.practiceAreaId !=null ?element.practiceAreaId : 0,
            MatterCode: element.matterCode,
            OpenDate: element.openDate != null ? element.openDate : "01/01/2021",
            PracticeArea: element.practiceAreaName != null ?element.practiceAreaName : "PracticeArea Not define",
            Status: element.statusName != null ?element.statusName : "None",
            MatterTitle: element.matterTitle,
            ClientName: element.clientName , 
            MatterStatuses: element.matterStatuses !== null ? element.matterStatuses : [] ,
            PracticeAreas: element.practiceAreas,
            SubPracticeAreas: element.subPracticeAreas,
            BusinessUnits: element.businessUnits,
            
            
        }    
   // }  
    return obj;
}
 const getBlankMatterObject =   (): MatterModel  => {

    const Obj : MatterModel =  {
     
        MatterId: 0,
        PracticeAreaId:0,
        MatterCode: '',
        OpenDate:'',
        PracticeArea:'',
        Status:'',
        MatterTitle: '',
        ClientName: '',
        MatterStatuses: [],
        PracticeAreas: [],
        SubPracticeAreas: [],
        BusinessUnits:[]
    }   

     return Obj
}
return {
    getRecentMatters,saveMatter,deleteMatter,getBlankMatterObject


}
};


