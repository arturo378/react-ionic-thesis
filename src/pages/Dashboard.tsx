import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLoading, IonItem, IonLabel, IonButtons } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import './Home.css';

import { useSelector } from 'react-redux'
import { logoutUser } from '../firebaseConfig'
import { useHistory } from 'react-router'
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


const Dashboard: React.FC = () => {
    const [busy, setBusy] = useState<boolean>(false)
    const username = useSelector((state: any) => state.user.username)
    const history = useHistory()

    useEffect(() => {
        getItem();
   }, [])

    async function getItem() {
      const { value } = await Storage.get({ key: 'Shipping_paper' });
      console.log('Got item: ', value);
    }


    async function logout(){
        await logoutUser()
        history.replace('/login')
    }

     function shippingPapers(){
        
        history.replace('/shippingpapers')
    }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashobard</IonTitle>
          <IonButtons slot="end"  onClick = {logout}>Logout</IonButtons>
        </IonToolbar>
      </IonHeader>
     
      <IonContent className="ion-padding">
            {/*-- Item as a Button --*/}
            <IonItem button onClick={shippingPapers}>
          <IonLabel>
            Shipping Papers
          </IonLabel>
        </IonItem>
    

  <p>Hello {username}</p>
    
        
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
