import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonButtons, 
  IonList, 
  IonModal, 
  IonItem, 
  IonInput,
IonLabel,
IonSelect,
IonGrid,
IonRow,
IonSelectOption,
IonListHeader,
IonFabButton } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import * as firebase from 'firebase'
import fire, { getUserInfo } from '../firebaseConfig';
import { Plugins } from '@capacitor/core';
import { isEmptyBindingElement } from 'typescript';




const ShippingPapers: React.FC = () => {
  const [warehouses, setWarehouses] = useState([''])
  const [chem_list, setChemlist] = useState([{}])
  
  const [chemicals, setChemicals] = useState([''])
  const [coordinates, setCoordinates] = useState({})
  const { Geolocation } = Plugins;
  const [comment, setComment] = useState<string>();
  const [gallons, setGallons] = useState<number>();
  const [truck, setTruck] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [chemical, setChemical] = useState<string>('');
  const [destination, setDestination] = useState<string>();
  const [showModal, setShowModal] = useState(false);

  console.log(chem_list)
  

  const history = useHistory()

  function back(){
    
    history.replace('/dashboard')
}

function addchemical(){
  setShowModal(true);
}

function addchem(){

// Create a new array based on current state
  

  let list = chem_list.map(obj => ({...obj}));





var data = { 
  name: chemical,
  quantity: gallons
};




// Add item to it
list.push(data);

setChemlist(list)




  setChemical('');
  setGallons(0);
  setShowModal(false);
}


  async function submit(){
    var data = await getUserInfo();
    if(data){
      
    fire 
          .firestore()
          .collection('asset_data').add({
            "datanumber": "SP-" + Math.round((new Date().getTime() / 1000)),
            "createdby": data.email,
            "originwarehousenumber": origin,
            "destinationwarehousenumber": destination,
            "trucknumber": truck,
            "date": new Date(),
            "comments": comment,
            "gps": coordinates,
            type: "shipping_papers"
          })
          .then(function(){
           
            console.log("Document successfully written!");
          })
          .catch(function(error){
            console.error("Error writing document: ", error);
           
          })

        }

    
  }

  async function getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    var lat = coordinates.coords.latitude;
    var long = coordinates.coords.longitude;
    setCoordinates(lat + ','+ long)
    
  }


  useEffect(() => {

    getCurrentPosition();
    let warehouse: any[] = [];
    let chemical: any[] = [];
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
      // Get Chemicals
      fire
      .firestore()
      .collection('assets').where('type', '==', 'chemical')
      .onSnapshot((snapshot) => {
        const chemical_list = snapshot.docs.map(((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        for (var key in chemical_list) {
          chemical.push(chemical_list[key])
        }
        console.log(chemical_list)
        setChemicals(chemical)
      })

  }, [])



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
            <IonLabel>Origin Warehouse</IonLabel>
            <IonSelect value={origin} placeholder="Select One" onIonChange={e => setOrigin(e.detail.value)}>
            { warehouses.map((info: any) => (
                  <IonSelectOption key={info.id} value={info.name}>{info.warehousenumber}  {info.name}</IonSelectOption>
                ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Destination Warehouse</IonLabel>
            <IonSelect value={destination} placeholder="Select One" onIonChange={e => setDestination(e.detail.value)}>
            { warehouses.map((info: any) => (
                  <IonSelectOption key={info.id} value={info.name}>{info.warehousenumber}  {info.name}</IonSelectOption>
                ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput value={truck} placeholder="Truck Number" onIonChange={e => setTruck(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonInput value={comment} placeholder="Comments" onIonChange={e => setComment(e.detail.value!)}></IonInput>
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
        
        
        { chem_list.filter(type => Object.keys(type).length != 0).map((info: any) => (
                  <IonItem>
                  <IonLabel >{info.name}:  {info.quantity}</IonLabel>
                  </IonItem>
                ))}
       
       
    </IonList>
      <IonFabButton size="small" color="danger" onClick = {addchemical}>+</IonFabButton>
        </IonContent>
     
      </IonRow>
      </IonGrid>




      
      {/* <IonButtons onClick = {submit} >Submit Data</IonButtons> */}
        
      <IonModal isOpen={showModal} cssClass='my-custom-class'>
      <IonGrid>
      <IonRow>
      <IonLabel>Destination Warehouse:</IonLabel>
      <IonSelect value={chemical} placeholder="Select One" onIonChange={e => setChemical(e.detail.value)}>
            { chemicals.map((info: any) => (
                  <IonSelectOption key={info.id} value={info.tradename}>{info.tradename}</IonSelectOption>
                ))}
            </IonSelect>
      </IonRow>
      <IonRow>


      <IonLabel>Enter Gallons:</IonLabel>
      
          <IonItem>
            <IonInput type="number" value={gallons} placeholder="Enter Number" onIonChange={e => setGallons(parseInt(e.detail.value!, 10))}></IonInput>
          </IonItem>
      </IonRow>
      </IonGrid>


    
          
        <IonButton onClick={addchem}>Close Modal</IonButton>
      </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ShippingPapers;
