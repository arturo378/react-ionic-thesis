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
IonFabButton,
IonItemSliding} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router'
import fire, { getUserInfo } from '../firebaseConfig';
import { Plugins } from '@capacitor/core';







const ShippingPapers: React.FC = () => {
  const [warehouses, setWarehouses] = useState([''])
  const [chem_list, setChemlist] = useState([{}])
  const [warehousechem_list, setWarehouseChemlist] = useState([{}])
  const [chemicals, setChemicals] = useState([''])
  const [coordinates, setCoordinates] = useState({})
  const { Geolocation } = Plugins;
  const { Storage } = Plugins;
  const [comment, setComment] = useState<string>();
  const [gallons, setGallons] = useState<number>();
  const [truck, setTruck] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [chemical, setChemical] = useState<string>('');
  const [destination, setDestination] = useState<string>();
  const [showModal, setShowModal] = useState(false);

  
  

  const history = useHistory()

  function back(){
    
    history.replace('/dashboard')
}

function addchemical(){
  setShowModal(true);
}
function removechemical(e: any, index: number){

  let list = chem_list.filter(type => Object.keys(type).length != 0).map(obj => ({...obj}));

  list.splice(index,1)
  setChemlist(list)
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
            "active": 0, 
            type: "shipping_papers"
          })
          .then(ref => {
            console.log(ref.id)
            if(ref.id){
              for(var x of chem_list){
                const AddData: any = x;
                for(var info of warehouses){
                  const warehouse: any = info;
                  if(warehouse.name === origin){
                    for(var warehousechem of warehousechem_list){
                      const wchem: any = warehousechem;
                      if(warehouse.id === wchem.warehouseid && wchem.name === AddData.name ){
                      const newamount = wchem.quantity-AddData.quantity
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
                if(AddData.name && AddData.quantity){
                  fire 
                  .firestore()
                  .collection('asset_data').add({
                    "name": AddData.name,
                    "quantity": AddData.quantity,
                   "shippingid": ref.id,
                   "type": "shipping_chemical"
                  })
                  .then(function(){
                    console.log("Document successfully written!");
                  })
                  .catch(function(error){
                    console.error("Error writing document: ", error);
                  })
                }
              }
              set('Shipping_paper', ref.id)
            }
            console.log("Document successfully written!");
          })
          .catch(function(error){
            console.error("Error writing document: ", error);
          })

        }

    
  }



   async function set(key: string, value: any): Promise<void> {
     let total ={
       data: {"datanumber": "SP-" + Math.round((new Date().getTime() / 1000)),
       "originwarehousenumber": origin,
       "destinationwarehousenumber": destination,
       "trucknumber": truck,
       "date": new Date(),
       "comments": comment,
       "gps": coordinates,
       type: "shipping_papers"},
       chemicals: chem_list,
       id: value
     }
    await Storage.set({
      key: key,
      value: JSON.stringify(total)
    });
    history.replace('/dashboard')
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
        console.log(warehousechem_list)
        for (var key in warehousechem_list) {
          warehousechem.push(warehousechem_list[key])
        }
        setWarehouseChemlist(warehousechem) 
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
        
        
        { chem_list.filter(type => Object.keys(type).length != 0).map((info: any, index) => (
                  <IonItemSliding>
                  <IonItem type ='button' onClick={e => removechemical(info, index)}>
                  <IonLabel >{info.name}:  {info.quantity}</IonLabel>
                  
                  </IonItem>
                  </IonItemSliding>
                ))}
       
       
    </IonList>
      
        </IonContent>
     
      </IonRow>

      <IonRow>
      <IonFabButton size="small" color="danger" onClick = {addchemical}>+</IonFabButton>
      </IonRow>
      <IonRow>
      <IonButton  color="primary" expand="full" onClick = {submit}>Submit</IonButton>
      </IonRow>
      </IonGrid>




      
      {/* <IonButtons onClick = {submit} >Submit Data</IonButtons> */}
        
      <IonModal isOpen={showModal} cssClass='my-custom-class'>
      <IonGrid>
      <IonRow>
      <IonLabel>Add Chemical:</IonLabel>
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


    
          
        <IonButton onClick={addchem}>Add Chemical</IonButton>
      </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ShippingPapers;
