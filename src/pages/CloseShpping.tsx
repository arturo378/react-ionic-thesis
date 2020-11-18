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
    const [warehouses, setWarehouses] = useState([''])
    const [warehousechem_list, setWarehouseChemlist] = useState([{}])

  
    
    const { Storage } = Plugins;
   
  
  
    console.log(chem_list)
    
  
    const history = useHistory()
  
    function back(){
      
      history.replace('/dashboard')
  }

  function deletedata(){
    Storage.clear();
    back()
}
  
    useEffect(() => {
      
    let warehouse: any[] = [];
   
    let warehousechem: any[] = [];
    //Get Warehouses
    fire
      .firestore()
      .collection('assets').where('type', '==', 'warehouse')
      .onSnapshot((snapshot) => {
        const warehouse_list = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        for (var key in warehouse_list) {
          warehouse.push(warehouse_list[key])
        }
        setWarehouses(warehouse) 
      })

      fire
      .firestore()
      .collection('asset_data').where('type', '==', 'warehouse_chemical')
      .onSnapshot((snapshot) => {
        const warehousechem_list = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
          
        })))
        for (var key in warehousechem_list) {
          warehousechem.push(warehousechem_list[key])
        }
        setWarehouseChemlist(warehousechem) 
      }) 




        getItem();
    }, [])

    function submit(){

      for(var x of chem_list){
        const AddData: any = x;
        for(var info of warehouses){
          const warehouse: any = info;
          if(warehouse.name === Destination){
            for(var warehousechem of warehousechem_list){
              const wchem: any = warehousechem;
              if(warehouse.id === wchem.warehouseid && wchem.name === AddData.name ){
              const newamount = parseInt(wchem.quantity)+parseInt(AddData.quantity)
              fire 
              .firestore()
              .collection('asset_data').doc(wchem.id).update({
                'quantity': newamount
              })
              .then(function(){
                console.log('Warehouse Invetnory Updated')
              })
              .catch(function(error){
                console.error("Error writing document: ", error);
              })
              }
            }
          }
        }
      }


    


      fire 
      .firestore()
      .collection('asset_data').doc(document_id).update({
       
        active: 1
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
            <IonTitle>Close Shipping Paper</IonTitle>
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
          
          
          { chem_list.filter((type: any) => type.name != undefined).map((info: any, index) => (
                    <IonItemSliding>
                   
                    <IonLabel >{info.name}:  {info.quantity}</IonLabel>
                    
                  
                    </IonItemSliding>
                  ))}
         
         
      </IonList>
     
        
          </IonContent>
       
        </IonRow>
        <IonRow> <IonButton color="primary" expand="full" onClick = {submit}>Close Shipping Paper</IonButton>
      <IonButton color="danger" expand="full" onClick = {deletedata}>Clear Data</IonButton></IonRow>
        </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default CloseShippingPaper;
  