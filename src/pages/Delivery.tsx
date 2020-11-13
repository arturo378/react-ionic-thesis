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
  IonItemSliding } from '@ionic/react';
  import React, { useState, useEffect } from 'react';
  import { useHistory } from 'react-router'
  import fire, { getUserInfo } from '../firebaseConfig';
  import { Plugins } from '@capacitor/core';
  
  
  
  
  
  
  
  
  const Delivery: React.FC = () => {
    const [CLW, setCLW] = useState([])
   
   
    
    const [coordinates, setCoordinates] = useState({})
    const { Geolocation } = Plugins;
    const { Storage } = Plugins;
    const [comment, setComment] = useState<string>();
    const [company, setCompany] = useState<string>();
    const [companyname, setCompanyname] = useState<string>();
    const [leasename, setLeasename] = useState<string>();
    const [wellname, setWellname] = useState<string>();
    const [companyid, setCompanyid] = useState<string>();
    const [chemicals, setChemicals] = useState(['']) //from storage
    const [delverychems, setDeliveryChems] = useState([{}]) //list to be submitted
    const [lease, setLease] = useState<string>();
    const [leaseid, setLeaseid] = useState<string>();
    const [well, setWell] = useState<string>();
    const [chemical, setChemical] = useState<string>();
    const [showModal, setShowModal] = useState(false);
    const [gallons, setGallons] = useState<number>(0);

    


  
   

    function removechemical(e: any, index: number){

      let list = delverychems.filter(type => Object.keys(type).length != 0).map(obj => ({...obj}));
    
      list.splice(index,1)
      setDeliveryChems(list)
    }


    async function getItem(key: String) {

    
      const  {value}  = await Storage.get({ key: 'Shipping_paper' });

      if(key == "first"){
        var chemlist= []
          if(value){
       var data = JSON.parse(value)
       console.log(data)
        setChemicals(data.chemicals) 
      }
      }else{
        if(value){
          var data = JSON.parse(value)
          return data;
        } 
      }  
    }

    const history = useHistory()
  
    function back(){
      
      history.replace('/dashboard')
  }
  
  function addchemical(){
    setShowModal(true);
  }

  function setcompanyid(data: any){
    if(data.detail.value.id){
      setCompany(data.detail.value);
      setCompanyname(data.detail.value.name);
      setCompanyid(data.detail.value.id);
    }
    
   
  }


  function setleaseid(data: any){
    if(data.detail.value.id){
      setLease(data.detail.value);
      setLeaseid(data.detail.value.id);
      setLeasename(data.detail.value.name);
    }

  }

    function setwellid(data: any){
      if(data.detail.value.id){
        setWell(data.detail.value);
      
        setWellname(data.detail.value.name);
      }
    
   
  }


  function addchem(){

    delverychems.map(function(key:any, val2){

      if(key.name == chemical){
        alert("Chemical already on the list!")

      }


    })

    chemicals.map(function(val: any){
      if(val.name == chemical){
        if(val.quantity<gallons){
          alert("Pease Enter quantity less than:"+ val.quantity )
        }else{

          let list = delverychems.map(obj => ({...obj}));
            var data = { 
              name: chemical,
              quantity: gallons
            };


          list.push(data);

          setDeliveryChems(list)
            setChemical('');
            setGallons(0);
            setShowModal(false);



        }
      }
    })

    
    }


  
  
    async function submit(){
      var data = await getUserInfo();
      let updatedlist: any = [];
      let newgallons: any;
        chemicals.map(function(key:any, val){
          updatedlist.push(key)
          delverychems.map(function(key2:any, val2){
            if(key.name == key2.name){
              newgallons = key.quantity-key2.quantity;
              updatedlist[val].quantity= newgallons;
            }
          })
      })
              if(data){
                fire 
                .firestore()
                .collection('asset_data').add({
                  "company": companyname,
                  "companyid": companyid,
                  "lease": leasename,
                  "well": wellname,
                  "gps": coordinates,
                  "comments": comment,
                  "datanumber": "D-" + Math.round((new Date().getTime() / 1000)),
                  "createdBy": data.email,
                  "date": new Date(),
                  type: "delivery",
                  "active": 0
                })
                .then(ref => {
                  console.log(ref.id)
                  if(ref.id){
                    for(var x of delverychems){
                      const AddData: any = x;
                      if(AddData.name && AddData.quantity){
                        fire 
                        .firestore()
                        .collection('asset_data').add({
                          "name": AddData.name,
                          "quantity": AddData.quantity,
                         "deliveryid": ref.id,
                         "type": "delivery_chemical"
                        })
                        .then(function(){
                          console.log("Document successfully written!");
                        })
                        .catch(function(error){
                          console.error("Error writing document: ", error);
                        })
                      }
                    }
                     set('Shipping_paper')
                  }
                  
      
      
      
      
                  console.log("Document successfully written!");
                })

                .catch(function(error){
                  console.error("Error writing document: ", error);
                
                })
              }
                    

              async function set(key: string): Promise<void> {

                var info = await getItem("get");
      
                
              info.chemicals =  updatedlist;
               if(info){

              
               await Storage.set({
                 key: key,
                 value: JSON.stringify(info)
               });
                }
               history.replace('/dashboard')
             }

             




      console.log(updatedlist)
    }

    async function submit2(){
      var info = await getItem("get");

      console.log(info)

      

    }
  
  
  
     
    async function getCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      var lat = coordinates.coords.latitude;
      var long = coordinates.coords.longitude;
      setCoordinates(lat + ','+ long)
      
    }
  
  
    useEffect(() => {
      getItem("first");
      var info: any = [];
      getCurrentPosition();
      fire
        .firestore()
        .collection('assets').where('type', 'in', ['company', 'lease', 'well'])
        .onSnapshot((snapshot) => {
          const companies = snapshot.docs.map(((doc) => ({
            id: doc.id,
            ...doc.data()
          })))
          
          for (var key in companies) {
            info.push(companies[key]);
          }
          setCLW(info)

        })
     
  
    }, [])
  
  
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Delivery</IonTitle>
            <IonButtons onClick = {back} slot="end">Back</IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" fullscreen>
  
  
        <IonGrid>
        <IonRow>
        <IonList>
        <IonItem>
            <IonLabel>Company:</IonLabel>
            <IonSelect value={company} okText="Okay" cancelText="Dismiss" onIonChange={e => setcompanyid(e)}>
            {CLW.filter((type: any) => type.type == 'company').map((data: any) => (
                <IonSelectOption key={data.id} value={data}>
                  {data.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Lease:</IonLabel>
            <IonSelect value={lease} okText="Okay" cancelText="Dismiss" onIonChange={e => setleaseid(e)}> 
            {CLW.filter((type: any) => type.company == companyid).map((data: any) => (
                <IonSelectOption key={data.id} value={data} >
                  {data.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Well:</IonLabel>
            <IonSelect value={well} okText="Okay" cancelText="Dismiss" onIonChange={e => setwellid(e)}> 
            {CLW.filter((type: any) => type.lease == leaseid).map((data: any) => (
                <IonSelectOption key={data.id} value={data} >
                  {data.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput value={comment} placeholder="Comments" onIonChange={e => setComment(e.detail.value!)}></IonInput>
          </IonItem>
           
            
            </IonList>
        </IonRow>

        
  
        
        </IonGrid>

        <IonRow>
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
        
        
        { delverychems.filter(type => Object.keys(type).length != 0).map((info: any, index) => (
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
        <IonButton color="primary" expand="full" onClick = {submit}>Submit Deliveries</IonButton>
        </IonRow>

        <IonRow>
        {/* <IonButton color="primary" expand="full" onClick = {submit2}>Submit Deliveries</IonButton> */}
        </IonRow>
  
  
  
  
        
        {/* <IonButtons onClick = {submit} >Submit Data</IonButtons> */}
          
        <IonModal isOpen={showModal} cssClass='my-custom-class'>
        <IonGrid>
        <IonRow>
        <IonLabel>Chemical:</IonLabel>
        <IonSelect value={chemical} placeholder="Select One" onIonChange={e => setChemical(e.detail.value)}>
              { chemicals.filter(type => Object.keys(type).length != 0).map((info: any) => (
                    <IonSelectOption key={info.id} value={info.name}>{info.name}</IonSelectOption>
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
  
  
      
            
          <IonButton onClick={addchem}>Add Chemicals</IonButton>
        </IonModal>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Delivery;
  