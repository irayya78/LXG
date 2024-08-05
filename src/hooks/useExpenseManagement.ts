import { CategoryData, UserModel } from './../types/types';
import { useSessionManager } from '../sessionManager/SessionManager';
import axiosInstance from '../apiHelper/axiosInstance';
import { DataAccessCheckModal, ExpenseDocumentModel, ExpenseModel, getBlankUserObject } from '../types/types';
import { useUIUtilities } from './useUIUtilities';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';
import { setPlatformHelpers } from 'ionicons/dist/types/stencil-public-runtime';
import { Capacitor } from '@capacitor/core';



const useExpenseManagement = () => {
    const session = useSessionManager();
    const {convertToDropDownItems } =useUIUtilities()


    const getExpenses = async (dateFilterId:number): Promise<ExpenseModel[]> => {
        try {
            const resp = await axiosInstance.get(`/GetExpenses/${session.user?.UserId}/${dateFilterId}`);
             console.log('raw all',resp)
             const expArray: ExpenseModel[] = [];

             if(resp.data != null && resp.data.length  > 0){ 
          
     
                 resp.data.forEach( (element: any) => {
                     const tempExp : ExpenseModel =getExpenseObject(element);
                     expArray.push( tempExp )
                 })
     
                 return expArray
             } 
             else
                 return expArray
        } catch (error) {
            console.error("Failed to fetch expenses", error);
            return [];
        }
    };
    const getExpense = async  (expenseId: Number): Promise<ExpenseModel>  => {

        const resp = await axiosInstance.get( "/GetExpense/" + session.user?.CustomerId + "/" + expenseId)
          console.log('pure raw:',resp)
        const exp = getExpenseObject(resp.data)
        console.log('raw single',exp)
        return exp
    }
    
   const getCategoryDetails= async(categoryId:number): Promise<CategoryData> =>{
    let  categoryData:CategoryData ={billableToClient:false,billRequired:false}
    try {
      const {data}=  await axiosInstance.get(`/GetCategoryData/${categoryId}`)
       categoryData.billRequired=data.billRequired
       categoryData.billableToClient=data.billableToClient
    } catch (error) {
      console.error(error)
    }
    return categoryData;
   }
      
    const saveExpense = async (model: FormData): Promise<boolean> => {
        try {
            await axiosInstance.post("SaveExpense", model, {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                }
            });
          return true;
        } catch (error) {
          console.error('Error saving expense:', error);
          return false;
        }
      };
    
    const deleteExpense = async  (expenseId: Number): Promise<boolean>  => {

        await axiosInstance.get( "/DeleteExpense/" + expenseId)
        
        return true
    }
    const canEditOrDeleteExpense = (expense: ExpenseModel) : DataAccessCheckModal =>{
      
        let dataAccess : DataAccessCheckModal = {Message:"", OperationAllowed: true}

        if(expense.PaymentId > 0)
            return {Message:"Can't Edit/Delete! Expense has already been reimbursed.",OperationAllowed: false}
        
        if(expense.ApprovalStatusId === 3)
            return {Message:"Can't Edit/Delete! Expense has been approved.",OperationAllowed: false}
        
        if(expense.InvoiceId > 0)
            return {Message:"Can't Edit/Delete! Expense has been billed.",OperationAllowed: false}
        
        return dataAccess
    
     }
    
 
    const getExpenseObject =   (expense: any): ExpenseModel  => {

        let expObj : ExpenseModel = getBlankExpenseObject()

        if(expense.expenseId != null && Number(expense.expenseId) > 0){
            expObj = {
                MatterId:  Number(expense.matterId), 
                MatterCode: expense.matter.matterCode ,
                MatterTitle : expense.matter.matterTitle,
                Client: expense.matter.contact.name,
                ClientId: expense.matter.clientId,
                Amount: expense.amount,
                AmountToDisplay:expense.amountDisplay,
                ExpenseCategory: expense.expenseCategory.categoryType,
                CategoryId: expense.categoryId,
                Date: expense.date,
                Description:  expense.description,
                ExpenseId: expense.expenseId,
                PaymentId: expense.paymentId !== null && expense.paymentId !== undefined ? expense.paymentId: 0,
                CustomerId: expense.customerId,
                CreatedBy:expense.createdBy,
                CreatedByName: expense.createdByUser != null ? expense.createdByUser.associateName:"",
                ExpenseCategories: [],
                ApprovalStatusId: expense.approvalStatusId,
                FileToUpload:[],
                FileAsBase64: "",
                FileName:"",
                InvoiceId: expense.invoiceId != null && Number(expense.invoiceId) > 0 ? expense.invoiceId : 0,
                ExpenseDocuments:getExpenseDocuments(expense.expenseDocuments),
                ActionBy: expense.approvedByUser !== null ? {UserId:expense.approvedByUser.userId , FirstName:expense.approvedByUser.firstName, FullName:expense.approvedByUser.associateName, LastName:expense.approvedByUser.lastName, Password: "", EmailOTP:"", Email:"" } : getBlankUserObject(),
                ApprovalStatus: expense.expenseApprovalStatus !== null ?  {StatusId:expense.expenseApprovalStatus.approvalStatusId, StatusName:expense.expenseApprovalStatus.approvalStatus} :  {StatusId:0,StatusName:""},
                Comments: expense.rejectionComment !== null ? expense.rejectionComment  : "",
                BillableToClient:expense.billableToClient,
                ApproverId:expense.approverId,
                ApproverName:expense.approver !==null ?expense.approver.associateName:"",
            }    
        }
      
        expObj.ExpenseCategories = convertToDropDownItems(expense.expenseCategoryCollection)
        return expObj
    }
    const getExpenseDocuments = (expenseDocs: any[]) : ExpenseDocumentModel[] =>{

        let expDocs : ExpenseDocumentModel[] = []
        
        if(expenseDocs !== null && expenseDocs !== undefined && expenseDocs.length > 0){
            expenseDocs.forEach((expDocObj:any) =>{
                expDocs.push({DocumentId: expDocObj.documentId, DocumentName: expDocObj.document.name })
            } )
        }
        
        return expDocs
    }
    const getBlankExpenseObject =   (): ExpenseModel  => {

        const expObj : ExpenseModel =  {
            MatterId: 0,
            MatterCode: "",
            MatterTitle: "",
            Client: "",
            ClientId: 0,
            Amount: 0,
            AmountToDisplay:"",
            CategoryId: 0,
            Date: "",
            Description: "",
            ExpenseId: 0,
            ExpenseCategory: "",
            PaymentId: 0,
            CustomerId: 0,
            CreatedBy: 0,
            CreatedByName: "",
            ExpenseCategories: [],
            ApprovalStatusId: 0,
            FileToUpload: [],
            FileAsBase64: "",
            FileName: "",
            InvoiceId: 0,
            ExpenseDocuments: [],
            ActionBy: getBlankUserObject(),
            ApprovalStatus: { StatusId: 0, StatusName: "" },
            Comments: "",
            BillableToClient: false,
            ApproverId:0,
            ApproverName:""
        } 
 
         return expObj
     }

     //For searching users
     const searchUsers = async  (searchField: string): Promise<UserModel[]>  => {

        const resp = await axiosInstance.get("/SearchUsers/" + session.user?.CustomerId +"/" + searchField)
        console.log('userList:-'+JSON.stringify(resp))
        if (resp.data != null && resp.data.length > 0) {
            const users: UserModel[] = resp.data.map((element: any) => ({
              UserId: Number(element.value),
              FullName: element.text,
              Email: element.tertieryText,
             
            }));
        
            return users;
          } else {
            return [];
          }
           
    };

    const getExpenseDocument = async (documentId: number)=> {
        try {
            const response = await axiosInstance.get(`DownloadDocument/${documentId}`)
            const { data } = response;
            console.log(data)
      const file = {
      FileByteArray: data.fileByteArray,
      ContentType: data.contentType,
      Name: data.name
    };
    console.log(file)
    await downloadDocument(file);

        }catch{
            
        }
    };
    
    
    // Function to download document
    const downloadDocument = async (file: { FileByteArray: string; ContentType: string; Name: string }) => {
        const { FileByteArray, ContentType, Name } = file;
      
        let base64Data = FileByteArray;
        if (base64Data.startsWith('data:')) {
          base64Data = base64Data.split(',')[1];
        }

        const byteCharacters = atob(base64Data);
      
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
      
       
        const blob = new Blob([byteArray], { type: ContentType });
       console.log("blob",blob)
       console.log(isPlatform)

        if (isPlatform('desktop')) {
           
            const blobUrl = URL.createObjectURL(blob);
            const link = window.document.createElement('a');
            link.href = blobUrl;
            link.download = Name;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else if (Capacitor.isNativePlatform()) {
          
            const base64Data = await blobToBase64(blob);
            console.log("inside this function :-",base64Data)
        
            await Filesystem.writeFile({
              path: Name,
              data: base64Data,
              directory: Directory.Documents,
              encoding: Encoding.UTF8
            });
          } else {
            console.warn('Unsupported platform');
          }
      };
      

      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result?.toString().split(',')[1];
            if (base64data) {
              resolve(base64data);
            } else {
              reject(new Error("Conversion to base64 failed."));
            }
          };
          reader.onerror = reject;
        });
      };

    
    // const blobToBase64 = (blob: Blob): Promise<string> => {
    //     return new Promise((resolve, reject) => {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       reader.onloadend = () => {
    //         const base64data = reader.result?.toString().split(',')[1];
    //         if (base64data) {
    //           resolve(base64data);
    //         } else {
    //           reject(new Error("Conversion to base64 failed."));
    //         }
    //       };
    //       reader.onerror = reject;
    //     });
    //   };



    
    
    
    return {
        getExpenses,getExpense,getBlankExpenseObject,saveExpense,deleteExpense,canEditOrDeleteExpense,searchUsers,getExpenseDocument,getCategoryDetails
    };
};

export default useExpenseManagement;
