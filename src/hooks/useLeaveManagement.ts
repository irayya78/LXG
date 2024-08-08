import axiosInstance from '../apiHelper/axiosInstance';
import { useSessionManager } from '../sessionManager/SessionManager';
import { HolidayListModel, LeaveModel } from '../types/types';
import { useUIUtilities } from './useUIUtilities';
import { useCallback, useState } from 'react';

const useLeaveManagement = () => {
    const session = useSessionManager();
    const {convertToDropDownItems}=useUIUtilities();

    const getLeaves = async (): Promise<LeaveModel[]> => {
        
        const leaveList= await axiosInstance.get(`/GetLeaves/${session.user?.CustomerId}/${session.user?.UserId}`)
        console.log("raw response:-",leaveList.data)
        const leaveArray: LeaveModel[] = [];
        if(leaveList.data != null && leaveList.data.length > 0){
            leaveList.data.forEach((element : any) => {
                const templeave : LeaveModel = getLeaveObject(element)
                leaveArray.push(templeave)
            })
            return leaveArray;
        }else 
        return leaveArray;
       
    }; 
    
    const getLeaveObject = (element: any): LeaveModel => {

      const leaveStatusText = element.leaveStatusId === 1 
      ? 'Submitted' 
      : element.leaveStatuses.find((status: any) => status.value === element.leaveStatusId)?.text || '';

        let Obj : LeaveModel = getBlankLeaveObject()

        Obj = {
            LeaveId : Number(element.leaveId),
            UserId : element.userId,
            CustomerId : element.customerId,
            ModifiedDate : element.modifiedDate,
            ModifiedBy : element.modifiedBy,
            CreatedDate : element.createdDate,
            CreatedBy : element.createdBy,
            FromDate : element.fromDate,
            ToDate : element.toDate,
            LeaveFromDateToToDate : element.leaveFromDateToToDate,
            FromSessionId : element.fromSessionId,
            ToSessionId : element.toSessionId,
            LeaveTypeId : element.leaveTypeId,
            LeaveCount : element.leaveCount,
            LeaveTransactionId : element.leaveTransactionId,
            Description : element.description||null,
            ApproverComment : element.approverComment,
            ApproverId : element.approverId,
            ApproverName : element.approver !==null ?element.approver.associateName:"",
            LeaveStatusId : element.leaveStatusId,
            LeaveTransactionType : element.leaveTransactionType,
            ActionOn : element.actionOn,
            LeaveTypeCollection : convertToDropDownItems(element.leaveTypeCollection),
            LeaveSessionCollection: convertToDropDownItems(element.leaveSessionCollection),
            LeaveStatuses : element.leaveStatuses,
            LeaveType : element.leaveType,
            BuId : element.buId,
            LeaveTypeName : element.leaveType != null ? element.leaveType.leaveTypeName : '',
            LeaveSessionName : element.FromSessionId == 1 ? 'Full Day' : 'Hlaf Day',
            LeaveStatus : leaveStatusText ,
            UserName : element.user != null ? element.user.associateName : ''
          }
        return Obj;
    }

    const getBlankLeaveObject =   (): LeaveModel  => {

        const obj : LeaveModel =  {
          LeaveId: 0,
          UserId: 0,
          CustomerId: 0,
          ModifiedDate: '',
          ModifiedBy: 0,
          CreatedDate: '',
          CreatedBy: 0,
          FromDate: '',
          ToDate: '',
          LeaveFromDateToToDate: '',
          FromSessionId: 0,
          ToSessionId: 0,
          LeaveTypeId: 0,
          LeaveCount: 0,
          LeaveTransactionId: 0,
          Description: ' ',
          ApproverComment: '',
          ApproverId: 0,
          ApproverName: '',
          LeaveStatusId: 0,
          LeaveTransactionType: '',
          ActionOn: '',
          LeaveTypeCollection: [],
          LeaveSessionCollection: [],
          LeaveStatuses: [],
          LeaveTypeName: '',
          LeaveSessionName: '',
          // User: any,
          LeaveType: undefined,
          BuId: 0,
          LeaveStatus : '',
          UserName : ''
        }
        return obj;
    }

    const getLeaveStatusColor = (leaveStatusId: number) => {
        switch (leaveStatusId) {
          case 1:
            return 'orange'
          case 2:
            return 'green';
          case 3:
            return 'red';
          default:
            return 'grey'; 
        }
      };

    const getLeave = async  (leaveId: Number): Promise<LeaveModel>  => {

        const resp = await axiosInstance.get( "/GetLeave/" + session.user?.CustomerId + "/" + leaveId)
        console.log('raw resp',resp)
        const leave = getLeaveObject(resp.data)
        console.log('raw single',leave)
        return leave
    }
    
    const getLeaveCount = async (model: LeaveModel) : Promise<Number>=> {
        try {
          const response = await axiosInstance.post('/GetLeaveCount', model);
          return response.data;
        } catch (error) {
          console.error('Error fetching leave count', error);
          return 0;
        }
      };
      
    const saveLeave = async (model: LeaveModel): Promise<boolean> => {
        try {
            await axiosInstance.post("SaveLeave", model, {
            });
          return true;
        } catch (error) {
            console.error('Error saving leave:', error);
            return false;
        }
    };

    const getHolidaysBlankObj = (): HolidayListModel  => {

      const obj : HolidayListModel =  {
        HolidayDate: '',
        HolidayName: '',
        Description: ''
      }
      return obj;
    };

    const getHolidayList = async (): Promise<HolidayListModel[]> => {
      try {
          const response = await axiosInstance.get(`/GetHolidayList/${session.user?.CustomerId }/${session.user?.UserId}`);
          
          return response.data.map((element: any) => {
            const holiday = getHolidaysBlankObj();
            holiday.HolidayDate = element.holidayDate;
            holiday.HolidayName = element.holidayName;
            holiday.Description = element.description;
            return holiday;
          });
          
      } catch (error) {
          console.error('Error fetching holiday list:', error);
          throw error;
      }
    };   

    const getSummary = async(leaveList: LeaveModel[]) =>{
      let credit: number = 0
      let deduct: number = 0
      let balance: number = 0

      leaveList.forEach((element: any) => {
          const leaveCount: number = Number(element.LeaveCount);
  
          if (element.LeaveTransactionId === 1) {
              credit += leaveCount;
          } else if (element.LeaveTransactionId === 2 && element.LeaveStatusId !== 3) {
              deduct += leaveCount;
          }
      });
  
      balance = credit - deduct;
      return {
        credit, deduct, balance
      };
    }

    const deleteLeave = async  (leaveId: Number): Promise<boolean>  => {

      await axiosInstance.get( "/DeleteLeave/" + leaveId)
      
      return true
    }

    return {
        getLeaves,getLeaveStatusColor,getBlankLeaveObject,getLeave,saveLeave,getLeaveCount,getHolidayList,getHolidaysBlankObj
        ,getSummary,deleteLeave
        
    };
};

export default useLeaveManagement;


