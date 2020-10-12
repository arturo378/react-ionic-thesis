import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router'
import * as firebase from 'firebase'
import { getUserInfo } from '../firebaseConfig';



const ShippingPapers: React.FC = () => {

  const history = useHistory()

  function back(){
    
    history.replace('/dashboard')
}

  async function getinfo(){
    var data = await getUserInfo();
    
      // conti - error suppressed when used in this way.
  
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

      <IonButtons onClick = {getinfo} >Press</IonButtons>
        
        
      </IonContent>
    </IonPage>
  );
};

export default ShippingPapers;
