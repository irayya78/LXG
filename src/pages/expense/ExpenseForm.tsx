import React, { useState, useEffect } from 'react';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonTextarea, IonTitle, IonToolbar, IonInput, IonSelect, IonSelectOption, IonIcon, IonActionSheet, IonToggle,
  useIonViewDidEnter, useIonRouter,
  IonLoading
} from '@ionic/react';
import { camera, close, image } from 'ionicons/icons';
import { ExpenseModel, MatterModel, DropDownItem } from '../../types/types';
import { useMatterManagement } from '../../hooks/useMatterManagement';
import { usePhoto } from '../../hooks/usePhotos';
import useExpenseManagement from '../../hooks/useExpenseManagement';
import './expenseForm.css';
import MatterList from '../../components/SearchMatterProps';
import { RouteComponentProps } from 'react-router';
import { useSessionManager } from '../../sessionManager/SessionManager';
import { useUIUtilities } from '../../hooks/useUIUtilities';
import { messageManager } from '../../components/MassageMangaer';

interface ExpenseParams extends RouteComponentProps<{ expenseId: string; }> {}

const NewExpense: React.FC<ExpenseParams> = ({ match }) => {
  const navigation = useIonRouter();
  const [expenseDate, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [matter, setMatter] = useState<MatterModel | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [expenseCategoryId, setExpenseCategoryId] = useState<Number>(0);
  const [expenseCategories, setExpenseCategories] = useState<DropDownItem[]>([]);
  const [billableToClient, setBillableToClient] = useState<boolean>(false);
  const { searchMatters } = useMatterManagement();
  const [matters, setMatters] = useState<MatterModel[]>([]);
  const { photos, takePhoto, selectPhoto, removePhoto } = usePhoto();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [matterCode, setMatterCode] = useState('');
  const { getBlankExpenseObject, getExpense, saveExpense } = useExpenseManagement();
  const [caption, setCaption] = useState("Create Expense");
  const [expenseId, setExpenseId] = useState<Number>(0);
  const [matterId, setMatterId] = useState<Number>(0);
  const { getCurrentDateAsYYYYMMDD, convertDateToYYYYMMDD } = useUIUtilities();
  const [busy, setBusy] = useState<boolean>(false)
  const [expenseReceiptDoc, setExpenseReceiptDoc] = useState<File[]>([]);
  const[disableSaveButton, setDisableSaveButton] =  useState<boolean>(true)
  const session = useSessionManager();
  const { showToastMessage } = messageManager();

  useEffect(() => {
    validateForm();
  }, [expenseCategoryId, matterId, amount, description]);

  const saveNewExpense = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('ExpenseId', expenseId.toString());
    formData.append('Amount', amount.toString());
    formData.append('Date', expenseDate);
    formData.append('Description', description);
    formData.append('CategoryId', expenseCategoryId.toString());
    formData.append('MatterId', matterId.toString());
    formData.append('CustomerId', session.user?.CustomerId.toString() || '');
    formData.append('CreatedBy', session.user?.UserId.toString() || '');
    formData.append('BillableToClient', billableToClient ? 'true' : 'false');
  
    // Append photos to FormData
    expenseReceiptDoc.forEach((file: File) => {
      formData.append('FileToUpload', file); 
    });
  
    formData.append('FileAsBase64', ''); 
    formData.append('FileName', ''); 
  
    try {
      const saved = await saveExpense(formData);
      if (saved) {
        navigation.push('/layout/expense', 'forward', 'push');
      } else {
        console.error('Failed to save expense');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };
  
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
    })().then(() => {}).catch((error) => console.error(error));
  });

  const setExpenseData = (expense: ExpenseModel) => {
    const expDate = expense.Date ? convertDateToYYYYMMDD(expense.Date) : getCurrentDateAsYYYYMMDD();
    setExpenseId(expense.ExpenseId);
    setDate(expDate);
    setMatterCode(expense.MatterCode);
    setMatterId(expense.MatterId);
    setAmount(expense.Amount);
    setExpenseCategoryId(expense.CategoryId);
    setDescription(expense.Description);
    setExpenseCategories(expense.ExpenseCategories);
    setBillableToClient(expense.BillableToClient);
    
  };

  const searchMatter = async (searchValue: string) => {
    setMatterCode(searchValue);
    if (searchValue.length > 2) {
      const matterList = await searchMatters(searchValue);
      setMatters(matterList);
    } else {
      setMatters([]);
    }
  };

  const handleSelectMatter = (selectedMatter: MatterModel) => {
    setMatter(selectedMatter);
    setMatterCode(selectedMatter.MatterCode);
    setMatterId(selectedMatter.MatterId);
    setMatters([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const fileArray: File[] = [];
      fileArray.push(files[0]);
      setExpenseReceiptDoc(fileArray);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (description.trim() === '') {
      showToastMessage('Description is required!');
      isValid = false;
    }

    if (!expenseDate) {
      showToastMessage('Expense date is required!');
      isValid = false;
    }

    if (expenseCategoryId === 0) {
      showToastMessage('Select a category!');
      isValid = false;
    }

    if (amount <= 0) {
      showToastMessage('Amount should be greater than 0!');
      isValid = false;
    }

    if (matterId === 0) {
      showToastMessage('Select a matter!');
      isValid = false;
    }

    setDisableSaveButton(!isValid);
    return isValid;
  };

  const setDescriptionForCategories = (categoryId: number) => {
    const selectedCategory = expenseCategories.find(cat => cat.Value === categoryId);
    if (selectedCategory) {
      setDescription(`Expenses incurred for ${selectedCategory.Text}.`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/layout/expense" />
          </IonButtons>
          <IonTitle>{caption}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait..." duration={0} isOpen={busy}></IonLoading>
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
            onIonChange={(e) => setDate(e.detail.value!)}
            
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Select Category</IonLabel>
          <IonSelect
            value={expenseCategoryId}
            okText="OK"
            cancelText="Cancel"
            onIonChange={e => {
              setExpenseCategoryId(e.detail.value);
              setDescriptionForCategories(e.detail.value);
            }}
          >
            {expenseCategories.map(expCategory => (
              <IonSelectOption key={expCategory.Value} value={expCategory.Value}>
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
            onIonInput={(e:any)=>setAmount(Number(e.target.value))}
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            placeholder="Enter Description"
            value={description}
            onIonChange={(e) => setDescription(e.detail.value!)}
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
          <IonButton className="camera-button" onClick={() => setShowActionSheet(true)}>
            <IonIcon icon={camera} />
          </IonButton>
        </div>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Take Photo',
              icon: camera,
              handler: takePhoto,
            },
            {
              text: 'Choose from Gallery',
              icon: image,
              handler: selectPhoto,
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
            },
          ]}
        ></IonActionSheet>

        <div className="photos-container">
          {photos.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={photo.webviewPath} alt="Expense" />
              <div className="remove-button" onClick={() => removePhoto(photo.filepath)}>
                <IonIcon icon={close} />
              </div>
            </div>
          ))}
        </div>

        <IonButton expand="block" onClick={saveNewExpense} disabled={disableSaveButton}>
          Save
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default NewExpense;
