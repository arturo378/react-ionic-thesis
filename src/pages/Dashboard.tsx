import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLoading, IonItem, IonLabel, IonButtons } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { loginUser } from '../firebaseConfig';
import { toast } from '../toast';
import { useSelector } from 'react-redux'
import { logoutUser } from '../firebaseConfig'
import { useHistory } from 'react-router'


const Dashboard: React.FC = () => {
    const [busy, setBusy] = useState<boolean>(false)
    

    const username = useSelector((state: any) => state.user.username)
    const history = useHistory()
    async function logout(){
        await logoutUser
        history.replace('/')
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
    


    
        
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
