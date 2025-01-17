import React, { useState, useEffect } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonActionSheet,
  IonToggle,
  useIonViewDidEnter,
  useIonRouter,
  IonLoading,
  IonText,
  IonImg,
  IonSearchbar,
  IonDatetime,
  IonPopover,
} from "@ionic/react";
import { calendar, camera, close, image, informationCircle, informationCircleOutline, trash } from "ionicons/icons";
import {
  ExpenseModel,
  MatterModel,
  DropDownItem,
  UserModel,
  CategoryData,
} from "../../types/types";
import { useMatterManagement } from "../../hooks/useMatterManagement";
import useExpenseManagement from "../../hooks/useExpenseManagement";
import MatterList from "../../components/SearchMatterProps";
import ApproverList from "../../components/SearchUserProps"; 
import { RouteComponentProps } from "react-router";
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useUIUtilities } from "../../hooks/useUIUtilities";
import { messageManager } from "../../components/MassageManager";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import ValidationMessage from "../../components/ValidationMessageProps";
import { format } from 'date-fns';
interface ExpenseParams extends RouteComponentProps<{ expenseId: string }> { }

const NewExpense: React.FC<ExpenseParams> = ({ match }) => {
  const navigation = useIonRouter();
  const session = useSessionManager();
  const [expenseDate, setExpenseDate] = useState<string>();

  const [matter, setMatter] = useState<MatterModel | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [expenseCategoryId, setExpenseCategoryId] = useState<Number>(0);
  const [expenseCategories, setExpenseCategories] = useState<DropDownItem[]>(
    []
  );
  const [billableToClient, setBillableToClient] = useState<boolean>(false);
  const { searchMatters } = useMatterManagement();
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [matterCode, setMatterCode] = useState("");
  const { getBlankExpenseObject, getExpense, saveExpense, searchUsers,getCategoryDetails } =
    useExpenseManagement();
  const [caption, setCaption] = useState("Create Expense");
  const [expenseId, setExpenseId] = useState<Number>(0);
  const [matterId, setMatterId] = useState<Number>(0);
  const { getCurrentDateAsYYYYMMDD, convertDateToYYYYMMDD,getCurrentDate} = useUIUtilities();
  const [busy, setBusy] = useState<boolean>(false);
  const [expenseReceiptDoc, setExpenseReceiptDoc] = useState<File[]>([]);
  const [documentLength,setDocumentLength]=useState<number>(0);
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true);
  const [approvers, setApprovers] = useState<UserModel[]>([]);
  const [approverSearch, setApproverSearch] = useState<string>("");
  const [ApproverId, setSelectedApproverId] = useState<number | null>(null);
  const [validationMessage,setValidationMessage]=useState<string>("");
  const [billRequired,setBillRequired]=useState<boolean>(false)
  const displayApprover = session.user?.DisplayExpenseApprover;
  const allowFutureDatesExpenses =session.user?.AllowFutureDateForExpenseSubmission;
  const allowBackDatesExpense=session.user?.BackDatedExpenseEntryAllowedDays
   const [isOpen, setOpenDate] = useState(false);
   const [showAutoDescription,setShowAutoDescription]=useState<boolean>(false)
  useEffect(() => {
    validateForm(); 
    console.log(matterId)
  }, [expenseCategoryId, matterId, amount, description,ApproverId,expenseReceiptDoc,expenseDate,billRequired]);

  //FOR SAVING THE EXPENSE
 const saveNewExpense = async () => {

  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append("ExpenseId", expenseId.toString());
  formData.append("Amount", amount.toString());
  formData.append("Date", expenseDate!);
  formData.append("Description", description);
  formData.append("CategoryId", expenseCategoryId.toString());
  formData.append("MatterId", matterId.toString());
  formData.append("CustomerId", session.user?.CustomerId.toString() || "");
  formData.append("CreatedBy", session.user?.UserId.toString() || "");
  formData.append("BillableToClient", billableToClient ? "true" : "false");
  formData.append("ApproverId", ApproverId?.toString() || "");

  // Append photos to FormData
  expenseReceiptDoc.forEach((file: File) => {
    formData.append("FileToUpload", file);
  });
 

  try {
    setBusy(true);
    const saved = await saveExpense(formData);
    if (saved) {
      navigation.push('/layout/expense','back','push');
    } else {
      navigation.push('/layout/expense','back','push');
    }
  } catch (error) {
    console.error("Error saving expense:", error);
  } finally {
    setBusy(false);
  }
};
  //When we are entering this page Checking the is it For update or crate
  useIonViewDidEnter(() => {
    (async () => {
      let paramExpenseId = Number(match.params.expenseId);
      let exp: ExpenseModel = getBlankExpenseObject();

      if (paramExpenseId > 0) {
        setBusy(true);
        setCaption("Update Expense");
      } else {
        paramExpenseId = 0;
        setShowAutoDescription(true)
      }

      exp = await getExpense(paramExpenseId);
      setExpenseData(exp);
      setBusy(false);
    })()
      .then(() => { })
      .catch((error) => console.error(error));
  });

  //Set the data of expense for update page
  const setExpenseData = (expense: ExpenseModel) => {
    const expDate = expense.Date
      ? expense.Date 
      : getCurrentDate();
    setExpenseId(expense.ExpenseId);
    setExpenseDate(expDate);
    setMatterCode(expense.MatterCode);
    setMatterId(expense.MatterId);
    setAmount(expense.Amount);
    setExpenseCategoryId(expense.CategoryId);
    setDescription(expense.Description);
    setExpenseCategories(expense.ExpenseCategories);
    setBillableToClient(expense.BillableToClient);
    setSelectedApproverId(expense.ApproverId);
    setApproverSearch(expense.ApproverName)
    setDocumentLength(expense.ExpenseDocuments.length)
  };


  //For searching matter
  const searchMatter = async (searchValue: string) => {
    setMatterCode(searchValue);
    if (searchValue.length > 2) {
      const matterList = await searchMatters(searchValue);
      setMatters(matterList);
    } else {
      setMatters([]);
      setMatterId(0)
    }
  };

  //after matter selected
  const handleSelectMatter = (selectedMatter: MatterModel) => {
    setMatter(selectedMatter);
    setMatterCode(selectedMatter.MatterCode);
    setMatterId(selectedMatter.MatterId);
    setMatters([]);
  };

  // Save button enable and disable function 
  const validateForm = () => {
    let isValid = true;
    console.log("value of Doc Length:-",documentLength);
     setValidationMessage("")
    if(billRequired&&expenseReceiptDoc.length <= 0&& documentLength <= 0){
      setValidationMessage ("A receipt must be attached for this category to continue.");
      isValid = false;
    }
    if (description.length <= 0) {
      setValidationMessage ("Description is required!");
      isValid = false;
    }
  
    if(displayApprover&&ApproverId!<=0){
      setValidationMessage("Select a Approver!");
      isValid = false;
    }
    if (!expenseDate) {
     setValidationMessage("Select a Date!");
      isValid = false;
    }


    if (amount <= 0) {
      setValidationMessage("Amount should be greater than 0!");
      isValid = false;
    }
    if (expenseCategoryId === 0) {
      setValidationMessage("Select a category!");
      isValid = false;
    }

    if (matterId === 0) {
      setValidationMessage("Select a matter!") ;
      isValid = false;
    }

    setDisableSaveButton(!isValid);
    return isValid;
  };

  const setDescriptionForCategories = (categoryId: number) => {
    if(!showAutoDescription) return false;
    const selectedCategory = expenseCategories.find(
      (cat) => cat.Value === categoryId
    );
    if (selectedCategory) {
      setDescription(`Expenses incurred for ${selectedCategory.Text}.`);
    }
  };

  //For searching Approver's
  const searchApprovers = async (searchValue: string) => {
    setApproverSearch(searchValue);
    if (searchValue.length > 2) {
      const approversList = await searchUsers(searchValue);
      setApprovers(approversList);
    } else {
      setApprovers([]);
      setSelectedApproverId(0)
      
    }
  };

  const handleSelectApprover = (selectedApprover: UserModel) => {
    setSelectedApproverId(selectedApprover.UserId);
    setApproverSearch(selectedApprover.FullName);
    setApprovers([]);
  };


 
  const handleFileRemove = (index: number) => {
    setExpenseReceiptDoc((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileChange = async (source: CameraSource) => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: source,
        quality: 100,
      });
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      const file = new File([blob], `recipts${Date.now()}.jpeg`, {
        type: "image/jpeg",
      });
      setExpenseReceiptDoc((prevFiles) => [...prevFiles, file]);
    } catch (error) {
      console.error("Error taking/selecting photo:", error);
    }
  };

 
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Number(allowBackDatesExpense)); // Subtract the number of days allowed for backdating
    return date.toISOString().substring(0, 10);
  };

  const getMaxDate = () => {
    if (!allowFutureDatesExpenses) {
      const date = new Date();
      return date.toISOString().substring(0, 10);
    }
    return undefined;
  };
  

  const handleCategoryChange= async(categoryId:number)=>{
       console.log("categoryId",categoryId)
       setExpenseCategoryId(categoryId);
       setDescriptionForCategories(categoryId);
       const data:CategoryData=  await getCategoryDetails(categoryId);
       setBillableToClient(data.billableToClient);
       setBillRequired(data.billRequired) 
      

  }
  const formatDateToDDMMYYYY = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB'); 
  };

  const handleDateChange = (value: string) => {
    const formattedDate = formatDateToDDMMYYYY(value);
    setExpenseDate(formattedDate);
    setOpenDate(false);
    console.log("exp:",expenseDate)
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
        <IonButtons slot="start">
         <IonBackButton defaultHref="/layout/expense" />
      </IonButtons>
       <IonButtons slot="end">
       <IonButton
      onClick={saveNewExpense}
      disabled={disableSaveButton}
      shape="round"
      >
    Save
  </IonButton>
</IonButtons>

          <IonTitle>{caption}</IonTitle>
         
        </IonToolbar> 
       
      </IonHeader>
      <IonLoading
        message="Please wait..."
        duration={0}
        isOpen={busy}
      ></IonLoading>
      <IonContent className="page-content" >
      <div className="inputsFileds">
        <IonItem className="matter-search">
        <IonLabel position="stacked">Select Matter</IonLabel>
          <IonInput className="matter-search-bar"
            value={matterCode}
            placeholder="Search your matter here..."
            onIonInput={(e: any) => searchMatter(e.detail.value)}
          ></IonInput>

        </IonItem>

        <MatterList matters={matters} matterClick={handleSelectMatter} />

    <IonItem>
    <IonLabel position="stacked">Date</IonLabel>
      <IonInput
        type="text"
        value={expenseDate || ''}
        onFocus={() => setOpenDate(true)}
        placeholder="Select Date"
        readonly
      />

      {isOpen && (
        <IonDatetime
          value={convertDateToYYYYMMDD(expenseDate!)}
          presentation="date"
          locale="en-GB"
          max={getMaxDate()}
          min={getMinDate()}
          onIonChange={(e) => handleDateChange(e.detail.value as string)}
        />
      )}
</IonItem>

       
        <IonItem>
          <IonLabel position="stacked">Select Category </IonLabel>
          <IonSelect 
            value={expenseCategoryId}
            placeholder="Choose category"
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e:any) => {
              handleCategoryChange(e.detail.value)
            }}
          >
            {expenseCategories.map((expCategory) => (
              <IonSelectOption
                key={expCategory.Value}
                value={expCategory.Value}
                
              >
                {expCategory.Text}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Amount</IonLabel>
          <IonInput 
            type="number"
            value={amount}
            placeholder="Enter Amount"
            onIonInput={(e: any) => setAmount(Number(e.detail.value))}
            
          ></IonInput>
        </IonItem>

        {displayApprover && (
          <>
            <IonItem>
              <IonLabel position="stacked"> Select Approver</IonLabel>
              <IonInput
                value={approverSearch}
                placeholder="Search for an approver..."
                onIonInput={(e: any) => searchApprovers(e.detail.value)}
              ></IonInput>
            </IonItem>
           
            <ApproverList
              approvers={approvers}
              onApproverSelect={handleSelectApprover}
            />
          </>
        )}

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            placeholder="Enter Description"
            value={description}
            onIonInput={(e) => setDescription(e.detail.value!)}
          ></IonTextarea>
        </IonItem>

        <IonItem>
          <IonLabel>Billable to Client</IonLabel>
          <IonToggle
            checked={billableToClient}
            onIonChange={(e) => setBillableToClient(e.detail.checked)}
          />
        </IonItem>

        <div className="centered-button-container">
          <IonButton
            onClick={() => setShowActionSheet(true)}
          >
            <IonIcon icon={camera} slot="start" />
            Attach Receipt
          </IonButton>
        </div>
        </div>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Take Photo",
              icon: camera,
              handler: () => {
                handleFileChange(CameraSource.Camera);
              },
            },
            {
              text: "Choose from Gallery",
              icon: image,
              handler: () => {
                handleFileChange(CameraSource.Photos);
              },
            },
            {
              text: "Cancel",
              icon: close,
              role: "cancel",
            },
          ]}
        ></IonActionSheet>

    
        {expenseReceiptDoc.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {expenseReceiptDoc.map((file, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: "10px",
                }}
              >
                <IonImg
                  src={URL.createObjectURL(file)}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <IonIcon
                  icon={close}
                  onClick={() => handleFileRemove(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    cursor: "pointer",
                    background: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                />
              </div>
            ))}
          </div>
        )}
         <ValidationMessage message={validationMessage}/>
          
      </IonContent>
     
    
    </IonPage>
  );
};

export default NewExpense;
