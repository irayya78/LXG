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
} from "@ionic/react";
import { calendar, camera, close, image, trash } from "ionicons/icons";
import {
  ExpenseModel,
  MatterModel,
  DropDownItem,
  UserModel,
} from "../../types/types";
import { useMatterManagement } from "../../hooks/useMatterManagement";
import useExpenseManagement from "../../hooks/useExpenseManagement";
import "./expenseForm.css";
import MatterList from "../../components/SearchMatterProps";
import ApproverList from "../../components/SearchUserProps"; // Import the new ApproverList component
import { RouteComponentProps } from "react-router";
import { useSessionManager } from "../../sessionManager/SessionManager";
import { useUIUtilities } from "../../hooks/useUIUtilities";
import { messageManager } from "../../components/MassageManager";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
//import'./expenseForm.css'
interface ExpenseParams extends RouteComponentProps<{ expenseId: string }> { }

const NewExpense: React.FC<ExpenseParams> = ({ match }) => {
  const navigation = useIonRouter();
  const session = useSessionManager();
  const [expenseDate, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
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
  const { getBlankExpenseObject, getExpense, saveExpense, searchUsers } =
    useExpenseManagement();
  const [caption, setCaption] = useState("Create Expense");
  const [expenseId, setExpenseId] = useState<Number>(0);
  const [matterId, setMatterId] = useState<Number>(0);
  const { getCurrentDateAsYYYYMMDD, convertDateToYYYYMMDD } = useUIUtilities();
  const [busy, setBusy] = useState<boolean>(false);
  const [expenseReceiptDoc, setExpenseReceiptDoc] = useState<File[]>([]);
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true);
  const [approvers, setApprovers] = useState<UserModel[]>([]);
  const [approverSearch, setApproverSearch] = useState<string>("");
  const [ApproverId, setSelectedApproverId] = useState<number | null>(null);
  const { showToastMessage ,showAlertMessage,showConfirmMessage} = messageManager();

  const displayApprover = session.user?.DisplayExpenseApprover;
  const allowFutureDatesExpenses =session.user?.AllowFutureDateForExpenseSubmission;

  useEffect(() => {
    validateForm();
  }, [expenseCategoryId, matterId, amount, description]);

  //FOR SAVING THE EXPENSE
 const saveNewExpense = async () => {

  if (!validateForm()) {
    return;
  }

  const formData = new FormData();
  formData.append("ExpenseId", expenseId.toString());
  formData.append("Amount", amount.toString());
  formData.append("Date", expenseDate);
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

  console.log("FormData being sent:", Array.from(formData.entries()));

  try {
    setBusy(true);
    const saved = await saveExpense(formData);
    if (saved) {
      navigation.goBack();
    } else {
      console.error("Failed to save expense");
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
      ? convertDateToYYYYMMDD(expense.Date)
      : getCurrentDateAsYYYYMMDD();
    setExpenseId(expense.ExpenseId);
    setDate(expDate);
    setMatterCode(expense.MatterCode);
    setMatterId(expense.MatterId);
    setAmount(expense.Amount);
    setExpenseCategoryId(expense.CategoryId);
    setDescription(expense.Description);
    setExpenseCategories(expense.ExpenseCategories);
    setBillableToClient(expense.BillableToClient);
    setSelectedApproverId(expense.ApproverId);
   
    
  };


  //For searching matter
  const searchMatter = async (searchValue: string) => {
    setMatterCode(searchValue);
    if (searchValue.length > 2) {
      const matterList = await searchMatters(searchValue);
      setMatters(matterList);
    } else {
      setMatters([]);
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

    if (description.trim() === "") {
      showToastMessage("Description is required!");
      isValid = false;
    }

    if (!expenseDate) {
      showToastMessage("Expense date is required!");
      isValid = false;
    }

    if (expenseCategoryId === 0) {
      showToastMessage("Select a category!");
      isValid = false;
    }

    if (amount <= 0) {
      showToastMessage("Amount should be greater than 0!");
      isValid = false;
    }

    if (matterId === 0) {
      showToastMessage("Select a matter!");
      isValid = false;
    }

    setDisableSaveButton(!isValid);
    return isValid;
  };

  const setDescriptionForCategories = (categoryId: number) => {
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
      <IonContent fullscreen>
        <IonItem>
          <IonLabel position="stacked">Matter</IonLabel>
          <IonInput
            value={matterCode}
            placeholder="Search your matter here..."
            onIonInput={(e: any) => searchMatter(e.target.value)}
          ></IonInput>
        </IonItem>

        <MatterList matters={matters} matterClick={handleSelectMatter} />

        <IonItem>
          <IonLabel position="stacked">Date</IonLabel>
          <IonInput
            type="date"
            value={expenseDate}
            defaultValue={expenseDate}
            onIonChange={(e) => setDate(e.detail.value!)}
            max={
              allowFutureDatesExpenses
                ? undefined
                : new Date().toISOString().substring(0, 10)
            }
          >
            {allowFutureDatesExpenses ? (
              <IonIcon icon={calendar} slot="start" />
            ) : null}
          </IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Select Category </IonLabel>
          <IonSelect 
            value={expenseCategoryId}
            placeholder="Choose category"
            okText="OK"
            cancelText="Cancel"
            onIonChange={(e) => {
              setExpenseCategoryId(e.detail.value);
              setDescriptionForCategories(e.detail.value);
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
            onIonInput={(e: any) => setAmount(Number(e.target.value))}
            
          ></IonInput>
        </IonItem>

        {displayApprover && (
          <>
            <IonItem>
              <IonLabel position="stacked"> Select Approver</IonLabel>
              <IonInput
                value={approverSearch}
                placeholder="Search for an approver..."
                onIonInput={(e: any) => searchApprovers(e.target.value)}
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
        
          
      </IonContent>
     
    
    </IonPage>
  );
};

export default NewExpense;
