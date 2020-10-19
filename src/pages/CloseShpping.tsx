import { 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonButtons, 
    IonList, 
    IonItem, 
  IonLabel,
  IonGrid,
  IonRow,
  IonListHeader,
  IonItemSliding, } from '@ionic/react';
  import React, { useState, useEffect } from 'react';
  import { useHistory } from 'react-router'
  import fire from '../firebaseConfig';
  import { Plugins } from '@capacitor/core';

  
  
  
  
  
  
  
  const CloseShippingPaper: React.FC = () => {
    
    const [chem_list, setChemlist] = useState([{}])
    const [ID, setID] = useState<string>();
    const [document_id, setDocumentid] = useState<string>();
    const [Origin, setOrigin] = useState<string>();
    const [Destination, setDestination] = useState<string>();

  
    
    const { Storage } = Plugins;
   
  
  
    
    
  
    const history = useHistory()
  
    function back(){
      
      history.replace('/dashboard')
  }

  function deletedata(){
    Storage.clear();
    back()
}
  
    useEffect(() => {
        getItem();
    }, [])

    function submit(){

      console.log(document_id)


      fire 
      .firestore()
      .collection('asset_data').doc(document_id).update({
       
        active: 0
      })
      .then(function(){
        Storage.clear();
        back()
      })
      .catch(function(error){
        console.error("Error writing document: ", error);
        
      })
        
      
  }


    async function getItem() {
        const { value } = await Storage.get({ key: 'Shipping_paper' });
        if(value){
          
          var info: any = JSON.parse(value)
          setDocumentid(info.id)
          
          setChemlist(info.chemicals)
       
          setID(info.data.datanumber)
          setDestination(info.data.destinationwarehousenumber)
          setOrigin(info.data.originwarehousenumber)
        }
        
        
      }
  
  
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Shipping Paper</IonTitle>
            <IonButtons onClick = {back} slot="end">Back</IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
  
  
        <IonGrid>
        <IonRow>
        <IonList>
            <IonItem>
    <IonLabel>Data ID:  {ID}</IonLabel>
            </IonItem>
              <IonItem>
    <IonLabel>Origin Warehouse: {Origin}</IonLabel>
            </IonItem>
            <IonItem>
    <IonLabel>Destination Warehouse: {Destination}</IonLabel>
            
            </IonItem>
            
  
            
            </IonList>
        </IonRow>
  
        <IonRow >
  
        <IonContent
         style={{
          height : '15em'}}
        className="ion-padding"
         scrollEvents={true}
        onIonScrollStart={() => {}}
        onIonScroll={() => {}}
        onIonScrollEnd={() => {}}>
  
          <IonListHeader>
            Chemicals
          </IonListHeader>
          <IonList>
          
          
          { chem_list.filter(type => Object.keys(type).length != 0).map((info: any, index) => (
                    <IonItemSliding>
                   
                    <IonLabel >{info.name}:  {info.quantity}</IonLabel>
                    
                  
                    </IonItemSliding>
                  ))}
         
         
      </IonList>
      <IonButton color="primary" expand="full" onClick = {submit}>Close Shipping Paper</IonButton>
      <IonButton color="danger" expand="full" onClick = {deletedata}>Clear Data</IonButton>
        
          </IonContent>
       
        </IonRow>
        </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default CloseShippingPaper;
  