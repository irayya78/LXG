
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


// const saveMatter = async  (model: MatterModel) : Promise<boolean> => {
   
//     await axiosInstance.post("SaveMatter", model)
//     return true
// }



// const deleteMatter = async  (matterId: Number): Promise<boolean>  => {

//     await axiosInstance.get( "/DeleteMatter/" + matterId)
    
//     return true
// }


 const getMatterObject =   (element: any): MatterModel  => {

    let obj : MatterModel = getBlankMatterObject()
  

        obj = {
            MatterId: element.matterId,
            PracticeAreaId:element.practiceAreaId !=null ?element.practiceAreaId : 0,
            MatterCode: element.matterCode,
            OpenDate: element.openDate != null ? element.openDate : "",
            PracticeArea: element.practiceAreaName != null ?element.practiceAreaName : "PracticeArea Not define",
            Status: element.statusName != null ?element.statusName : "None",
            MatterTitle: element.matterTitle,
            ClientName: element.clientName , 
            MatterStatuses: element.matterStatuses !== null ? element.matterStatuses : [] ,
            PracticeAreas: element.practiceAreas,
            SubPracticeAreas: element.subPracticeAreas,
            BusinessUnits: element.businessUnits,
            TimeEntryTypeId:element.timeEntryTypeId !==null ?element.timeEntryTypeId:0
            
        }    
    
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
        BusinessUnits:[],
        TimeEntryTypeId:0
    }   

     return Obj
}

const searchMatters = async  (searchField: string): Promise<MatterModel[]>  => {

    const resp = await axiosInstance.get("/SearchMatter/" + session.user?.CustomerId + "/" + session.user?.UserId + "/" + searchField)
    console.log(resp)
    if(resp.data != null && resp.data.length  > 0){   
        
        const matters: MatterModel[] = [];
        
        resp.data.forEach( (element: any) => {
          
            matters.push( {
                MatterId: Number( element.value),
                PracticeAreaId:Number(element.value),
                MatterCode: element.code,
                OpenDate:element.dateAsDDMMYYYY,
                PracticeArea:element.Text,
                Status:element.Text,
                MatterTitle: element.text,
                ClientName : element.tertieryText,
                MatterStatuses: element.matterStatuses !== null ? element.matterStatuses : [] ,
                PracticeAreas: element.practiceAreas,
                SubPracticeAreas: element.subPracticeAreas,
                BusinessUnits: element.businessUnits,
                TimeEntryTypeId:element.timeEntryTypeId !==null ?element.timeEntryTypeId:0

            } )
        });

        return matters;
    } 
    else{
        return []
    }
       
};
return {
    getRecentMatters ,searchMatters

}
};


